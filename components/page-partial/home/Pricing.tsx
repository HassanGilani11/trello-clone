import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the plan right for your team. Upgrade or downgrade at
            any time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">$0</div>
              <CardDescription>
                Perfect for individuals and small teams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>1 board</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited cards</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic integrations</span>
                </li>
              </ul>
              <Link href="/sign-up" className="block">
                <Button variant="outline" className="w-full cursor-pointer">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500 relative dark:bg-gray-800">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white">Most Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">$9.99</div>
              <CardDescription>
                For growing teams and businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited boards</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/pricing" className="block">
                <Button className="w-full cursor-pointer">
                  Start Pro Trial
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">$29.99</div>
              <CardDescription>For large organizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>SSO integration</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>24/7 phone support</span>
                </li>
              </ul>
              <Link href="/pricing" className="block">
                <Button variant="outline" className="w-full cursor-pointer">
                  Contact Sales
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View all pricing details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
