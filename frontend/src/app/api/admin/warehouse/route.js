import { NextResponse } from 'next/server';

// Mock database
let warehouses = [
  { id: 1, name: "Main Warehouse", location: "New York", capacity: "5000 sqft", email: "warehouse@example.com" }
];

export async function GET() {
  return NextResponse.json({ success: true, data: warehouses });
}

export async function POST(request) {
  try {
    const { name, location, capacity, email } = await request.json();
    
    if (!name || !location || !capacity) {
      return NextResponse.json(
        { success: false, message: "Name, location and capacity are required" },
        { status: 400 }
      );
    }

    const newWarehouse = {
      id: Date.now(),
      name,
      location,
      capacity,
      email: email || ""
    };

    warehouses.push(newWarehouse);

    return NextResponse.json(
      { success: true, data: newWarehouse },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}