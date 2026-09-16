import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Login | SafeZone Disaster Preparedness Portal",
  description: "Sign in to your SafeZone Cadet account to track training progress, simulations, and emergency preparedness credentials.",
};

export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <Navbar mode="learning" />
      <AuthForm initialMode="login" />
    </main>
  );
}
