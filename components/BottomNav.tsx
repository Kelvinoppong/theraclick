"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Stethoscope, Users, Bot, MessageSquare, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";

const studentNavItems = [
  { href: "/student/dashboard", icon: Home, label: "Home" },
  { href: "/student/counselors", icon: Stethoscope, label: "Counselor" },
  { href: "/student/peer-mentors", icon: Users, label: "Mentor" },
  { href: "/student/bookings", icon: Calendar, label: "Bookings" },
  { href: "/student/chat", icon: Bot, label: "AI" },
];

const peerMentorNavItems = [
  { href: "/peer-mentor/dashboard", icon: Home, label: "Home" },
  { href: "/peer-mentor/inbox", icon: Mail, label: "Inbox" },
  { href: "/student/forums", icon: MessageSquare, label: "Forums" },
];

const counselorNavItems = [
  { href: "/counselor/dashboard", icon: Home, label: "Home" },
  { href: "/counselor/inbox", icon: Mail, label: "Inbox" },
  { href: "/counselor/availability", icon: Calendar, label: "Availability" },
  { href: "/counselor/bookings", icon: Calendar, label: "Bookings" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  
  const getNavItems = () => {
    if (!profile) return studentNavItems;
    if (profile.role === "peer-mentor") return peerMentorNavItems;
    if (profile.role === "counselor") return counselorNavItems;
    return studentNavItems;
  };
  
  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-teal/30 bg-dark-900/95 backdrop-blur-xl md:hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 brand-border" />
      
      <div className="mx-auto flex max-w-md justify-around py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 py-3 transition-all duration-300",
                isActive ? "text-brand-teal" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <div className={cn(
                "relative rounded-xl p-2 transition-all duration-300",
                isActive ? "bg-brand-teal/20" : "bg-transparent"
              )}>
                <Icon className="h-5 w-5" />
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-brand-teal/10 blur-md" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-semibold transition-colors",
                isActive ? "text-brand-teal" : "text-gray-500"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-brand-teal" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
