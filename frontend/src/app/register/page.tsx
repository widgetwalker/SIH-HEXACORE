import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Register Cadet | SafeZone Disaster Preparedness Portal",
  description: "Create a SafeZone account to start gamified disaster response training, interactive simulations, and emergency preparedness.",
};

export default function RegisterPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <Navbar mode="learning" />
      <AuthForm initialMode="register" />
    </main>
  );
}
