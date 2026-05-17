import {useState, useEffect} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Calendar} from "@/components/ui/calendar";
import {Clock, MapPin, Users, CheckCircle2, Leaf, Heart, Calendar as CalendarIcon, Plus} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "sonner";
import { getEvents, createEvent, joinEvent } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TYPE_STYLES = {
    ecology: {color: "text-emerald-600", bg: "bg-emerald-100", icon: <Leaf className="w-4 h-4" />},
    social: {color: "text-rose-600", bg: "bg-rose-100", icon: <Heart className="w-4 h-4" />},
    education: {color: "text-blue-600", bg: "bg-blue-100", icon: <Users className="w-4 h-4" />},
};

export default function CommunityEvents() {
    const { user } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        category: "ecology",
        location: "",
        date: "",
        time: "",
        maxParticipants: 50,
        imageUrl: ""
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            // Parse dates back to Date objects
            const parsed = data.map((e: any) => ({...e, date: new Date(e.date)}));
            setEvents(parsed);
        } catch (error) {
            console.error("Failed to load events", error);
            toast.error("Грешка при зареждане на събитията");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (eventId: number) => {
        if (!user) {
            toast.error("Моля, влезте в профила си, за да се запишете.");
            return;
        }
        
        try {
            const token = localStorage.getItem("access_token");
            await joinEvent(eventId, token!);
            toast.success("Успешно записване!", {
                description: "Очакваме те. Ще получиш напомняне 1 ден преди събитието.",
                icon: <CheckCircle2 className="text-emerald-500" />,
            });
            fetchEvents(); // Refresh participants
        } catch (error: any) {
            toast.error(error.message || "Грешка при записване");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Трябва да сте влезли, за да създавате събития.");
            return;
        }
        try {
            const token = localStorage.getItem("access_token");
            const dt = new Date(`${newEvent.date}T${newEvent.time}`);
            const payload = {
                title: newEvent.title,
                description: newEvent.description,
                category: newEvent.category,
                location: newEvent.location,
                date: dt.toISOString(),
                maxParticipants: Number(newEvent.maxParticipants),
                imageUrl: newEvent.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60"
            };
            await createEvent(payload, token!);
            toast.success("Събитието е създадено успешно!");
            setIsDialogOpen(false);
            fetchEvents();
            setNewEvent({
                title: "", description: "", category: "ecology", location: "", date: "", time: "", maxParticipants: 50, imageUrl: ""
            });
        } catch (error: any) {
            toast.error(error.message || "Грешка при създаване");
        }
    };

    const visibleEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Check if user is participating
    const isUserParticipating = (event: any) => {
        if (!user) return false;
        return event.participants?.some((p: any) => String(p.userId) === String(user.id));
    };

    const userEvents = events.filter(isUserParticipating);

    return (
        <section id="events" className="container py-20 lg:py-28">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-4">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Календар на доброто</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">Събития и Акции</h2>
                <p className="text-muted-foreground text-lg">Включи се в общи инициативи, дари от своето време и стани част от промяната в твоя град.</p>
                
                {user && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="mt-6" size="lg">
                                <Plus className="w-4 h-4 mr-2" /> Добави събитие
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Създай ново събитие</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Заглавие</Label>
                                    <Input required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Напр. Пролетно почистване" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Описание</Label>
                                    <Textarea required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Опиши събитието..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Дата</Label>
                                        <Input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Час</Label>
                                        <Input type="time" required value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Локация</Label>
                                    <Input required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} placeholder="Морска градина" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Категория</Label>
                                        <Select value={newEvent.category} onValueChange={(val) => setNewEvent({...newEvent, category: val})}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Избери" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ecology">Екология</SelectItem>
                                                <SelectItem value="social">Социални</SelectItem>
                                                <SelectItem value="education">Образование</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Макс. участници</Label>
                                        <Input type="number" required min="1" value={newEvent.maxParticipants} onChange={e => setNewEvent({...newEvent, maxParticipants: Number(e.target.value)})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Снимка (URL - по желание)</Label>
                                    <Input type="url" value={newEvent.imageUrl} onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})} placeholder="https://..." />
                                </div>
                                <Button type="submit" className="w-full">Създай събитие</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
                {/* Calendar Sidebar */}
                <Card className="p-4 border-2 shadow-soft w-full max-w-sm mx-auto lg:mx-0 sticky top-24">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                        modifiers={{
                            hasEvent: events.map((e) => e.date),
                        }}
                        modifiersStyles={{
                            hasEvent: {fontWeight: "bold", textDecoration: "underline", color: "hsl(var(--primary))"},
                        }}
                    />
                    <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" /> Твоите активности
                        </h4>
                        {!user ? (
                            <p className="text-sm text-muted-foreground">Влез в профила си, за да видиш своите активности.</p>
                        ) : userEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Все още не си се записал за предстоящи събития.</p>
                        ) : (
                            <ul className="space-y-3">
                                {userEvents.map((e) => (
                                    <li key={e.id} className="text-sm flex items-center justify-between p-2 bg-muted rounded-md border border-border">
                                        <span className="font-medium truncate pr-2">{e.title}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{e.date.toLocaleDateString("bg-BG", {day: "2-digit", month: "short"})}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>

                {/* Events Feed */}
                <div className="space-y-4">
                    {loading ? (
                         <div className="text-center py-10 text-muted-foreground">Зареждане на събития...</div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">Няма намерени събития. Бъди първият, който ще създаде!</div>
                    ) : (
                        <AnimatePresence>
                            {visibleEvents.map((event, idx) => {
                                const isJoined = isUserParticipating(event);
                                const style = TYPE_STYLES[event.category as keyof typeof TYPE_STYLES] || TYPE_STYLES.ecology;
                                const participantCount = event.participants?.length || 0;
                                const isFull = participantCount >= event.maxParticipants;

                                return (
                                    <motion.div key={event.id} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: idx * 0.1}}>
                                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors shadow-none hover:shadow-soft">
                                            {event.imageUrl && (
                                                <div className="w-full h-48 md:h-64 overflow-hidden">
                                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge variant="secondary" className={`${style.bg} ${style.color} border-none flex items-center gap-1`}>
                                                            {style.icon} {event.category === "ecology" ? "Екология" : event.category === "social" ? "Социални" : "Образование"}
                                                        </Badge>
                                                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {event.date.toLocaleDateString("bg-BG", {weekday: "long", month: "long", day: "numeric"})}, {event.date.toLocaleTimeString("bg-BG", {hour: "2-digit", minute: "2-digit"})}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                                                        <p className="text-muted-foreground">{event.description}</p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                                        <div className="flex items-center gap-1 text-foreground">
                                                            <MapPin className="w-4 h-4 text-primary" /> {event.location}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-foreground">
                                                            <Users className="w-4 h-4 text-primary" /> {participantCount} / {event.maxParticipants} записани
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                                                    <div className="text-sm mb-4 text-center md:text-left">
                                                        <span className="text-muted-foreground">Организатор:</span>
                                                        <br />
                                                        <span className="font-bold">{event.organizer?.name || "Неизвестен"}</span>
                                                    </div>
                                                    <Button onClick={() => handleJoin(event.id)} variant={isJoined ? "secondary" : "default"} disabled={isJoined || isFull} className={`w-full ${!isJoined && !isFull && "bg-gradient-primary"}`}>
                                                        {isJoined ? "Записан си!" : isFull ? "Запълнено" : "Ще участвам"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </section>
    );
}
