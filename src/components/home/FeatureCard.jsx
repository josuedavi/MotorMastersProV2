import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeatureCard({ feature }) {
  const { icon: Icon, title, description, color } = feature;
  return (
    <Card className="glass-effect border-gray-700 hover-glow text-center">
      <CardContent className="p-6">
        <div className="mb-4"><Icon className={`w-12 h-12 ${color} mx-auto`} /></div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}