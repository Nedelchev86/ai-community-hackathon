import {useState, useEffect} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Calendar} from "@/components/ui/calendar";
import {Clock, MapPin, Users, CheckCircle2, Leaf, Heart, Calendar as CalendarIcon, Plus, Edit, Trash2, Map, MessageSquare, ThumbsUp, Send} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "sonner";
import { getEvents, createEvent, joinEvent, updateEvent, deleteEvent, addEventComment, toggleEventSupport } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {MapContainer, TileLayer, Marker, useMapEvents} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TYPE_STYLES = {
    ecology: {color: "text-emerald-600", bg: "bg-emerald-100", icon: <Leaf className="w-4 h-4" />},
    social: {color: "text-rose-600", bg: "bg-rose-100", icon: <Heart className="w-4 h-4" />},
    education: {color: "text-blue-600", bg: "bg-blue-100", icon: <Users className="w-4 h-4" />},
};

const LocationPicker = ({position, setPosition}: {position: [number, number] | null; setPosition: (p: [number, number]) => void}) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    const icon = L.divIcon({
        className: "",
        html: `<div style="font-size:24px; line-height: 1; text-shadow: 0px 0px 3px rgba(255,255,255,0.8);">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
    });
    return position ? <Marker position={position} icon={icon} /> : null;
};

export default function CommunityEvents() {
    const { user } = useAuth();
    const [date, setDate] = useState<Date | undefined>();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Edit state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);

    // Participants Dialog
    const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
    const [activeEventParticipants, setActiveEventParticipants] = useState<any[]>([]);

    // Comments State
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
    const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

    // Form state
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        category: "ecology",
        location: "",
        date: "",
        time: "",
        lat: 42.6977,
        lng: 23.3219,
        hasMapLocation: false,
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
                lat: newEvent.hasMapLocation ? newEvent.lat : null,
                lng: newEvent.hasMapLocation ? newEvent.lng : null,
                date: dt.toISOString(),
                maxParticipants: Number(newEvent.maxParticipants),
                imageUrl: newEvent.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60"
            };
            await createEvent(payload, token!);
            toast.success("Събитието е създадено успешно!");
            setIsDialogOpen(false);
            fetchEvents();
            setNewEvent({
                title: "", description: "", category: "ecology", location: "", date: "", time: "", lat: 42.6977, lng: 23.3219, hasMapLocation: false, maxParticipants: 50, imageUrl: ""
            });
        } catch (error: any) {
            toast.error(error.message || "Грешка при създаване");
        }
    };

    const handleEditClick = (event: any) => {
        setEditingEvent({
            ...event,
            dateStr: event.date.toISOString().split("T")[0],
            timeStr: event.date.toTimeString().slice(0, 5),
            hasMapLocation: event.lat != null && event.lng != null,
            lat: event.lat || 42.6977,
            lng: event.lng || 23.3219,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            const dt = new Date(`${editingEvent.dateStr}T${editingEvent.timeStr}`);
            const payload = {
                title: editingEvent.title,
                description: editingEvent.description,
                category: editingEvent.category,
                location: editingEvent.location,
                lat: editingEvent.hasMapLocation ? editingEvent.lat : null,
                lng: editingEvent.hasMapLocation ? editingEvent.lng : null,
                date: dt.toISOString(),
                maxParticipants: Number(editingEvent.maxParticipants),
                imageUrl: editingEvent.imageUrl
            };
            await updateEvent(editingEvent.id, payload, token!);
            toast.success("Събитието е обновено успешно!");
            setIsEditDialogOpen(false);
            fetchEvents();
        } catch (error: any) {
            toast.error("Грешка при обновяване.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Сигурни ли сте, че искате да изтриете събитието?")) return;
        try {
            const token = localStorage.getItem("access_token");
            await deleteEvent(id, token!);
            toast.success("Събитието е изтрито.");
            fetchEvents();
        } catch (error: any) {
            toast.error("Грешка при изтриване.");
        }
    };

    const openParticipants = (participants: any[]) => {
        setActiveEventParticipants(participants.map(p => p.user));
        setParticipantsDialogOpen(true);
    };

    const toggleSupport = async (eventId: number) => {
        if (!user) {
            toast.error("Моля, влезте в профила си, за да подкрепите събитието.");
            return;
        }
        try {
            const token = localStorage.getItem("access_token");
            await toggleEventSupport(eventId, token!);
            fetchEvents();
        } catch (error) {
            toast.error("Грешка при подкрепа");
        }
    };

    const submitComment = async (eventId: number) => {
        if (!user) {
            toast.error("Моля, влезте в профила си, за да коментирате.");
            return;
        }
        const content = commentInputs[eventId]?.trim();
        if (!content) return;

        try {
            const token = localStorage.getItem("access_token");
            await addEventComment(eventId, content, token!);
            setCommentInputs(prev => ({...prev, [eventId]: ""}));
            fetchEvents();
            toast.success("Коментарът е добавен.");
        } catch (error) {
            toast.error("Грешка при добавяне на коментар.");
        }
    };

    const visibleEvents = events
        .filter(event => {
            if (!date) return true;
            return event.date.toDateString() === date.toDateString();
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    
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
                        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                                    <Label>Локация (Адрес, Парк и др.)</Label>
                                    <Input required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} placeholder="Морска градина, до фонтана" />
                                </div>
                                <div className="space-y-2 border p-4 rounded-md">
                                    <Label className="flex items-center gap-2 mb-2">
                                        <input type="checkbox" checked={newEvent.hasMapLocation} onChange={(e) => setNewEvent({...newEvent, hasMapLocation: e.target.checked})} />
                                        Избери точна локация на картата
                                    </Label>
                                    {newEvent.hasMapLocation && (
                                        <div className="h-[200px] w-full rounded-md overflow-hidden border">
                                            <MapContainer center={[newEvent.lat, newEvent.lng]} zoom={6} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <LocationPicker position={[newEvent.lat, newEvent.lng]} setPosition={(p) => setNewEvent({...newEvent, lat: p[0], lng: p[1]})} />
                                            </MapContainer>
                                        </div>
                                    )}
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

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Редактирай събитие</DialogTitle>
                        </DialogHeader>
                        {editingEvent && (
                            <form onSubmit={handleUpdate} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Заглавие</Label>
                                    <Input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Описание</Label>
                                    <Textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Дата</Label>
                                        <Input type="date" required value={editingEvent.dateStr} onChange={e => setEditingEvent({...editingEvent, dateStr: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Час</Label>
                                        <Input type="time" required value={editingEvent.timeStr} onChange={e => setEditingEvent({...editingEvent, timeStr: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Локация (Адрес, Парк и др.)</Label>
                                    <Input required value={editingEvent.location} onChange={e => setEditingEvent({...editingEvent, location: e.target.value})} />
                                </div>
                                <div className="space-y-2 border p-4 rounded-md">
                                    <Label className="flex items-center gap-2 mb-2">
                                        <input type="checkbox" checked={editingEvent.hasMapLocation} onChange={(e) => setEditingEvent({...editingEvent, hasMapLocation: e.target.checked})} />
                                        Избери точна локация на картата
                                    </Label>
                                    {editingEvent.hasMapLocation && (
                                        <div className="h-[200px] w-full rounded-md overflow-hidden border">
                                            <MapContainer center={[editingEvent.lat, editingEvent.lng]} zoom={editingEvent.lat === 42.6977 ? 6 : 13} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <LocationPicker position={[editingEvent.lat, editingEvent.lng]} setPosition={(p) => setEditingEvent({...editingEvent, lat: p[0], lng: p[1]})} />
                                            </MapContainer>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Категория</Label>
                                        <Select value={editingEvent.category} onValueChange={(val) => setEditingEvent({...editingEvent, category: val})}>
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
                                        <Input type="number" required min="1" value={editingEvent.maxParticipants} onChange={e => setEditingEvent({...editingEvent, maxParticipants: Number(e.target.value)})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Снимка (URL)</Label>
                                    <Input type="url" value={editingEvent.imageUrl || ""} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отказ</Button>
                                    <Button type="submit">Запази промените</Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Participants Dialog */}
                <Dialog open={participantsDialogOpen} onOpenChange={setParticipantsDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Записани участници ({activeEventParticipants.length})</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
                            {activeEventParticipants.length === 0 ? (
                                <p className="text-center text-muted-foreground">Все още няма записани участници.</p>
                            ) : (
                                activeEventParticipants.map(participant => (
                                    <div key={participant.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border shrink-0">
                                            {participant.avatarUrl ? (
                                                <img src={participant.avatarUrl} alt={participant.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-primary">{participant.name ? participant.name[0].toUpperCase() : "?"}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{participant.name || "Анонимен"}</span>
                                            {user && participant.id === parseInt(user.id) && (
                                                <span className="text-xs text-muted-foreground">(Ти)</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
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
                        modifiersClassNames={{
                            hasEvent: "font-bold underline decoration-primary decoration-2 underline-offset-4",
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
                    {date && (
                        <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border">
                            <span className="text-sm font-medium">Събития за {date.toLocaleDateString("bg-BG", {dateStyle: "medium"})}</span>
                            <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>Изчисти филтъра</Button>
                        </div>
                    )}
                    {loading ? (
                         <div className="text-center py-10 text-muted-foreground">Зареждане на събития...</div>
                    ) : visibleEvents.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            {date ? "Няма събития за избраната дата." : "Няма намерени събития. Бъди първият, който ще създаде!"}
                            {date && (
                                <div className="mt-4">
                                    <Button variant="outline" onClick={() => setDate(undefined)}>Покажи всички</Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <AnimatePresence>
                            {visibleEvents.map((event, idx) => {
                                const isJoined = isUserParticipating(event);
                                const style = TYPE_STYLES[event.category as keyof typeof TYPE_STYLES] || TYPE_STYLES.ecology;
                                const participantCount = event.participants?.length || 0;
                                const isFull = participantCount >= event.maxParticipants;
                                const isOrganizer = String(event.organizer?.id) === String(user?.id);

                                const hasSupported = user && event.supports?.some((s: any) => String(s.userId) === String(user.id));
                                const supportCount = event.supports?.length || 0;
                                const comments = event.comments || [];
                                const isCommentsExpanded = expandedComments[event.id];

                                return (
                                    <motion.div key={event.id} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: idx * 0.1}}>
                                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors shadow-none hover:shadow-soft">
                                            {event.imageUrl && (
                                                <div className="w-full h-48 md:h-64 overflow-hidden relative">
                                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                                    {isOrganizer && (
                                                        <div className="absolute top-2 right-2 flex gap-2">
                                                            <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white" onClick={() => handleEditClick(event)}>
                                                                <Edit className="w-4 h-4 text-blue-600" />
                                                            </Button>
                                                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(event.id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="p-6 flex flex-col md:flex-row gap-6 relative">
                                                {!event.imageUrl && isOrganizer && (
                                                    <div className="absolute top-4 right-4 flex gap-2">
                                                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleEditClick(event)}>
                                                            <Edit className="w-4 h-4 text-blue-600" />
                                                        </Button>
                                                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(event.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-wrap items-center gap-2 pr-16">
                                                        <Badge variant="secondary" className={`${style.bg} ${style.color} border-none flex items-center gap-1`}>
                                                            {style.icon} {event.category === "ecology" ? "Екология" : event.category === "social" ? "Социални" : "Образование"}
                                                        </Badge>
                                                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {event.date.toLocaleDateString("bg-BG", {weekday: "long", month: "long", day: "numeric"})}, {event.date.toLocaleTimeString("bg-BG", {hour: "2-digit", minute: "2-digit"})}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-2xl font-bold mb-2 pr-16">{event.title}</h3>
                                                        <p className="text-muted-foreground">{event.description}</p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                                        <div className="flex items-center gap-1 text-foreground">
                                                            <MapPin className="w-4 h-4 text-primary" /> 
                                                            {event.location} 
                                                            {event.lat && event.lng && (
                                                                <a 
                                                                    href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors px-2 py-1 rounded-md ml-2 border border-blue-200"
                                                                    title="Виж на картата"
                                                                >
                                                                    <Map className="w-4 h-4" />
                                                                    <span>Карта</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div 
                                                            className="flex items-center gap-1 text-foreground cursor-pointer hover:text-primary transition-colors bg-muted/50 px-2 py-1 rounded-md"
                                                            onClick={() => openParticipants(event.participants || [])}
                                                        >
                                                            <Users className="w-4 h-4 text-primary" /> {participantCount} / {event.maxParticipants} записани
                                                        </div>
                                                    </div>

                                                    {/* Interactions: Likes & Comments count */}
                                                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className={`flex items-center gap-2 ${hasSupported ? 'text-rose-500 hover:text-rose-600 bg-rose-50' : 'text-muted-foreground hover:text-foreground'}`}
                                                            onClick={() => toggleSupport(event.id)}
                                                        >
                                                            <ThumbsUp className={`w-4 h-4 ${hasSupported ? 'fill-current' : ''}`} /> 
                                                            {supportCount} Подкрепи
                                                        </Button>

                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                                            onClick={() => setExpandedComments(prev => ({...prev, [event.id]: !prev[event.id]}))}
                                                        >
                                                            <MessageSquare className="w-4 h-4" /> 
                                                            {comments.length} Коментара
                                                        </Button>
                                                    </div>

                                                    {/* Comments Section */}
                                                    {isCommentsExpanded && (
                                                        <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: "auto"}} className="bg-muted/30 p-4 rounded-xl space-y-4">
                                                            {/* Add comment */}
                                                            {user ? (
                                                                <div className="flex gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border shrink-0">
                                                                        {user.avatarUrl ? (
                                                                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span className="font-bold text-primary text-xs">{user.name ? user.name[0].toUpperCase() : "?"}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 flex gap-2">
                                                                        <Input 
                                                                            placeholder="Напиши коментар..." 
                                                                            className="h-8 text-sm"
                                                                            value={commentInputs[event.id] || ""}
                                                                            onChange={(e) => setCommentInputs(prev => ({...prev, [event.id]: e.target.value}))}
                                                                            onKeyDown={(e) => e.key === 'Enter' && submitComment(event.id)}
                                                                        />
                                                                        <Button size="sm" className="h-8 px-3" onClick={() => submitComment(event.id)}>
                                                                            <Send className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-muted-foreground text-center pb-2">
                                                                    Трябва да влезете в профила си, за да коментирате.
                                                                </div>
                                                            )}

                                                            {/* Comments List */}
                                                            <div className="space-y-3 pt-2">
                                                                {comments.length === 0 ? (
                                                                    <div className="text-sm text-muted-foreground text-center">Няма коментари. Бъдете първи!</div>
                                                                ) : (
                                                                    comments.map((comment: any) => (
                                                                        <div key={comment.id} className="flex gap-3 text-sm">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border shrink-0">
                                                                                {comment.user?.avatarUrl ? (
                                                                                    <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <span className="font-bold text-primary text-xs">{comment.user?.name ? comment.user.name[0].toUpperCase() : "?"}</span>
                                                                                )}
                                                                            </div>
                                                                            <div className="bg-background border rounded-lg px-3 py-2 flex-1">
                                                                                <div className="flex justify-between items-baseline mb-1">
                                                                                    <span className="font-medium">{comment.user?.name || "Анонимен"}</span>
                                                                                    <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString("bg-BG")}</span>
                                                                                </div>
                                                                                <p className="text-muted-foreground">{comment.content}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 shrink-0">
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
