"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("call back token", token)

    if (token) {
      // ✅ Save the token locally
      localStorage.setItem("jwt_token", token);

      // ✅ Redirect to home or dashboard
      router.push("/");
    } else {
      // If no token found (error)
      router.push("/login");
    }
  }, [router]);

  return <p>Signing you in...</p>;
}
