import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TunePackage, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Car, Zap, Shield, Clock, Star, ChevronRight, Gauge, Settings, Award } from "lucide-react";

import VehicleSelector from "../components/home/VehicleSelector";
import PackageCard from "../components/home/PackageCard";
import FeatureCard from "../components/home/FeatureCard";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const packagesData = await TunePackage.list();
      setPackages(packagesData);
      
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    await User.login();
  };

  const compatibleModels = [
    "M240i", "340i", "440i", "540i", "740i", 
    "X3 M40i", "X4 M40i", "Z4 M40i", "Supra 3.0T"
  ];

  const features = [
    {
      icon: Award,
      title: "Expert Tuning",
      description: "10+ years of BMW B58 tuning experience with thousands of satisfied customers",
      color: "text-blue-400"
    },
    {
      icon: Shield,
      title: "Engine Safe",
      description: "Conservative tuning approach with built-in safety parameters and monitoring",
      color: "text-green-400"
    },
    {
      icon: Zap,
      title: "Instant Power",
      description: "Unlock up to 100+ HP and 130+ lb-ft of torque with our proven tune files",
      color: "text-yellow-400"
    },
    {
      icon: Settings,
      title: "Custom Solutions",
      description: "Personalized tuning for your specific modifications and fuel requirements",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bmw-gradient rounded-full flex items-center justify-center">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                B58 <span className="text-blue-400">Tuning</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock the true potential of your BMW B58 engine with our premium performance tuning solutions
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {compatibleModels.slice(0, 6).map((model) => (
                <Badge key={model} variant="secondary" className="bg-gray-800/50 text-gray-300 border-gray-700">
                  {model}
                </Badge>
              ))}
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-500">
                +3 More Models
              </Badge>
            </div>
          </div>

          <VehicleSelector onVehicleSelect={setSelectedVehicle} />

          {selectedVehicle && (
            <div className="mt-8 p-6 glass-effect rounded-xl max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-2">Selected Vehicle</h3>
              <p className="text-gray-300">
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </p>
              <p className="text-sm text-gray-400">{selectedVehicle.transmission} Transmission</p>
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
        </div>
      </section>

      {/* Tuning Packages Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Performance <span className="text-blue-400">Packages</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our carefully crafted tuning packages designed to maximize your B58's potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {packages.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                package={pkg} 
                user={user} 
                onLogin={handleLogin}
              />
            ))}
          </div>

          {!user && (
            <div className="text-center">
              <Button
                onClick={handleLogin}
                size="lg"
                className="bmw-gradient hover:opacity-90 transition-opacity px-8 py-3"
              >
                Login to Start Your Tune
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-blue-400">B58 Tuning</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Industry-leading expertise and cutting-edge technology for the ultimate tuning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="glass-effect rounded-xl p-8 hover-glow">
              <Gauge className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">5,000+</div>
              <div className="text-gray-300">Vehicles Tuned</div>
            </div>
            <div className="glass-effect rounded-xl p-8 hover-glow">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-gray-300">Customer Rating</div>
            </div>
            <div className="glass-effect rounded-xl p-8 hover-glow">
              <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">24-48h</div>
              <div className="text-gray-300">Turnaround Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your <span className="text-blue-400">BMW</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who have unleashed their B58's true potential
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to={createPageUrl("CustomerPortal")}>
                <Button size="lg" className="bmw-gradient hover:opacity-90 transition-opacity px-8 py-3">
                  View My Orders
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleLogin}
                size="lg"
                className="bmw-gradient hover:opacity-90 transition-opacity px-8 py-3"
              >
                Get Started Today
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}