"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUser, logOut } from "@/lib/user";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logistics, setLogistics] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [logisticsToggle , setLogisticsToggle] = useState(false);
  const [warehouseToggle , setWarehouseToggle] = useState(false);
  // Form states
  const [logisticsForm, setLogisticsForm] = useState({
    name: "",
    location: "",
    email: "",
    phone: ""
  });
  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    location: "",
    email: "",
    capacity: ""
  });

  useEffect(() => {
    // Authentication of user session
    try {
      const user = getUser()
      if(user.role === "admin"){
        setIsAuthenticated(true);
        setIsLoading(false);
        fetchLogistics();
        fetchWarehouses();
      }
    } catch (error) {
      router.push("/admin/login");
    }
  }, [router]);

  const fetchLogistics = async () => {
    // Mock data - replace with API call
    const mockLogistics = [
      { id: 1, name: "Fast Delivery", location: "New York", email: "contact@fastdelivery.com", phone: "123-456-7890" },
      { id: 2, name: "Global Shipping", location: "London", email: "info@globalshipping.com", phone: "987-654-3210" }
    ];
    setLogistics(mockLogistics);
  };

  const fetchWarehouses = async () => {
    // Mock data - replace with API call
    const mockWarehouses = [
      { id: 1, name: "Main Warehouse", location: "Chicago", email: "warehouse@company.com", capacity: "5000 sqft" },
      { id: 2, name: "West Coast Hub", location: "Los Angeles", email: "west@company.com", capacity: "3000 sqft" }
    ];
    setWarehouses(mockWarehouses);
  };

  const handleLogout = () => {
    // document.cookie = "adminEmail=; path=/; max-age=0";
    logOut()
    router.push("/admin/login");
  };

  const handleLogisticsSubmit = (e) => {
    e.preventDefault();
    const newLogistics = {
      ...logisticsForm,
      id: Date.now()
    };
    setLogistics([...logistics, newLogistics]);
    setLogisticsForm({ name: "", location: "", email: "", phone: "" });

  };

  const handleWarehouseSubmit = (e) => {
    e.preventDefault();
    const newWarehouse = {
      ...warehouseForm,
      id: Date.now()
    };
    setWarehouses([...warehouses, newWarehouse]);
    setWarehouseForm({ name: "", location: "", email: "", capacity: "" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logistics Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Logistics Partners</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Add Logistics</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Logistics Partner</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogisticsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logistics-name">Company Name</Label>
                    <Input
                      id="logistics-name"
                      name="name"
                      value={logisticsForm.name}
                      onChange={(e) => setLogisticsForm({...logisticsForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logistics-location">Location</Label>
                    <Input
                      id="logistics-location"
                      name="location"
                      value={logisticsForm.location}
                      onChange={(e) => setLogisticsForm({...logisticsForm, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logistics-email">Email</Label>
                    <Input
                      id="logistics-email"
                      name="email"
                      type="email"
                      value={logisticsForm.email}
                      onChange={(e) => setLogisticsForm({...logisticsForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logistics-phone">Phone</Label>
                    <Input
                      id="logistics-phone"
                      name="phone"
                      value={logisticsForm.phone}
                      onChange={(e) => setLogisticsForm({...logisticsForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logistics.map((logistic) => (
                  <TableRow key={logistic.id}>
                    <TableCell className="font-medium">{logistic.name}</TableCell>
                    <TableCell>{logistic.location}</TableCell>
                    <TableCell>{logistic.email}</TableCell>
                    <TableCell>{logistic.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Warehouses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Warehouses</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Add Warehouse</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Warehouse</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleWarehouseSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-name">Warehouse Name</Label>
                    <Input
                      id="warehouse-name"
                      name="name"
                      value={warehouseForm.name}
                      onChange={(e) => setWarehouseForm({...warehouseForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-location">Location</Label>
                    <Input
                      id="warehouse-location"
                      name="location"
                      value={warehouseForm.location}
                      onChange={(e) => setWarehouseForm({...warehouseForm, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-email">Contact Email</Label>
                    <Input
                      id="warehouse-email"
                      name="email"
                      type="email"
                      value={warehouseForm.email}
                      onChange={(e) => setWarehouseForm({...warehouseForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-capacity">Capacity</Label>
                    <Input
                      id="warehouse-capacity"
                      name="capacity"
                      value={warehouseForm.capacity}
                      onChange={(e) => setWarehouseForm({...warehouseForm, capacity: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Capacity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-medium">{warehouse.name}</TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell>{warehouse.email}</TableCell>
                    <TableCell>{warehouse.capacity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}