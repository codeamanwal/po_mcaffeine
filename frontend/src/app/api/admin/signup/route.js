import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists (mock check)
    const mockUsers = [
      { email: "admin@admin.com" }
    ];
    
    if (mockUsers.some(user => user.email === email)) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // In a real app, you would:
    // 1. Hash the password
    // 2. Save to database
    // 3. Send verification email

    return NextResponse.json(
      { 
        success: true, 
        message: "Signup successful",
        data: {
          id: Date.now(), // Mock ID
          email,
          name
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}