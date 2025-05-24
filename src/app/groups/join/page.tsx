"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

type Group = {
  id: string;
  name: string;
  admin: {
    name: string;
    rollNumber: string;
  };
  _count: {
    members: number;
  };
};

export default function JoinGroup() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    // Application state
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAvailableGroups = async () => {
      try {
        const response = await fetch("/api/groups/available");
        const data = await response.json();
        
        if (response.ok) {
          setGroups(data);
        } else {
          setError(data.error || "Failed to fetch groups");
          console.error("Error fetching groups:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch available groups:", error);
        setError("Failed to load available groups");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableGroups();
  }, []);

  const handleApply = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedGroup) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/groups/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: selectedGroup.id,
          notes: applicationNotes,
        }),
      });

      const data = await response.json();      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      // Close modal and show a success message
      setIsModalOpen(false);
      setError(""); // Clear any previous errors
      setSuccess(`Application submitted successfully to group "${selectedGroup.name}". You can view your application status in the Application History.`);
      
      // Redirect to applications page after a short delay
      setTimeout(() => {
        try {
          console.log("Redirecting to applications history...");
          router.push("/groups/applications");
          
          // Fallback navigation
          setTimeout(() => {
            if (window.location.pathname !== "/groups/applications") {
              window.location.href = "/groups/applications";
            }
          }, 500);
        } catch (navigationError) {
          console.error("Navigation error:", navigationError);
          window.location.href = "/groups/applications";
        }
      }, 2000);
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      console.error("Application submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Join a Group</h1>
            <Link href="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>      <main className="max-w-6xl mx-auto px-4 py-8">        {error && (
          <div className="mb-6 rounded bg-red-100 p-3 text-red-800">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 rounded bg-green-100 p-3 text-green-800 font-medium">
            {success}
          </div>
        )}
        
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Join a Group</h2>
          <Link href="/groups/applications">
            <Button variant="secondary">View My Applications</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No Groups Available</h2>
            <p className="text-gray-500">
              There are currently no groups available to join. You can create your own group.
            </p>
            <div className="mt-6">
              <Link href="/groups/create">
                <Button>Create a Group</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Available Groups</h2>
            
            <div className="grid gap-4">              {groups.map((group) => (
                <div 
                  key={group.id} 
                  className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-700 font-medium mt-1">
                      Admin: <span className="font-semibold">{group.admin.name}</span> ({group.admin.rollNumber})
                    </p>
                    <p className="text-sm text-gray-700 font-medium mt-1 flex items-center">
                      <span>Members:</span> 
                      <span className="ml-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-semibold">
                        {group._count.members}/10
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button onClick={() => handleApply(group)}>
                      Apply to Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Modal */}
        <Modal
          isOpen={isModalOpen}
          title={`Apply to Join ${selectedGroup?.name || ""}`}
          onClose={() => setIsModalOpen(false)}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitApplication}
                isLoading={isSubmitting}
              >
                Submit Application
              </Button>
            </>
          }
        >
          <div>
            <p className="mb-4">
              You are applying to join <strong>{selectedGroup?.name}</strong>. 
              You can add an optional note to the group admin below.
            </p>
            <div className="mb-4">
              <label 
                htmlFor="notes" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Application Notes (Optional)
              </label>
              <textarea
                id="notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
                placeholder="Add any information you want to share with the group admin..."
              />
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
