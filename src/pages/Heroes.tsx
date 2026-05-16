import { Heart, Trophy, Medal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const topUsers = [
    {
        id: 1,
        name: "Венета Кирилова",
        avatar: "https://softuni.circle.so/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCT3ZzNXdrPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--b7e3ea9823418a1fe39751d76860e5d7eef437ff/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU2Q25OaGRtVnlld1k2Q25OMGNtbHdWQT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--67365f61f655fbc86c65a51f2e9992ab818c41cd/IMG_20251124_010930_135.jpg?w=150&h=150&fit=crop&crop=face",
        items: 142,
        badge: "Златно сърце",
        role: "Легенда",
        color: "from-amber-400 to-orange-500",
    },
    {id: 2, name: "Иван К.", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face", items: 89, badge: "Еко герой", role: "Супер дарител", color: "from-emerald-400 to-green-600"},
    {id: 3, name: "Мария С.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", items: 64, badge: "Вдъхновител", role: "Ментор", color: "from-blue-400 to-indigo-500"},
    {id: 4, name: "Петър В.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", items: 45, badge: "Посланик", role: "Активен", color: "from-purple-400 to-pink-500"},
    {id: 5, name: "Анна М.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", items: 31, badge: "Нова надежда", role: "Дарител", color: "from-rose-400 to-red-500"},
];

const Heroes = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="w-4 h-4" /> Назад
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-primary grid place-items-center shadow-soft">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-lg">Зала на славата</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="container py-20 lg:py-28 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground mb-4">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Топ потребители</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Сърцето на общността</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Запознай се с хората, които правят най-голямата промяна. Те не просто даряват вещи, те подаряват надежда и вдъхновяват всички нас.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-12 relative z-10">
          {topUsers.map((user) => (
            <HoverCard key={user.id}>
              <HoverCardTrigger asChild>
                <button className="relative group cursor-pointer focus:outline-none">
                  <div className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${user.color} opacity-0 group-hover:opacity-100 blur-md transition-all duration-500`} />
                  <Avatar className="relative w-24 h-24 lg:w-32 lg:h-32 border-4 border-background shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                    <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                    <AvatarFallback className="text-xl font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Mini badge icon directly on avatar */}
                  <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full grid place-items-center shadow-lg border-2 border-background group-hover:scale-110 transition-transform duration-300 z-10 bg-gradient-to-br ${user.color}`}>
                    <Medal className="w-5 h-5 text-white" fill="currentColor" strokeWidth={1} />
                  </div>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-0 overflow-hidden shadow-2xl border-border/50 rounded-xl" sideOffset={15}>
                <div className={`h-2 bg-gradient-to-r ${user.color}`} />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                    <Badge variant="secondary" className={`bg-gradient-to-r ${user.color} text-white border-0 shadow-sm`}>
                      {user.badge}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-foreground">{user.items}</span>
                      <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Дарени вещи</span>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-foreground">{Math.floor(user.items * 2.5)}кг</span>
                      <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Спестен CO2</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Heroes;