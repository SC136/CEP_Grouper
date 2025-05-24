"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNumber: formData.rollNumber,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }      // User created successfully, show success message
      setSuccess("Account created successfully! Signing you in...");
        // Wait briefly to show the success message
      setTimeout(async () => {
        try {
          // Now automatically sign them in
          const signInResult = await signIn("credentials", {
            redirect: false,
            rollNumber: formData.rollNumber,
            password: formData.password,
          });
    
          if (signInResult?.error) {
            // If sign-in fails, redirect to sign-in page
            console.log("Sign-in failed, redirecting to sign-in page");
            router.push("/auth/signin?registered=true");
            
            // Fallback redirect
            setTimeout(() => {
              window.location.href = "/auth/signin?registered=true";
            }, 500);
          } else {
            // If sign-in succeeds, redirect to dashboard
            console.log("Sign-in successful, redirecting to dashboard");
            router.push("/dashboard");
            router.refresh();
            
            // Fallback redirect to ensure navigation happens
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 500);
          }
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          // Final fallback
          window.location.href = "/dashboard";
        }
      }, 1500); // Wait 1.5 seconds to show the success message
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      console.error("Sign-up error:", error);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md border border-gray-200">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Create Account</h1>
          {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-800 font-medium">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded bg-green-100 p-3 text-green-800 font-medium">
            {success}
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
            id="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
          
          <Input
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
          
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />            <Button
            type="submit"
            className="w-full mt-6 cursor-pointer"
            isLoading={isLoading}
            disabled={isLoading || success !== ""}
          >
            {success ? "Account Created" : "Sign Up"}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-700 font-medium">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
