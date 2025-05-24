"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

type User = {
  id: string;
  name: string;
  rollNumber: string;
};

type Application = {
  id: string;
  notes: string | null;
  applicant: User;
};

type Group = {
  id: string;
  name: string;
  admin: User;
  members: User[];
  isUserAdmin: boolean;
  pendingApplications: Application[];
};

export default function MyGroup() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Application handling states
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationAction, setApplicationAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [responseNote, setResponseNote] = useState("");
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch("/api/groups/current");
        
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("Fetched group details:", data);
            
            if (!data || !data.id) {              console.log("No valid group found, redirecting to dashboard");
              // No valid group found, redirect to dashboard with fallbacks
              try {
                router.push("/dashboard");
                
                // Add fallback redirect after a short delay
                setTimeout(() => {
                  if (window.location.pathname !== "/dashboard") {
                    console.log("Using fallback navigation to dashboard...");
                    window.location.href = "/dashboard";
                  }
                }, 500);
              } catch (navigationError) {
                console.error("Navigation error:", navigationError);
                window.location.href = "/dashboard";
              }
              return;
            }
            
            setGroup(data);
          } else {            console.log("No group found (non-JSON response), redirecting to dashboard");
            try {
              router.push("/dashboard");
              
              // Add fallback redirect after a short delay
              setTimeout(() => {
                if (window.location.pathname !== "/dashboard") {
                  console.log("Using fallback navigation to dashboard...");
                  window.location.href = "/dashboard";
                }
              }, 500);
            } catch (navigationError) {
              console.error("Navigation error:", navigationError);
              window.location.href = "/dashboard";
            }
          }
        } else {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          try {
            const errorData = JSON.parse(errorText);
            setError(errorData.error || "Failed to fetch group details");
          } catch {
            setError("Failed to fetch group details");
          }
          // Don't redirect on error, just show the error message
        }
      } catch (error) {
        console.error("Failed to fetch group details:", error);
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [router]);
  const handleLeaveGroup = async () => {
    if (!group || !group.id) {
      setError("Cannot leave group: Group ID is missing");
      return;
    }
    
    setIsActionLoading(true);
    
    try {
      console.log("Leaving group with ID:", group.id);
      const response = await fetch("/api/groups/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: group.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to leave group");
      }      // Redirect to dashboard with multiple fallbacks
      try {
        console.log("Redirecting to dashboard after leaving group...");
        router.push("/dashboard");
        router.refresh();
        
        // Add an additional safety timeout for fallback navigation
        setTimeout(() => {
          if (window.location.pathname !== "/dashboard") {
            console.log("Using fallback navigation to dashboard...");
            window.location.href = "/dashboard";
          }
        }, 500);
      } catch (navigationError) {
        console.error("Navigation error:", navigationError);
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      console.error("Error leaving group:", error);
    } finally {
      setIsActionLoading(false);
      setIsLeaveModalOpen(false);
    }
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setApplicationAction(null);
    setResponseNote("");
    setIsApplicationModalOpen(true);
  };

  const handleProcessApplication = async () => {
    if (!selectedApplication || !applicationAction) return;
    
    setIsActionLoading(true);
    
    try {
      const response = await fetch("/api/groups/applications/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          status: applicationAction,
          responseNote: responseNote,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process application");
      }

      // Refresh group data
      const groupResponse = await fetch("/api/groups/current");
      const groupData = await groupResponse.json();
      
      if (groupResponse.ok) {
        setGroup(groupData);
      }

      // Close modal
      setIsApplicationModalOpen(false);
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      console.error("Error processing application:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-6 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">No Group Found</h2>
          <p className="text-gray-500">
            You are not currently in a group.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Group: {group.name}</h1>
            <div className="flex space-x-2">
              <Button variant="danger" onClick={() => setIsLeaveModalOpen(true)}>
                Leave Group
              </Button>
              <Link href="/dashboard">
                <Button variant="secondary">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded bg-red-100 p-3 text-red-800">
            {error}
          </div>
        )}        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Group Members ({group.members?.length || 0}/10)</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Roll Number
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">                {group.members?.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-semibold">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-medium">{member.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.id === group.admin.id ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Member
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>        {group.isUserAdmin && group.pendingApplications?.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Pending Applications ({group.pendingApplications?.length || 0})
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Roll Number
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>                <tbody className="bg-white divide-y divide-gray-200">
                  {group.pendingApplications?.map((application) => (
                    <tr key={application.id} className="hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {application.applicant.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-700">
                          {application.applicant.rollNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button 
                          className="mr-2 shadow-sm hover:shadow"
                          onClick={() => handleViewApplication(application)}
                        >
                          View Application
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Leave Group Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        title="Leave Group"
        onClose={() => setIsLeaveModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsLeaveModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleLeaveGroup}
              isLoading={isActionLoading}
            >
              Leave Group
            </Button>
          </>
        }
      >
        <div>
          <p className="mb-4">
            Are you sure you want to leave this group?
          </p>
            {group.isUserAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800">
              <p className="font-medium mb-1">You are the group admin!</p>
              <p>
                {(group.members?.length || 0) > 1
                  ? "If you leave, admin status will be transferred to another member."
                  : "Since you are the only member, the group will be deleted if you leave."}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Application Modal */}
      <Modal
        isOpen={isApplicationModalOpen}
        title="Review Application"
        onClose={() => setIsApplicationModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsApplicationModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            {applicationAction === "APPROVED" && (
              <Button
                onClick={handleProcessApplication}
                isLoading={isActionLoading}
              >
                Approve
              </Button>
            )}
            {applicationAction === "REJECTED" && (
              <Button
                variant="danger"
                onClick={handleProcessApplication}
                isLoading={isActionLoading}
              >
                Reject
              </Button>
            )}
            {!applicationAction && (
              <>
                <Button
                  variant="danger"
                  onClick={() => setApplicationAction("REJECTED")}
                  disabled={isActionLoading}
                  className="mr-2"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => setApplicationAction("APPROVED")}
                  disabled={isActionLoading}
                >
                  Approve
                </Button>
              </>
            )}
          </>
        }
      >        {selectedApplication && (
          <div>
            <div className="mb-5 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Applicant Information:</h3>
              <p className="text-blue-700 font-medium flex items-center">
                <span className="inline-block w-6 h-6 bg-blue-100 rounded-full mr-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                {selectedApplication.applicant.name} ({selectedApplication.applicant.rollNumber})
              </p>
            </div>
            
            {selectedApplication.notes && (
              <div className="mb-5">
                <h3 className="font-semibold text-gray-800 mb-2">Application Note:</h3>
                <p className="bg-gray-50 p-4 rounded-md border border-gray-200 text-gray-700">{selectedApplication.notes}</p>
              </div>
            )}            {applicationAction && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-800">
                  {applicationAction === "APPROVED" ? "Approval" : "Rejection"} Note (Optional):
                </h3>
                <div className={`p-1 rounded-md border ${applicationAction === "APPROVED" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <textarea
                    className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                      applicationAction === "APPROVED" 
                        ? "bg-green-50 border-green-200 focus:ring-green-500 text-green-800" 
                        : "bg-red-50 border-red-200 focus:ring-red-500 text-red-800"
                    }`}
                    rows={4}
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    placeholder={`Add an optional ${applicationAction === "APPROVED" ? "welcome" : "feedback"} message to the applicant...`}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This message will be visible to the applicant in their application history.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
