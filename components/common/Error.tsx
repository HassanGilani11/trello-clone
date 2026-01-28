"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryText = "Try again",
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
}
