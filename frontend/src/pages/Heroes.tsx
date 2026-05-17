import {useEffect, useState} from "react";
import { Trophy, Medal, Star, Clock, Package, MapPin } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { API_BASE } from "@/lib/api";

const Heroes = () => {
    const [heroes, setHeroes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/users/heroes`)
            .then(res => res.json())
            .then(data => {
                setHeroes(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const getUserColor = (index: number) => {
        const colors = [
            "from-amber-400 to-orange-500",
            "from-emerald-400 to-green-600",
            "from-blue-400 to-indigo-500",
            "from-purple-400 to-pink-500",
            "from-rose-400 to-red-500",
        ];
        return colors[index % colors.length];
    };

    const getBadgeTitle = (rating: number, donations: number) => {
        if (rating >= 4.8 && donations >= 10) return "Легенда";
        if (rating >= 4.5 && donations >= 5) return "Топ дарител";
        if (donations >= 1) return "Активен герой";
        return "Нов герой";
    };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-20 lg:py-28 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground mb-4 shadow-sm">
            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            <span className="text-sm font-medium uppercase tracking-wider">Зала на славата</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">Сърцето на общността</h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Запознай се с хората, които правят най-голямата промяна. Подредени по техния рейтинг и принос към общността.
          </p>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        ) : (
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16 relative z-10">
            {heroes.map((user, index) => (
                <HoverCard key={user.id}>
                <HoverCardTrigger asChild>
                    <button className="relative group cursor-pointer focus:outline-none">
                    {/* Ranking Number */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-background border-2 border-primary/20 shadow-lg flex items-center justify-center font-black text-primary z-20 group-hover:scale-110 transition-transform">
                        #{index + 1}
                    </div>

                    <div className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${getUserColor(index)} opacity-0 group-hover:opacity-100 blur-md transition-all duration-500`} />
                    <Avatar className="relative w-28 h-28 lg:w-36 lg:h-36 border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                        <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                        <AvatarFallback className="text-2xl font-bold">
                        {(user.name || "U").split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>

                    {/* Badge icon on avatar */}
                    <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full grid place-items-center shadow-lg border-4 border-background group-hover:scale-110 transition-transform duration-300 z-10 bg-gradient-to-br ${getUserColor(index)}`}>
                        {index === 0 ? <Trophy className="w-6 h-6 text-white" fill="currentColor" /> : <Medal className="w-6 h-6 text-white" fill="currentColor" />}
                    </div>

                    <div className="mt-4 text-center">
                        <p className="font-bold text-lg truncate max-w-[140px]">{user.name || "Анонимен"}</p>
                        <div className="flex items-center justify-center gap-1 text-primary">
                            <Star className="w-4 h-4 fill-primary" />
                            <span className="font-black text-sm">{user.averageRating.toFixed(1)}</span>
                        </div>
                    </div>
                    </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0 overflow-hidden shadow-2xl border-border/50 rounded-2xl" sideOffset={15}>
                    <div className={`h-2 bg-gradient-to-r ${getUserColor(index)}`} />
                    <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                        <h4 className="text-xl font-black">{user.name || "Анонимен"}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {user.city || "България"}
                        </p>
                        </div>
                        <Badge variant="secondary" className={`bg-gradient-to-r ${getUserColor(index)} text-white border-0 shadow-soft px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                            {getBadgeTitle(user.averageRating, user._count?.donations || 0)}
                        </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                            <div className="flex items-center gap-2 text-primary mb-1">
                                <Package className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-tight">Обяви</span>
                            </div>
                            <span className="text-2xl font-black">{user._count?.donations || 0}</span>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                            <div className="flex items-center gap-2 text-yellow-500 mb-1">
                                <Star className="w-4 h-4 fill-yellow-500" />
                                <span className="text-xs font-bold uppercase tracking-tight">Рейтинг</span>
                            </div>
                            <span className="text-2xl font-black">{user.averageRating.toFixed(1)}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Член от {new Date(user.createdAt).getFullYear()}г.</span>
                        <span className="font-medium">{user.reviewCount} отзива</span>
                    </div>
                    </div>
                </HoverCardContent>
                </HoverCard>
            ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default Heroes;
