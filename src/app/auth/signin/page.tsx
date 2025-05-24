"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rollNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        rollNumber: formData.rollNumber,
        password: formData.password,
      });      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        try {
          console.log("Sign-in successful, redirecting to dashboard");
          router.push("/dashboard");
          router.refresh();
          
          // Add fallback redirect
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 500);
        } catch (navigationError) {
          console.error("Navigation error:", navigationError);
          // Fallback to direct location change
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md border border-gray-200">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Sign In</h1>
        
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-800 font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>          <Input
            id="rollNumber"
            label="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            placeholder="Enter your roll number"
            required
          />
          
          <Input
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
            <Button
            type="submit"
            className="w-full mt-6 cursor-pointer"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-700 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
