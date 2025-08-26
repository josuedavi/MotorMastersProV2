import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Zap, Clock, Fuel, ArrowRight } from "lucide-react";

export default function PackageCard({ package: pkg, user, onLogin }) {
  const stageColors = {
    "Stage 1": "bg-green-600",
    "Stage 2": "bg-yellow-600", 
    "Stage 3": "bg-red-600",
    "Custom": "bg-purple-600"
  };

  return (
    <Card className="glass-effect border-gray-700 hover-glow group">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={`${stageColors[pkg.stage]} text-white`}>
            {pkg.stage}
          </Badge>
          <div className="text-2xl font-bold text-white">
            ${pkg.price.toLocaleString()}
          </div>
        </div>
        <CardTitle className="text-xl text-white mb-2">{pkg.name}</CardTitle>
        <p className="text-gray-300 text-sm">{pkg.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">+{pkg.hp_gain}</div>
            <div className="text-xs text-gray-400">HP Gain</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <Zap className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">+{pkg.torque_gain}</div>
            <div className="text-xs text-gray-400">LB-FT Gain</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-300">
            <Fuel className="w-4 h-4 text-blue-400 mr-2" />
            <span>Requires {pkg.fuel_requirement}</span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="w-4 h-4 text-green-400 mr-2" />
            <span>{pkg.delivery_time} delivery</span>
          </div>
        </div>

        {pkg.required_modifications && (
          <div className="text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded">
            <strong>Required:</strong> {pkg.required_modifications}
          </div>
        )}

        {user ? (
          <Link to={createPageUrl(`Checkout?package=${pkg.id}`)}>
            <Button className="w-full bmw-gradient hover:opacity-90 transition-all group-hover:scale-105">
              Order Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <Button
            onClick={onLogin}
            className="w-full bmw-gradient hover:opacity-90 transition-all group-hover:scale-105"
          >
            Login to Order
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}