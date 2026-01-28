import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Home, ArrowLeft, Compass, Zap } from "lucide-react";

export default function NotFoundPagePartial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-12">
            <div className="relative inline-block">
              <div className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-blue-100 select-none">
                404
              </div>
            </div>
          </div>
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Oops! Page not found
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The page you are looking for seems to have wandered off into the
              digital void. Don&apos;t worry, even the best project managers lose
              track of things sometimes!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Maybe you were looking for:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Compass className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Dashboard</div>
                    <div className="text-sm text-gray-500">
                      View your boards and projects
                    </div>
                  </div>
                </Link>

                <Link
                  href="/pricing"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Pricing</div>
                    <div className="text-sm text-gray-500">
                      View our plans and features
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
          <div className="mt-12">
            <p className="text-sm text-gray-500 italic">
              &ldquo;The best way to find something is to stop looking for it.&rdquo;
              <br />
              <span className="text-xs">
                — Someone who probably never used a project management tool
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
