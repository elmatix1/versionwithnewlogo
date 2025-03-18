
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, LogIn, Shield, Users, Package, Truck } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/logo.png" alt="SmartLogi" className="h-8" />
        </div>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate('/login')}
        >
          <LogIn className="h-4 w-4" />
          Connexion
        </Button>
      </header>

      {/* Hero Section */}
      <section className="bg-[#111827] text-white px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your logistics operations?
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of companies that use SmartLogi TMS to optimize their transport
              management processes and reduce operational costs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate('/login')} 
                className="flex items-center gap-2"
                size="lg"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('https://example.com/demo', '_blank')}
                className="bg-transparent text-white border-white hover:bg-white/10"
                size="lg"
              >
                Request a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <Badge className="mb-4">Key Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Transport Management Tools</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our TMS provides comprehensive tools to streamline your logistics operations and improve
            efficiency across your supply chain.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
            <p className="text-gray-600">
              Role-based access control ensures data security and proper authorization.
            </p>
          </Card>

          <Card className="p-6">
            <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <p className="text-gray-600">
              Add, search, modify, and delete users with a simple and intuitive interface.
            </p>
          </Card>

          <Card className="p-6">
            <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Order Scheduling</h3>
            <p className="text-gray-600">
              Efficiently schedule and verify orders to optimize your logistics operations.
            </p>
          </Card>

          <Card className="p-6">
            <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Automatic Scheduling</h3>
            <p className="text-gray-600">
              Let the system optimize delivery routes based on multiple parameters.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4">Next-Generation TMS</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Smart Logistics<br />Management System
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Optimize your transport operations with our intelligent TMS platform. Automate scheduling,
            track deliveries, and manage your logistics operations with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/login')} 
              className="flex items-center gap-2"
              size="lg"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2"
              size="lg"
            >
              Log In
              <LogIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img src="/lovable-uploads/logo.png" alt="SmartLogi" className="h-6" />
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} SmartLogi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
