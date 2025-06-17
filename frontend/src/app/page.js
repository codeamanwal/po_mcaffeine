"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(";").map(c => c.trim());
    const adminEmailCookie = cookies.find(c => c.startsWith("adminEmail="));
    if (adminEmailCookie) {
      router.push("/admin");
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  return null;
}
