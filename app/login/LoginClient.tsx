"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import { ArrowLeft, GraduationCap, HeartHandshake, UserCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

type Role = "student" | "peer-mentor" | "counselor";

const roleConfig = {
  student: {
    title: "Welcome Back",
    subtitle: "Sign in to access your support dashboard",
    icon: GraduationCap,
    createLink: "/signup/student",
    createLabel: "Create account",
  },
  "peer-mentor": {
    title: "Welcome Back, Mentor",
    subtitle: "Continue supporting students",
    icon: HeartHandshake,
    createLink: "/apply/peer-mentor",
    createLabel: "Apply as mentor",
  },
  counselor: {
    title: "Welcome Back, Counselor",
    subtitle: "Access your counselor dashboard",
    icon: UserCheck,
    createLink: "/apply/counselor",
    createLabel: "Apply as counselor",
  },
};

export function LoginClient({ initialRole }: { initialRole: Role }) {
  const router = useRouter();
  const [role] = useState<Role>(initialRole);
  const { loginWithEmail, isFirebaseBacked, profile, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const config = useMemo(() => roleConfig[role], [role]);
  const Icon = config.icon;

  useEffect(() => {
    if (hasLoggedIn && !authLoading && profile && profile.role) {
      if (profile.status === "pending") {
        router.push("/pending-approval");
      } else if (profile.status === "disabled") {
        setError("Your account has been disabled. Please contact support.");
        setHasLoggedIn(false);
        setIsLoading(false);
      } else if (profile.role === role) {
        router.push(role === "student" ? "/student/dashboard" : `/${role}/dashboard`);
      } else {
        router.push(profile.role === "student" ? "/student/dashboard" : `/${profile.role}/dashboard`);
      }
    }
  }, [hasLoggedIn, profile, authLoading, role, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setHasLoggedIn(false);
    try {
      await loginWithEmail(email, password);
      setHasLoggedIn(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Could not sign in. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
      setHasLoggedIn(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-brand-teal/10 blur-[120px] tk-float" />
        <div className="absolute -right-40 bottom-20 h-[350px] w-[350px] rounded-full bg-sun-400/8 blur-[100px] tk-float2" />
        <div className="absolute top-0 left-0 right-0 h-1.5 brand-border" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-6 md:px-12">
          <Logo />
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
          <div className="w-full max-w-md">
            {/* Role badge */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-5 py-3">
                <Icon className="h-5 w-5 text-brand-teal" />
                <span className="text-sm font-semibold text-gray-200">
                  {role === "student" ? "Student" : role === "peer-mentor" ? "Peer Mentor" : "Counselor"}
                </span>
              </div>
            </div>

            {/* Login Card */}
            <div className="tk-card p-8">
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl font-bold text-white">{config.title}</h1>
                <p className="mt-2 text-gray-400">{config.subtitle}</p>
              </div>

              {!isFirebaseBacked && (
                <div className="mb-6 rounded-xl border border-sun-400/30 bg-sun-400/10 p-4">
                  <p className="text-sm font-semibold text-sun-400">Demo Mode</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Firebase is not configured. Add keys in `.env.local`.
                  </p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-200">Email</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    className="border-gray-700/50 bg-dark-800/50 text-white placeholder:text-gray-600 focus:border-brand-teal focus:ring-brand-teal/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-200">Password</label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    type="password"
                    autoComplete="current-password"
                    className="border-gray-700/50 bg-dark-800/50 text-white placeholder:text-gray-600 focus:border-brand-teal focus:ring-brand-teal/30"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-sm font-medium text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-brand-teal to-tk-600 py-6 text-base font-bold text-white shadow-lg shadow-brand-teal/30 transition-all hover:shadow-xl hover:shadow-brand-teal/50 disabled:opacity-50"
                  disabled={!isFirebaseBacked || isLoading || !email.trim() || !password.trim()}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-sm text-gray-500">Don&apos;t have an account? </span>
                <Link href={config.createLink} className="text-sm font-semibold text-brand-teal hover:text-brand-teal-light transition-colors">
                  {config.createLabel}
                </Link>
              </div>
            </div>

            {/* Encouragement */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Sparkles className="h-4 w-4 text-brand-teal" />
                <p className="text-sm">Your journey to wellness starts here</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
