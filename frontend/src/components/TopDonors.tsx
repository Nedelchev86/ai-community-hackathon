import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Medal, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const TopDonors = () => {
    const [heroes, setHeroes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/users/heroes`)
            .then(res => res.json())
            .then(data => {
                setHeroes(Array.isArray(data) ? data.slice(0, 5) : []);
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

    return (
        <Card className="p-4 sm:p-6 lg:p-8 border-2 shadow-soft h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">Топ дарители</h3>
                </div>
                <Link to="/heroes" className="w-full sm:w-auto">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto text-muted-foreground hover:text-primary justify-between sm:justify-start">
                        Виж всички <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="space-y-2 sm:space-y-3">
                    {heroes.map((u, i) => (
                        <div
                            key={u.id}
                            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 transition-all hover:border-primary/20 hover:bg-primary/5 group`}
                        >
                            <div className="relative shrink-0">
                                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-background shadow-sm">
                                    <AvatarImage src={u.avatarUrl} alt={u.name} className="object-cover" />
                                    <AvatarFallback className="font-bold text-xs sm:text-base">
                                        {(u.name || "U").split(" ").map((n: string) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -top-1.5 -left-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-black border-2 border-background shadow-sm bg-gradient-to-br ${getUserColor(i)} text-white`}>
                                    {i + 1}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                    {u.name || "Анонимен"}
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                                    <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 sm:w-3 h-3 fill-amber-400 text-amber-400" /> {u.averageRating.toFixed(1)}</span>
                                    <span>·</span>
                                    <span className="truncate">{u._count?.donations || 0} дарения</span>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold text-[10px] sm:text-xs">
                                    #{i + 1}
                                </Badge>
                            </div>
                        </div>
                    ))}
                    {heroes.length === 0 && <p className="text-center text-muted-foreground py-8">Все още няма данни.</p>}
                </div>
            )}
        </Card>
    );
};

export default TopDonors;
