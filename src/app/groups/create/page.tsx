"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function CreateGroup() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName }),
      });

      // Check for non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create group");
      }      // Show success message
      setSuccess(`Group "${groupName}" created successfully! Redirecting to dashboard...`);
        // Reset loading state
      setIsLoading(false);
      
      // Redirect to dashboard after a short delay to show the success message
      setTimeout(() => {
        try {
          console.log("Redirecting to dashboard...");
          router.push("/dashboard");
          
          // Add an additional safety timeout to force navigation if the router.push doesn't work
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 500);
        } catch (navigationError) {
          console.error("Navigation error:", navigationError);
          // Fallback to direct location change
          window.location.href = "/dashboard";
        }
      }, 1500); // 1.5 second delay
      
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      console.error("Group creation error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Create a New Group</h1>
            <Link href="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="mb-6 rounded bg-red-100 p-3 text-red-800">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 rounded bg-green-100 p-3 text-green-800">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              id="groupName"
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter a unique group name"
              required
            />            <div className="flex justify-end mt-6">
              <Button 
                type="submit" 
                isLoading={isLoading}
                disabled={isLoading || success !== ""}
              >
                {success ? "Group Created" : "Create Group"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
