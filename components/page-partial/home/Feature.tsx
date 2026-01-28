import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Zap, Shield, BarChart3, Smartphone, Globe } from "lucide-react";

function Feature() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Everything you need to get organized
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features that help teams of all sizes work more efficiently
            and stay organized.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Work together seamlessly with real-time updates, comments, and
                notifications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Built for speed with instant updates and smooth drag-and-drop
                functionality.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Enterprise-grade security with 99.9% uptime guarantee for your
                peace of mind.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Track progress with detailed analytics and performance insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>Mobile Ready</CardTitle>
              <CardDescription>
                Access your boards anywhere with our responsive mobile
                interface.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Global Access</CardTitle>
              <CardDescription>
                Work from anywhere in the world with our cloud-based platform.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Feature;
