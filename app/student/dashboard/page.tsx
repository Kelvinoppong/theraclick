"use client";

import { useRouter } from "next/navigation";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { 
  Heart,
  Calendar,
  Clock,
  ArrowRight,
  Bell,
  ExternalLink,
  Mail,
  MessageCircle,
  Sparkles,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Users,
  Phone,
  BookOpen,
  Lightbulb
} from "lucide-react";
import { useAuth } from "@/context/auth";
import { useState, useEffect } from "react";
import { collection, query, where, limit, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Mood options
const moods = [
  { id: "great", icon: Sun, label: "Great", sublabel: "Feeling wonderful", color: "from-sun-400 to-sun-500", bgColor: "bg-sun-400/20" },
  { id: "okay", icon: Cloud, label: "Okay", sublabel: "Doing alright", color: "from-brand-teal to-tk-600", bgColor: "bg-brand-teal/20" },
  { id: "low", icon: CloudRain, label: "Low", sublabel: "Not my best", color: "from-slate-400 to-slate-500", bgColor: "bg-slate-500/20" },
  { id: "stressed", icon: Zap, label: "Stressed", sublabel: "Feeling tense", color: "from-orange-400 to-red-500", bgColor: "bg-orange-500/20" },
];

// Daily tips for motivation
const dailyTips = [
  { tip: "Take a 5-minute break every hour. Your mind needs rest to stay sharp.", category: "Wellness" },
  { tip: "Remember to drink water throughout the day. Hydration helps concentration.", category: "Health" },
  { tip: "It's okay to ask for help. Reaching out is a sign of strength, not weakness.", category: "Mental Health" },
  { tip: "Celebrate small wins today. Every step forward matters.", category: "Motivation" },
];

interface UpcomingBooking {
  id: string;
  counselorName: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface RecentConversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  type: "counselor" | "peer-mentor";
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [upcomingSoon, setUpcomingSoon] = useState<UpcomingBooking | null>(null);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [dailyTip] = useState(() => dailyTips[Math.floor(Math.random() * dailyTips.length)]);

  const displayName =
    profile?.role === "student" && profile.anonymousEnabled && profile.anonymousId
      ? profile.anonymousId
      : profile?.fullName?.split(" ")[0] || "there";

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const greeting = getGreeting();

  // Load upcoming bookings
  useEffect(() => {
    if (!profile || !db) {
      setLoadingBookings(false);
      return;
    }

    const q = query(
      collection(db, "bookings"),
      where("studentId", "==", profile.uid),
      where("status", "==", "confirmed"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const bookings: UpcomingBooking[] = [];
      let soonest: UpcomingBooking | null = null;
      let soonestTime = Infinity;

      snap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const bookingDate = new Date(`${data.date}T${data.startTime}`);
        if (bookingDate > new Date()) {
          const booking: UpcomingBooking = {
            id: docSnap.id,
            counselorName: data.counselorName || "Counselor",
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
          };
          bookings.push(booking);
          
          const hoursUntil = (bookingDate.getTime() - Date.now()) / (1000 * 60 * 60);
          if (hoursUntil > 0 && hoursUntil <= 24 && hoursUntil < soonestTime) {
            soonest = booking;
            soonestTime = hoursUntil;
          }
        }
      });

      bookings.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      });

      setUpcomingBookings(bookings.slice(0, 3));
      setUpcomingSoon(soonest);
      setLoadingBookings(false);
    }, (error) => {
      console.error("Error loading bookings:", error);
      setLoadingBookings(false);
    });

    return () => unsub();
  }, [profile]);

  // Load recent conversations
  useEffect(() => {
    if (!profile || !db) {
      setLoadingConversations(false);
      return;
    }

    const conversationsList: RecentConversation[] = [];

    const unsub = onSnapshot(collection(db, "directMessages"), async (snap) => {
      conversationsList.length = 0;

      for (const convDoc of snap.docs) {
        const data = convDoc.data();
        const participants = data.participants as string[] | undefined;

        if (participants && Array.isArray(participants) && participants.includes(profile.uid) && db) {
          const otherUserId = participants.find(p => p !== profile.uid);

          if (otherUserId) {
            try {
              const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
              if (otherUserDoc.exists()) {
                const otherUserData = otherUserDoc.data();

                if (otherUserData.role === "counselor" || otherUserData.role === "peer-mentor") {
                  conversationsList.push({
                    id: otherUserId,
                    name: otherUserData.fullName || "Unknown",
                    lastMessage: data.lastMessage?.slice(0, 50) || "No messages yet",
                    lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
                    type: otherUserData.role === "counselor" ? "counselor" : "peer-mentor",
                  });
                }
              }
            } catch (e) {
              console.error("Error fetching user data for conversation:", e);
            }
          }
        }
      }

      conversationsList.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
      setRecentConversations(conversationsList.slice(0, 3));
      setLoadingConversations(false);
    }, (error) => {
      console.error("Error loading conversations:", error);
      setLoadingConversations(false);
    });

    return () => unsub();
  }, [profile]);

  const formatBookingDate = (dateStr: string, startTime: string) => {
    const date = new Date(`${dateStr}T${startTime}`);
    return date.toLocaleDateString("en-GB", { 
      weekday: "short", 
      month: "short", 
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const getTimeUntil = (dateStr: string, startTime: string) => {
    const date = new Date(`${dateStr}T${startTime}`);
    const hours = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60));
    if (hours < 1) {
      const mins = Math.floor((date.getTime() - Date.now()) / (1000 * 60));
      return `${mins} minutes`;
    }
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""}`;
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        {/* Decorative background elements */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {/* Teal accent */}
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-brand-teal/10 blur-[120px] tk-float" />
          {/* Yellow accent */}
          <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-brand-yellow/8 blur-[100px] tk-float2" />
          <div className="absolute bottom-20 left-1/4 h-72 w-72 rounded-full bg-brand-teal/5 blur-[100px] tk-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 px-4 py-6 pb-24 md:px-8 md:py-10">
          <div className="mx-auto max-w-4xl">
            
            {/* Header */}
            <div className="mb-10">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
                <span className="text-sm font-medium text-brand-teal">Welcome back</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
                {greeting}, {displayName} 👋
              </h1>
              <p className="mt-3 text-lg text-gray-400">
                How are you feeling today?
              </p>
            </div>

            {/* Upcoming Session Alert */}
            {upcomingSoon && (
              <div className="group relative mb-8 overflow-hidden rounded-3xl border-2 border-sun-400/40 bg-gradient-to-r from-sun-400/20 via-sun-400/15 to-brand-yellow/20 p-6 backdrop-blur-sm transition-all duration-500 hover:border-sun-400/60 hover:shadow-2xl hover:shadow-sun-400/20">
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-sun-400/30 blur-3xl animate-pulse" />
                <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-brand-yellow/30 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-sun-400/50 to-brand-yellow/50 p-4 shadow-xl shadow-sun-400/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Bell className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-xl font-bold text-white">Session Starting Soon!</p>
                    <p className="mt-2 text-base leading-relaxed text-gray-200">
                      You have a session with <span className="font-semibold text-sun-400">{upcomingSoon.counselorName}</span> in <span className="font-semibold text-brand-yellow">{getTimeUntil(upcomingSoon.date, upcomingSoon.startTime)}</span>
                    </p>
                    <p className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                      <Clock className="h-4 w-4" />
                      {formatBookingDate(upcomingSoon.date, upcomingSoon.startTime)}
                    </p>
                    <Button
                      onClick={() => router.push("/student/bookings")}
                      className="mt-5 bg-gradient-to-r from-sun-400 to-brand-yellow text-dark-900 font-semibold shadow-lg shadow-sun-400/30 hover:shadow-xl hover:shadow-sun-400/50 transition-all duration-300"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Mood Check-in */}
            <div className="tk-card mb-8 p-6 transition-all duration-500">
              <div className="mb-6 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-brand-teal" />
                <p className="font-display text-lg font-semibold text-white">How are you feeling today?</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`group/mood relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300 ${
                        isSelected
                          ? `border-brand-teal/60 bg-gradient-to-br ${mood.color} shadow-xl shadow-brand-teal/20 scale-105`
                          : "border-gray-700/50 bg-dark-800/50 hover:border-brand-teal/40 hover:bg-dark-700/50 hover:scale-102"
                      }`}
                    >
                      {isSelected && (
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.color} opacity-20 blur-xl`} />
                      )}
                      <Icon className={`relative z-10 h-8 w-8 transition-all duration-300 ${
                        isSelected ? "text-white scale-110" : "text-gray-400 group-hover/mood:text-brand-teal group-hover/mood:scale-110"
                      }`} />
                      <div className="relative z-10 text-center">
                        <span className={`block text-sm font-bold transition-colors ${isSelected ? "text-white" : "text-gray-300"}`}>
                          {mood.label}
                        </span>
                        <span className={`block text-xs mt-0.5 transition-colors ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                          {mood.sublabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedMood && (
                <div className="mt-6 animate-in slide-in-from-bottom-2">
                  <div className="rounded-2xl border border-brand-teal/30 bg-brand-teal/10 p-5">
                    <p className="text-center text-base font-medium text-white leading-relaxed">
                      {selectedMood === "great" && "That's wonderful! Keep that positive energy going today! ✨"}
                      {selectedMood === "okay" && "Thanks for sharing. Remember, we're here whenever you need us."}
                      {selectedMood === "low" && "It takes courage to share this. Would you like to talk with someone who cares?"}
                      {selectedMood === "stressed" && "Take a deep breath. Let's work through this together. You've got this!"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/student/counselors")}
                className="group tk-card flex flex-col items-center gap-3 p-6 transition-all duration-300 hover:scale-105"
              >
                <div className="rounded-2xl bg-gradient-to-br from-brand-teal/40 to-tk-600/40 p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Phone className="h-6 w-6 text-brand-teal" />
                </div>
                <span className="font-semibold text-gray-200 text-sm text-center">Talk to Counselor</span>
              </button>
              
              <button
                onClick={() => router.push("/student/peer-mentors")}
                className="group tk-card flex flex-col items-center gap-3 p-6 transition-all duration-300 hover:scale-105"
              >
                <div className="rounded-2xl bg-gradient-to-br from-sun-400/40 to-brand-yellow/40 p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Users className="h-6 w-6 text-sun-400" />
                </div>
                <span className="font-semibold text-gray-200 text-sm text-center">Peer Mentors</span>
              </button>
              
              <button
                onClick={() => router.push("/student/chat")}
                className="group tk-card flex flex-col items-center gap-3 p-6 transition-all duration-300 hover:scale-105"
              >
                <div className="rounded-2xl bg-gradient-to-br from-brand-teal/40 to-sun-400/40 p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-gray-200 text-sm text-center">AI Support</span>
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              
              {/* Inbox Card */}
              <button
                onClick={() => router.push("/student/inbox")}
                className="group tk-card w-full p-6 text-left transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-brand-teal/40 to-tk-600/40 p-3 shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Mail className="h-5 w-5 text-brand-teal" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white">Messages</h3>
                  </div>
                  <span className="text-sm font-medium text-brand-teal flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                    View all <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                
                {loadingConversations ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-16 animate-pulse rounded-xl bg-dark-700/50" />
                    ))}
                  </div>
                ) : recentConversations.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal/20">
                      <MessageCircle className="h-7 w-7 text-brand-teal" />
                    </div>
                    <p className="font-medium text-gray-200">No conversations yet</p>
                    <p className="mt-1 text-sm text-gray-500">Start a conversation with a counselor or peer mentor</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className="rounded-xl border border-gray-700/50 bg-dark-700/30 p-4 transition-all hover:bg-dark-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${conv.type === "counselor" ? "bg-brand-teal" : "bg-sun-400"}`} />
                          <span className="font-semibold text-white">{conv.name}</span>
                          <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                            conv.type === "counselor" ? "bg-brand-teal/20 text-brand-teal" : "bg-sun-400/20 text-sun-400"
                          }`}>
                            {conv.type === "counselor" ? "Counselor" : "Mentor"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400 line-clamp-1">{conv.lastMessage}</p>
                      </div>
                    ))}
                  </div>
                )}
              </button>

              {/* Daily Tip Card */}
              <div className="tk-card p-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sun-400/20 blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="rounded-xl bg-gradient-to-br from-sun-400/40 to-brand-yellow/40 p-3 shadow-lg">
                      <Lightbulb className="h-5 w-5 text-sun-400" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white">Daily Tip</h3>
                  </div>
                  
                  <div className="relative pl-4 border-l-4 border-sun-400/50">
                    <p className="text-lg text-gray-200 leading-relaxed">
                      &ldquo;{dailyTip.tip}&rdquo;
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                    <span className="px-2 py-1 rounded-full bg-sun-400/20 text-sun-400 text-xs font-medium">
                      {dailyTip.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-sun-400" />
                      Updated daily
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-white">Upcoming Sessions</h2>
                  <button
                    onClick={() => router.push("/student/bookings")}
                    className="text-sm font-medium text-brand-teal hover:text-brand-teal-light flex items-center gap-1 transition-colors"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="tk-card p-5 transition-all duration-300 hover:scale-[1.01]">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-brand-teal/30 to-tk-600/30 p-3">
                          <Calendar className="h-5 w-5 text-brand-teal" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{booking.counselorName}</p>
                          <p className="text-sm text-gray-400">{formatBookingDate(booking.date, booking.startTime)}</p>
                        </div>
                        <Clock className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Banner */}
            <div className="tk-card p-6 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-teal/20 blur-3xl" />
              <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-sun-400/15 blur-3xl" />
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-brand-teal/40 to-sun-400/40 p-4 shadow-lg">
                  <Heart className="h-6 w-6 text-white fill-white/30" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-xl font-bold text-white">You&apos;re Not Alone</p>
                  <p className="mt-2 text-gray-300 leading-relaxed">
                    Our community of counselors and peer mentors are here for you. Reach out anytime — we care about your wellbeing.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
