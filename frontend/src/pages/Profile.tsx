import {useEffect, useState, useCallback} from "react";
import {Link} from "react-router-dom";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Star, Package, Edit, Trash2, HandHeart, Check, CheckCircle2, User, Phone, MapPin, Info, MessageCircle, Calendar as CalendarIcon} from "lucide-react";
import {useAuth} from "@/contexts/AuthContext";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {toast} from "sonner";
import {MapContainer, TileLayer, Marker, useMapEvents} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { API_BASE, getEvents } from "@/lib/api";

import EcoCalculator from "@/components/EcoCalculator";
import Gamification from "@/components/Gamification";
import ChatDialog from "@/components/ChatDialog";

interface Donation {
    id: number;
    type: string;
    title: string;
    description: string;
    category: string;
    city?: string;
    imageUrl?: string;
    lat?: number;
    lng?: number;
    status: string;
    userId: number;
}

interface Exchange {
    id: number;
    status: string;
    donation: Donation & { user?: { name: string, id: number } };
    requester: { name: string; id: number };
}

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

const Profile = () => {
    const {user} = useAuth();
    const token = localStorage.getItem("access_token");
    const [myDonations, setMyDonations] = useState<Donation[]>([]);
    const [myRequests, setMyRequests] = useState<Exchange[]>([]);
    const [receivedRequests, setReceivedRequests] = useState<Exchange[]>([]);
    const [myReviews, setMyReviews] = useState<any[]>([]);
    const [myEvents, setMyEvents] = useState<any[]>([]);

    const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [reviewData, setReviewData] = useState({ exchangeId: 0, rating: 5, comment: "" });
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

    // Chat States
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeChatExchange, setActiveChatExchange] = useState<Exchange | null>(null);

    const fetchData = useCallback(() => {
        if (!token) return;
        
        fetch(`${API_BASE}/donations/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setMyDonations(Array.isArray(data) ? data : []))
            .catch(console.error);

        fetch(`${API_BASE}/exchanges/my-requests`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setMyRequests(Array.isArray(data) ? data : []))
            .catch(console.error);

        fetch(`${API_BASE}/exchanges/received-requests`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setReceivedRequests(Array.isArray(data) ? data : []))
            .catch(console.error);

        fetch(`${API_BASE}/reviews/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setMyReviews(Array.isArray(data) ? data : []))
            .catch(console.error);

        getEvents()
            .then((data) => {
                if (Array.isArray(data) && user) {
                    setMyEvents(data.filter(e => String(e.organizer?.id) === String(user.id)));
                }
            })
            .catch(console.error);

    }, [token, user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Сигурни ли сте, че искате да изтриете тази обява?")) return;
        try {
            const res = await fetch(`${API_BASE}/donations/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("Обявата е изтрита успешно!");
                fetchData();
            } else {
                toast.error("Възникна грешка при изтриването.");
            }
        } catch (err) {
            toast.error("Грешка при комуникация със сървъра.");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDonation) return;
        try {
            const res = await fetch(`${API_BASE}/donations/${editingDonation.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: editingDonation.title,
                    description: editingDonation.description,
                    category: editingDonation.category,
                    city: editingDonation.city,
                    lat: editingDonation.lat,
                    lng: editingDonation.lng,
                }),
            });
            if (res.ok) {
                toast.success("Обявата е обновена успешно!");
                setIsDialogOpen(false);
                fetchData();
            } else {
                toast.error("Възникна грешка при обновяването.");
            }
        } catch (err) {
            toast.error("Грешка при комуникация със сървъра.");
        }
    };

    const handleAction = async (id: number, action: 'accept' | 'complete') => {
        try {
            const res = await fetch(`${API_BASE}/exchanges/${id}/${action}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("Успешно изпълнено действие!");
                fetchData();
            } else {
                const err = await res.json();
                toast.error("Грешка", {description: err.message});
            }
        } catch (err) {
            toast.error("Мрежова грешка.");
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });
            if (res.ok) {
                toast.success("Отзивът е изпратен успешно!");
                setIsReviewDialogOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                toast.error("Грешка", {description: err.message});
            }
        } catch (err) {
            toast.error("Мрежова грешка.");
        }
    };

    const handleOpenChat = (ex: Exchange) => {
        setActiveChatExchange(ex);
        setIsChatOpen(true);
    };

    const overall = myReviews.length ? myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length : 0;
    const statsCount = myReviews.length;

    return (
        <div className="min-h-screen bg-background">
            <main className="container py-12 max-w-4xl space-y-8">
                <Card className="p-8 border-2 shadow-soft overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <User className="w-48 h-48" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-soft shrink-0">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-primary grid place-items-center text-5xl font-bold text-primary-foreground">
                                    {user?.name?.[0]?.toUpperCase() || "Т"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-4">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight mb-1">{user?.name || "Ти"}</h1>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-muted-foreground text-sm">
                                    {user?.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.city}</span>}
                                    {user?.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {user.phone}</span>}
                                    <span className="flex items-center gap-1"><Star className="w-4 h-4" /> Участник от {new Date().getFullYear()}</span>
                                </div>
                            </div>
                            
                            {user?.bio && (
                                <div className="bg-muted/50 p-4 rounded-xl text-sm italic border-l-4 border-primary/30">
                                    "{user.bio}"
                                </div>
                            )}

                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(overall) ? "fill-primary text-primary" : "text-muted"}`} />
                                    ))}
                                    <span className="font-bold text-primary ml-1">{overall.toFixed(1)}</span>
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">({statsCount} отзива)</span>
                            </div>
                        </div>
                        <Link to="/settings">
                            <Button className="bg-gradient-primary hover:opacity-90 shadow-soft">
                                <Edit className="w-4 h-4 mr-2" /> Настройки
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Tabs defaultValue="listings" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-[500px] mb-8">
                        <TabsTrigger value="listings">Моите обяви ({myDonations.length})</TabsTrigger>
                        <TabsTrigger value="requests">Заявки ({myRequests.length + receivedRequests.length})</TabsTrigger>
                        <TabsTrigger value="events">Събития ({myEvents.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="events" className="pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myEvents.map((e) => (
                                <Card key={e.id} className="p-4 border-2 hover:border-primary/20 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-bold group-hover:text-primary transition-colors">{e.title}</h3>
                                            </div>
                                            <Badge variant="outline">{e.category === "ecology" ? "Екология" : e.category === "social" ? "Социални" : "Образование"}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.description}</p>
                                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                            <CalendarIcon className="w-4 h-4" />
                                            {new Date(e.date).toLocaleDateString("bg-BG", {month: "short", day: "numeric"})}
                                            <span className="ml-2 flex items-center gap-1"><Users className="w-4 h-4"/> {e.participants?.length || 0} / {e.maxParticipants}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-4 border-t">
                                        <Link to="/events" className="w-full">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Edit className="w-4 h-4 mr-2" /> Към събитията
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                            {myEvents.length === 0 && (
                                <Card className="p-12 border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground col-span-full">
                                    <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Все още не сте създали събития.</p>
                                    <Link to="/events" className="mt-4">
                                        <Button variant="outline">Създай първото си събитие</Button>
                                    </Link>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="listings" className="pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myDonations.map((d) => (
                                <Card key={d.id} className="p-4 border-2 hover:border-primary/20 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-bold group-hover:text-primary transition-colors">{d.title}</h3>
                                                <Badge variant={d.type === "need" ? "destructive" : "default"} className={`w-fit ${d.type === "need" ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200" : "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"}`}>
                                                    {d.type === "need" ? "🤝 Нужда" : "💚 Дарение"}
                                                </Badge>
                                            </div>
                                            <Badge variant="outline">{d.category}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{d.description}</p>
                                        {d.city && (
                                            <Badge className="mt-2" variant="secondary">
                                                {d.city}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => {
                                                setEditingDonation(d);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="w-4 h-4 mr-2" /> Редактирай
                                        </Button>
                                        <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(d.id)}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Изтрий
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                            {myDonations.length === 0 && (
                                <Card className="p-12 border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground col-span-full">
                                    <Package className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Нямате активни обяви.</p>
                                    <Link to="/donate" className="mt-4">
                                        <Button variant="outline">Добави първата си обява</Button>
                                    </Link>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="requests" className="pt-2 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 grid place-items-center"><Info className="w-4 h-4" /></span>
                                Входящи заявки (Търсят от вас)
                            </h3>
                            <div className="space-y-3">
                                {receivedRequests.length === 0 && <Card className="p-6 text-muted-foreground text-sm border-dashed border-2">Нямате входящи заявки.</Card>}
                                {receivedRequests.map(r => (
                                    <Card key={r.id} className="p-4 border-2 flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate">{r.donation.title}</div>
                                            <div className="text-xs text-muted-foreground">Поискано от: <span className="font-semibold text-foreground">{r.requester.name}</span></div>
                                            <Badge variant="secondary" className="mt-1">{r.status}</Badge>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button size="sm" variant="outline" className="border-primary text-primary" onClick={() => handleOpenChat(r)}>
                                                <MessageCircle className="w-4 h-4" />
                                            </Button>
                                            {r.status === 'pending' && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(r.id, 'accept')}>
                                                    <Check className="w-4 h-4 mr-1" /> Приеми
                                                </Button>
                                            )}
                                            {r.status === 'accepted' && (
                                                <Button size="sm" className="bg-primary hover:opacity-90" onClick={() => handleAction(r.id, 'complete')}>
                                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Предадено
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 grid place-items-center"><HandHeart className="w-4 h-4" /></span>
                                Изходящи заявки (Вие търсите)
                            </h3>
                            <div className="space-y-3">
                                {myRequests.length === 0 && <Card className="p-6 text-muted-foreground text-sm border-dashed border-2">Нямате изходящи заявки.</Card>}
                                {myRequests.map(r => (
                                    <Card key={r.id} className="p-4 border-2 flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate">{r.donation.title}</div>
                                            <div className="text-xs text-muted-foreground">Собственик: <span className="font-semibold text-foreground">{r.donation.user?.name}</span></div>
                                            <Badge variant="secondary" className="mt-1">{r.status}</Badge>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button size="sm" variant="outline" className="border-primary text-primary" onClick={() => handleOpenChat(r)}>
                                                <MessageCircle className="w-4 h-4" />
                                            </Button>
                                            {r.status === 'accepted' && (
                                                <Button size="sm" className="bg-primary hover:opacity-90" onClick={() => handleAction(r.id, 'complete')}>
                                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Получено
                                                </Button>
                                            )}
                                            {r.status === 'completed' && (
                                                <Button size="sm" variant="outline" className="border-primary text-primary" onClick={() => {
                                                    setReviewData({ exchangeId: r.id, rating: 5, comment: "" });
                                                    setIsReviewDialogOpen(true);
                                                }}>
                                                    <Star className="w-4 h-4 mr-1" /> Оцени
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Остави отзив</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Оценка</Label>
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} className={`w-8 h-8 cursor-pointer ${i <= reviewData.rating ? "fill-primary text-primary" : "text-muted border"}`} onClick={() => setReviewData({...reviewData, rating: i})} />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Коментар (по желание)</Label>
                                <Textarea value={reviewData.comment} onChange={(e) => setReviewData({...reviewData, comment: e.target.value})} rows={3} placeholder="Как мина срещата?" />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Изпрати</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Редактирай обява</DialogTitle>
                        </DialogHeader>
                        {editingDonation && (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Заглавие</Label>
                                    <Input value={editingDonation.title} onChange={(e) => setEditingDonation({...editingDonation, title: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Описание</Label>
                                    <Textarea value={editingDonation.description} onChange={(e) => setEditingDonation({...editingDonation, description: e.target.value})} required rows={4} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Категория</Label>
                                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingDonation.category} onChange={(e) => setEditingDonation({...editingDonation, category: e.target.value})} required>
                                            <option value="Дрехи">Дрехи</option>
                                            <option value="Обувки">Обувки</option>
                                            <option value="Играчки">Играчки</option>
                                            <option value="Техника">Техника</option>
                                            <option value="Мебели">Мебели</option>
                                            <option value="Книги">Книги</option>
                                            <option value="Спасена храна">Спасена храна</option>
                                            <option value="Време и труд">Време и труд</option>
                                            <option value="Други">Други</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Град</Label>
                                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingDonation.city} onChange={(e) => setEditingDonation({...editingDonation, city: e.target.value})} required>
                                            <option value="София">София</option>
                                            <option value="Пловдив">Пловдив</option>
                                            <option value="Варна">Варна</option>
                                            <option value="Бургас">Бургас</option>
                                            <option value="Русе">Русе</option>
                                            <option value="Стара Загора">Стара Загора</option>
                                            <option value="Плевен">Плевен</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Локация за картата</Label>
                                    <div className="flex flex-col gap-3">
                                        <div className="h-[250px] w-full rounded-md overflow-hidden border">
                                            <MapContainer center={editingDonation.lat && editingDonation.lng ? [editingDonation.lat, editingDonation.lng] : [42.6977, 23.3219]} zoom={editingDonation.lat && editingDonation.lng ? 13 : 6} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <LocationPicker position={editingDonation.lat && editingDonation.lng ? [editingDonation.lat, editingDonation.lng] : null} setPosition={(p) => setEditingDonation({...editingDonation, lat: p[0], lng: p[1]})} />
                                            </MapContainer>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Button type="button" variant="outline" onClick={() => {
                                                if (!navigator.geolocation) {
                                                    toast.error("Геолокацията не се поддържа от вашия браузър.");
                                                    return;
                                                }
                                                navigator.geolocation.getCurrentPosition(
                                                    (position) => {
                                                        setEditingDonation({...editingDonation, lat: position.coords.latitude, lng: position.coords.longitude});
                                                        toast.success("Локацията е обновена!");
                                                    },
                                                    () => toast.error("Не успяхме да вземем локацията.")
                                                );
                                            }}>
                                                📍 Вземи моята локация
                                            </Button>
                                            {editingDonation.lat && editingDonation.lng && <span className="text-sm text-green-600 font-medium">✔️ Локацията е избрана</span>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Маркирайте с клик върху картата или използвайте геолокация за да обновите позицията.</p>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Отказ
                                    </Button>
                                    <Button type="submit">Запази промените</Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                <EcoCalculator />
                <Gamification reviews={myReviews} donationsCount={myDonations.length} />

                {activeChatExchange && (
                    <ChatDialog 
                        exchangeId={activeChatExchange.id}
                        isOpen={isChatOpen}
                        onOpenChange={setIsChatOpen}
                        recipientName={
                            activeChatExchange.requesterId === parseInt(user?.id || "0")
                                ? activeChatExchange.donation.user?.name || "Собственик"
                                : activeChatExchange.requester.name
                        }
                        itemTitle={activeChatExchange.donation.title}
                    />
                )}
            </main>
        </div>
    );
};

export default Profile;
