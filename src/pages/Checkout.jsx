import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl, TunePackage, Order, User, Vehicle } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Car, CreditCard, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    vehicle_info: { make: "BMW", model: "", year: "", transmission: "", vin: "" }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        setFormData(prev => ({ ...prev, customer_name: userData.full_name, customer_email: userData.email }));

        const packageId = new URLSearchParams(window.location.search).get('package');
        if (packageId) {
          const packages = await TunePackage.list();
          const pkg = packages.find(p => p.id === packageId);
          if (pkg) setSelectedPackage(pkg);
        } else {
          navigate(createPageUrl("Home"));
        }
      } catch (error) {
        navigate(createPageUrl("Home"));
      }
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    const [parent, child] = field.split('.');
    setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const vehicle = await Vehicle.create({
        user_id: user.id,
        year: parseInt(formData.vehicle_info.year),
        model: formData.vehicle_info.model,
        vin: formData.vehicle_info.vin || "",
        modifications: ""
      });

      await Order.create({
        customer_id: user.id,
        customer_name: formData.customer_name,
        vehicle_id: vehicle.id,
        vehicle_name: `${formData.vehicle_info.year} ${formData.vehicle_info.make} ${formData.vehicle_info.model}`,
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        total_amount: selectedPackage.price,
        payment_status: "paid"
      });
      navigate(createPageUrl("CustomerPortal"));
    } catch (error) {
      console.error("Error creating order:", error);
    }
    setProcessing(false);
  };

  if (loading || !selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate(createPageUrl("Home"))} className="text-gray-300 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-effect border-gray-700">
                <CardHeader><CardTitle className="flex items-center text-white"><Car className="w-5 h-5 mr-2 text-blue-400" />Vehicle Information</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <Input value={formData.vehicle_info.model} onChange={(e) => handleInputChange('vehicle_info.model', e.target.value)} placeholder="Model (e.g. M340i)" className="bg-gray-800 border-gray-600 text-white" required />
                  <Input type="number" value={formData.vehicle_info.year} onChange={(e) => handleInputChange('vehicle_info.year', e.target.value)} placeholder="Year" className="bg-gray-800 border-gray-600 text-white" required />
                  <Select value={formData.vehicle_info.transmission} onValueChange={(v) => handleInputChange('vehicle_info.transmission', v)} required>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Transmission" /></SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600"><SelectItem value="Automatic" className="text-white">Automatic</SelectItem><SelectItem value="Manual" className="text-white">Manual</SelectItem></SelectContent>
                  </Select>
                  <Input value={formData.vehicle_info.vin} onChange={(e) => handleInputChange('vehicle_info.vin', e.target.value)} placeholder="VIN (Optional)" className="bg-gray-800 border-gray-600 text-white" />
                </CardContent>
              </Card>
              <Card className="glass-effect border-gray-700">
                <CardHeader><CardTitle className="flex items-center text-white"><CreditCard className="w-5 h-5 mr-2 text-blue-400" />Contact</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <Input value={formData.customer_name} disabled className="bg-gray-800 border-gray-600 text-white" />
                  <Input value={formData.customer_email} disabled className="bg-gray-800 border-gray-600 text-white" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="glass-effect border-gray-700 sticky top-8">
                <CardHeader><CardTitle className="text-white">Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-white">{selectedPackage.name}</div>
                      <div className="text-sm text-gray-400">{selectedPackage.stage}</div>
                    </div>
                    <div className="text-white">${selectedPackage.price.toLocaleString()}</div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between items-center text-lg font-semibold"><span className="text-white">Total</span><span className="text-blue-400">${selectedPackage.price.toLocaleString()}</span></div>
                  <Button type="submit" disabled={processing} className="w-full bmw-gradient">{processing ? 'Processing...' : 'Complete Order'}</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}