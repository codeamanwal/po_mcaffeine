import { NextResponse } from 'next/server';

// Mock database
let logistics = [
  { id: 1, name: "Fast Delivery", contact: "John Doe", email: "contact@fast.com", phone: "123-456-7890" }
];

export async function GET() {
  return NextResponse.json({ success: true, data: logistics });
}

export async function POST(request) {
  try {
    const { name, contact, email, phone } = await request.json();
    
    if (!name || !contact) {
      return NextResponse.json(
        { success: false, message: "Name and contact are required" },
        { status: 400 }
      );
    }

    const newLogistic = {
      id: Date.now(),
      name,
      contact,
      email: email || "",
      phone: phone || ""
    };

    logistics.push(newLogistic);

    return NextResponse.json(
      { success: true, data: newLogistic },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}