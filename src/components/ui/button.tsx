"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  children,
  className,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {  const baseClasses = "px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer shadow-sm hover:shadow";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 border border-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-red-700"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled || isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
