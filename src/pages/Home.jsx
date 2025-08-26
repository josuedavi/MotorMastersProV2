import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Zap, Shield, Clock, Star, ChevronRight, Gauge, Settings, Award, Loader2 } from "lucide-react";
import VehicleSelector from "../components/home/VehicleSelector";
import PackageCard from "../components/home/PackageCard";
import FeatureCard from "../components/home/FeatureCard";
import { TunePackage, User, createPageUrl } from "@/api/entities";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [packagesData, userData] = await Promise.all([
          TunePackage.list(),
          User.me().catch(() => null)
        ]);
        setPackages(packagesData);
        setUser(userData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const features = [
    { icon: Award, title: "Expert Tuning", description: "10+ years of BMW B58 tuning experience.", color: "text-blue-400" },
    { icon: Shield, title: "Engine Safe", description: "Conservative tuning with built-in safety parameters.", color: "text-green-400" },
    { icon: Zap, title: "Instant Power", description: "Unlock up to 100+ HP and 130+ lb-ft of torque.", color: "text-yellow-400" },
    { icon: Settings, title: "Custom Solutions", description: "Personalized tuning for your specific modifications.", color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bmw-gradient rounded-full flex items-center justify-center"><Car className="w-7 h-7 text-white" /></div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">B58 <span className="text-blue-400">Tuning</span></h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">Unlock the true potential of your BMW B58 engine</p>
          <VehicleSelector onVehicleSelect={setSelectedVehicle} />
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"><ChevronRight className="w-6 h-6 text-gray-400 rotate-90" /></div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Performance <span className="text-blue-400">Packages</span></h2>
            <p className="text-xl text-gray-300">Choose from our carefully crafted tuning packages</p>
          </div>
          {loading ? (
             <div className="flex justify-center"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {packages.map((pkg) => <PackageCard key={pkg.id} package={pkg} user={user} />)}
            </div>
          )}
        </div>
      </section>
      
      <section className="py-20 bg-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose <span className="text-blue-400">B58 Tuning</span></h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => <FeatureCard key={index} feature={feature} />)}
            </div>
         </div>
      </section>
    </div>
  );
}