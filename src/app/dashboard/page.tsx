"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const [userGroup, setUserGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const response = await fetch("/api/groups/current");
        
        if (response.ok) {
          // Check if response is null or empty
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("User group data:", data);
            setUserGroup(data);
          } else {
            setUserGroup(null);
          }
        } else {
          console.error("Error fetching group data");
          setUserGroup(null);
        }
      } catch (error) {
        console.error("Failed to fetch user group:", error);
        setUserGroup(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroup();
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">          <h1 className="text-2xl font-bold text-gray-900">CEP Grouper</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">
              Welcome, <span className="font-semibold text-black">{session?.user?.name}</span> ({session?.user?.rollNumber})
            </p>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>      <main className="max-w-6xl mx-auto px-4 py-8">
        {(!userGroup || !userGroup.id) ? (          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Join or Create a Group</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium mb-4">Create a New Group</h3>
                <p className="text-gray-500 mb-6 text-center">
                  Start your own group and invite others to join.
                </p>
                <Link href="/groups/create" className="w-full">
                  <Button className="w-full">Create Group</Button>
                </Link>
              </div>
              
              <div className="border rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium mb-4">Join an Existing Group</h3>
                <p className="text-gray-500 mb-6 text-center">
                  Browse and apply to join available groups.
                </p>
                <Link href="/groups/join" className="w-full">
                  <Button className="w-full">Join Group</Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">My Applications</h3>
                <Link href="/groups/applications">
                  <Button variant="secondary">View Application History</Button>
                </Link>
              </div>
              <p className="text-gray-500 mt-2">
                View the status of your group applications and any responses from group admins.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Group: {userGroup.name}
              </h2>
              <Link href="/groups/my-group">
                <Button>View Group</Button>
              </Link>
            </div>
              <h3 className="font-medium mb-2">Members ({userGroup.members?.length || 0}/10):</h3>
            <ul className="mb-6 list-disc pl-5">
              {userGroup.members?.map((member: any) => (
                <li key={member.id} className="mb-2 text-gray-800 font-medium">
                  <span className="font-semibold text-black">{member.name}</span> ({member.rollNumber})
                  {member.id === userGroup.admin.id && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-bold">Admin</span>}
                </li>
              ))}
            </ul>
            
            {userGroup.isUserAdmin && userGroup.pendingApplications?.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">
                  Pending Applications ({userGroup.pendingApplications.length}):
                </h3>
                <Link href="/groups/my-group">
                  <Button variant="secondary">Manage Applications</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
