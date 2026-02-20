"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, Lock, Shield, Heart, Users, Sparkles } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Teal glow */}
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-brand-teal/10 blur-[150px] tk-float" />
        {/* Yellow glow */}
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-sun-400/8 blur-[120px] tk-float2" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-brand-teal/5 blur-[100px] tk-float" style={{ animationDelay: "3s" }} />
        
        {/* Brand stripe at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 brand-border" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="px-6 py-6 md:px-12">
          <Logo />
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
          <div className="w-full max-w-2xl text-center">
            {/* Icon accent */}
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-teal/30 to-sun-400/30 shadow-xl shadow-brand-teal/20 animate-pulse">
              <Heart className="h-10 w-10 text-white" />
            </div>

            {/* Welcome text */}
            <p className="mb-4 text-lg font-medium text-brand-teal">
              Welcome to Theraklick
            </p>

            {/* Main headline */}
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              You Are Not Alone
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
              Stress, anxiety, exams, relationships — we are here with calm, 
              private support whenever you need it. Your wellbeing matters to us.
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-4 py-2 text-gray-200">
                <Lock className="h-4 w-4 text-brand-teal" /> Private & Secure
              </span>
              <span className="flex items-center gap-2 rounded-full border border-sun-400/30 bg-sun-400/10 px-4 py-2 text-gray-200">
                <Shield className="h-4 w-4 text-sun-400" /> Safe Space
              </span>
              <span className="flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-4 py-2 text-gray-200">
                <Heart className="h-4 w-4 text-brand-teal" /> Always Here
              </span>
            </div>

            {/* Primary CTA */}
            <div className="mt-10">
              <Button
                size="lg"
                className="w-full max-w-sm bg-gradient-to-r from-brand-teal to-tk-600 py-7 text-lg font-bold text-white shadow-xl shadow-brand-teal/30 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-teal/50 hover:scale-[1.02]"
                onClick={() => router.push("/signup/student")}
              >
                Get Started — It&apos;s Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="mt-5 text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login?role=student")}
                  className="font-semibold text-brand-teal hover:text-brand-teal-light transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </main>

        {/* Footer - Help Others */}
        <footer className="border-t border-brand-teal/20 bg-dark-900/50 px-6 py-8 backdrop-blur-sm md:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Users className="h-5 w-5 text-brand-teal" />
                  <p className="font-display text-lg font-semibold text-white">
                    Want to help others?
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Join our community of counselors and peer mentors
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/login?role=peer-mentor")}
                  className="rounded-xl border border-sun-400/30 bg-sun-400/10 px-6 py-3 text-sm font-semibold text-gray-200 transition-all hover:bg-sun-400/20 hover:border-sun-400/50"
                >
                  Become a Peer Mentor
                </button>
                <button
                  onClick={() => router.push("/login?role=counselor")}
                  className="rounded-xl border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm font-semibold text-gray-200 transition-all hover:bg-brand-teal/20 hover:border-brand-teal/50"
                >
                  Join as Counselor
                </button>
              </div>
            </div>

            {/* Admin Link */}
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-gray-800/50 pt-6">
              <Sparkles className="h-3 w-3 text-gray-600" />
              <button
                onClick={() => router.push("/admin/login")}
                className="text-xs text-gray-600 transition-colors hover:text-gray-400"
              >
                Admin Portal
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
