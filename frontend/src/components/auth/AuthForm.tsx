"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./AuthForm.module.css";

interface AuthFormProps {
  initialMode?: "login" | "register";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const router = useRouter();
  const { login, register, loading, error, clearError } = useAuth();

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"STUDENT" | "FACULTY" | "ADMIN">("STUDENT");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [age, setAge] = useState<number>(15);

  const handleModeSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      const success = await login(email, password);
      if (success) {
        router.push("/profile");
      }
    } else {
      const success = await register({
        email,
        password,
        full_name: fullName,
        role,
        school: school || undefined,
        grade: grade || undefined,
        age: Number(age) || 15,
      });
      if (success) {
        router.push("/profile");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.glowOrb} />
      
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <span>🛡️ SafeZone Security Portal</span>
          </div>
          <h1 className={styles.title}>
            {mode === "login" ? "Cadet Authentication" : "Cadet Registration"}
          </h1>
          <p className={styles.subtitle}>
            {mode === "login"
              ? "Sign in to access your disaster training simulations & credentials"
              : "Create an account to track readiness metrics & certifications"}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => handleModeSwitch("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
            onClick={() => handleModeSwitch("register")}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={styles.alert}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === "register" && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>✉️</span>
              <input
                type="email"
                required
                placeholder="cadet@school.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Role / Designation</label>
                <div className={styles.roleSelector}>
                  {(["STUDENT", "FACULTY", "ADMIN"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`${styles.roleBtn} ${role === r ? styles.roleBtnActive : ""}`}
                      onClick={() => setRole(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>School / Institute</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🏫</span>
                  <input
                    type="text"
                    placeholder="e.g. Delhi Public School"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Grade / Class</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>🎓</span>
                    <input
                      type="text"
                      placeholder="Grade 10"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Age</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>🎂</span>
                    <input
                      type="number"
                      min={6}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 15)}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? (
              <>
                <div className={styles.spinner} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{mode === "login" ? "Enter SafeZone →" : "Register Cadet →"}</span>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          {mode === "login" ? (
            <p>
              New to SafeZone?
              <span className={styles.link} onClick={() => handleModeSwitch("register")}>
                Create an Account
              </span>
            </p>
          ) : (
            <p>
              Already have an account?
              <span className={styles.link} onClick={() => handleModeSwitch("login")}>
                Sign In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
