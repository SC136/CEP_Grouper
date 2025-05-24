"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, className, ...props }, ref) => {
    return (      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-800 mb-1">
          {label}
        </label>        <input
          ref={ref}
          id={id}
          style={{ 
            color: '#000000', 
            caretColor: '#000000',
            backgroundColor: '#ffffff',
            borderColor: '#d1d5db',
            fontWeight: '500',
            fontSize: '1rem'
          }} 
          className={`w-full px-3 py-2 border rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-medium placeholder-gray-500 ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
