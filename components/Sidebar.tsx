"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Stethoscope, 
  Users, 
  Bot, 
  MessageSquare, 
  Settings, 
  LogOut,
  Mail,
  Calendar,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";

const studentNavItems = [
  { href: "/student/dashboard", icon: Home, label: "Dashboard" },
  { href: "/student/inbox", icon: Mail, label: "Inbox" },
  { href: "/student/counselors", icon: Stethoscope, label: "Talk to Counselor" },
  { href: "/student/peer-mentors", icon: Users, label: "Talk to Peer Mentor" },
  { href: "/student/chat", icon: Bot, label: "AI Assistance" },
  { href: "/student/bookings", icon: Calendar, label: "My Bookings" },
  { href: "/student/forums", icon: MessageSquare, label: "Forums" },
  { href: "/student/settings", icon: Settings, label: "Settings" },
];

const peerMentorNavItems = [
  { href: "/peer-mentor/dashboard", icon: Home, label: "Dashboard" },
  { href: "/peer-mentor/inbox", icon: Mail, label: "Inbox" },
  { href: "/student/forums", icon: MessageSquare, label: "Forums" },
  { href: "/peer-mentor/settings", icon: Settings, label: "Settings" },
];

const counselorNavItems = [
  { href: "/counselor/dashboard", icon: Home, label: "Dashboard" },
  { href: "/counselor/inbox", icon: Mail, label: "Inbox" },
  { href: "/counselor/availability", icon: Calendar, label: "Availability" },
  { href: "/counselor/bookings", icon: Calendar, label: "Bookings" },
  { href: "/counselor/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, profile, loading } = useAuth();
  
  const getNavItems = () => {
    if (!profile) return studentNavItems;
    if (profile.role === "peer-mentor") return peerMentorNavItems;
    if (profile.role === "counselor") return counselorNavItems;
    return studentNavItems;
  };
  
  const navItems = getNavItems();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-brand-teal/20 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 md:flex md:flex-col">
      {/* Decorative top border */}
      <div className="h-1 w-full brand-border" />
      
      {/* Logo section - compact */}
      <div className="flex items-center justify-center border-b border-brand-teal/20 px-4 py-3">
        <Logo size="small" />
      </div>
      
      {/* User info - compact */}
      <div className="border-b border-brand-teal/20 px-4 py-2.5 bg-brand-teal/5">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Signed in as</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-white">
          {loading
            ? "…"
            : profile?.role === "student" && profile.anonymousEnabled && profile.anonymousId
              ? profile.anonymousId
              : profile?.fullName || "—"}
        </p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-brand-teal/25 to-sun-400/15 text-brand-teal border border-brand-teal/30 shadow-lg shadow-brand-teal/10"
                  : "text-gray-400 hover:bg-brand-teal/10 hover:text-white border border-transparent"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-all duration-300",
                isActive ? "text-brand-teal" : "text-gray-500 group-hover:text-brand-teal"
              )} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Logout */}
      <div className="border-t border-brand-teal/20 p-3">
        <button
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition-all duration-300 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
