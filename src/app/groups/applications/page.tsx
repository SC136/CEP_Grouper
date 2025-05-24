"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";

type Group = {
  id: string;
  name: string;
  admin: {
    name: string;
    rollNumber: string;
  };
};

type Application = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes: string | null;
  responseNote: string | null;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  group: Group;
};

export default function ApplicationHistory() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicationHistory = async () => {
      try {
        const response = await fetch("/api/groups/applications/history");
        const data = await response.json();
        
        if (response.ok) {
          setApplications(data);
        } else {
          setError(data.error || "Failed to fetch application history");
          console.error("Error fetching application history:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch application history:", error);
        setError("Failed to load application history");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationHistory();
  }, []);

  // Function to format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Function to get appropriate status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <span className="px-3 py-1.5 text-xs rounded-full bg-yellow-100 text-yellow-800 font-semibold border border-yellow-200">Pending</span>;
      case 'APPROVED':
        return <span className="px-3 py-1.5 text-xs rounded-full bg-green-100 text-green-800 font-semibold border border-green-200">Approved</span>;
      case 'REJECTED':
        return <span className="px-3 py-1.5 text-xs rounded-full bg-red-100 text-red-800 font-semibold border border-red-200">Rejected</span>;
      default:
        return <span className="px-3 py-1.5 text-xs rounded-full bg-gray-100 text-gray-800 font-semibold border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <Link href="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded bg-red-100 p-3 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No Applications Found</h2>
            <p className="text-gray-500">
              You haven't applied to any groups yet.
            </p>
            <div className="mt-6">
              <Link href="/groups/join">
                <Button>Find Groups to Join</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Application History</h2>
            
            <div className="space-y-6">
              {applications.map((application) => (                <div 
                  key={application.id} 
                  className="border rounded-lg p-5 bg-white shadow-sm"
                >
                  <div className="flex flex-col md:flex-row justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.group.name}</h3>
                      <p className="text-sm text-gray-700 font-medium">
                        Admin: <span className="font-semibold">{application.group.admin.name}</span> ({application.group.admin.rollNumber})
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-start">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Applied:</span> {formatDate(application.createdAt)}
                    </p>
                    {application.status !== "PENDING" && (
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Updated:</span> {formatDate(application.updatedAt)}
                      </p>
                    )}
                  </div>
                    {application.notes && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm font-semibold text-blue-800 mb-1">Your message:</p>
                      <p className="text-sm text-blue-700 font-medium">{application.notes}</p>
                    </div>
                  )}
                  
                  {application.responseNote && (
                    <div className="mt-3 p-4 bg-indigo-50 rounded-md border border-indigo-100">
                      <p className="text-sm font-semibold text-indigo-800 mb-1">Response from admin:</p>
                      <p className="text-sm text-indigo-700 font-medium">{application.responseNote}</p>
                    </div>
                  )}
                  
                  {application.status === "REJECTED" && (
                    <div className="mt-4">
                      <Link href={`/groups/join`}>
                        <Button size="sm">Apply Again</Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
