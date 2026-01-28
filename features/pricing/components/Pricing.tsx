import React from "react";
import Navbar from "@/components/layout/Navbar";
import { PricingTable } from "@clerk/nextjs";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar className="z-0" />
      <div className="py-6 sm:py-12 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-sm sm:text-md text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <PricingTable newSubscriptionRedirectUrl="/dashboard" />
        </div>
      </div>
    </div>
  );
}
