import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const vehicleData = {
  BMW: { "M240i": { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023] }, "340i": { years: [2016, 2017, 2018, 2019] } },
  Toyota: { "Supra 3.0": { years: [2020, 2021, 2022, 2023] } }
};

export default function VehicleSelector({ onVehicleSelect }) {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");

  const isComplete = selectedMake && selectedModel && selectedYear && selectedTransmission;

  return (
    <Card className="glass-effect border-gray-700 max-w-4xl mx-auto">
      <CardHeader className="text-center"><CardTitle className="flex items-center justify-center space-x-2 text-white"><Car className="w-6 h-6 text-blue-400" /><span>Select Your Vehicle</span></CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={selectedMake} onValueChange={setSelectedMake}><SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Make" /></SelectTrigger><SelectContent className="bg-gray-800 border-gray-600">{Object.keys(vehicleData).map((make) => <SelectItem key={make} value={make} className="text-white">{make}</SelectItem>)}</SelectContent></Select>
          <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedMake}><SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Model" /></SelectTrigger><SelectContent className="bg-gray-800 border-gray-600">{(selectedMake ? Object.keys(vehicleData[selectedMake]) : []).map((model) => <SelectItem key={model} value={model} className="text-white">{model}</SelectItem>)}</SelectContent></Select>
          <Select value={selectedYear} onValueChange={setSelectedYear} disabled={!selectedModel}><SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Year" /></SelectTrigger><SelectContent className="bg-gray-800 border-gray-600">{(selectedMake && selectedModel ? vehicleData[selectedMake][selectedModel].years : []).map((year) => <SelectItem key={year} value={year.toString()} className="text-white">{year}</SelectItem>)}</SelectContent></Select>
          <Select value={selectedTransmission} onValueChange={setSelectedTransmission}><SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Transmission" /></SelectTrigger><SelectContent className="bg-gray-800 border-gray-600"><SelectItem value="Automatic" className="text-white">Automatic</SelectItem><SelectItem value="Manual" className="text-white">Manual</SelectItem></SelectContent></Select>
        </div>
      </CardContent>
    </Card>
  );
}