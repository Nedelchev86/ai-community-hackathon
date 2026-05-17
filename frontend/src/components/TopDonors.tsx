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
        <Card className="p-6 lg:p-8 border-2 shadow-soft h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Топ дарители</h3>
                </div>
                <Link to="/heroes">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
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
                <div className="space-y-3">
                    {heroes.map((u, i) => (
                        <div
                            key={u.id}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:border-primary/20 hover:bg-primary/5 group`}
                        >
                            <div className="relative">
                                <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                                    <AvatarImage src={u.avatarUrl} alt={u.name} className="object-cover" />
                                    <AvatarFallback className="font-bold">
                                        {(u.name || "U").split(" ").map((n: string) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-background shadow-sm bg-gradient-to-br ${getUserColor(i)} text-white`}>
                                    {i + 1}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                                    {u.name || "Анонимен"}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {u.averageRating.toFixed(1)}</span>
                                    <span>·</span>
                                    <span>{u._count?.donations || 0} дарения</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold">
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
