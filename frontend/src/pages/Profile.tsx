import {useEffect, useState, useCallback} from "react";
import {Link} from "react-router-dom";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {ArrowLeft, Star, Target, MessageSquare, Package, Heart, Quote, Edit, Trash2, HandHeart, Check, CheckCircle2} from "lucide-react";
import {useExchanges, computeProfileStats, CATEGORY_LABEL, getReceivedReviews} from "@/lib/reviewsStore";
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
import { API_BASE } from "@/lib/api";

import EcoCalculator from "@/components/EcoCalculator";
import Gamification from "@/components/Gamification";

const CATEGORY_ICONS = {
    accuracy: Target,
    communication: MessageSquare,
    condition: Package,
} as const;

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

    const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [reviewData, setReviewData] = useState({ exchangeId: 0, rating: 5, comment: "" });
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

    const fetchData = useCallback(() => {
        if (!token) return;
        
        // Fetch donations
        fetch(`${API_BASE}/donations/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setMyDonations(Array.isArray(data) ? data : []))
            .catch(console.error);

        // Fetch sent requests
        fetch(`${API_BASE}/exchanges/my-requests`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setMyRequests(Array.isArray(data) ? data : []))
            .catch(console.error);

        // Fetch received requests
        fetch(`${API_BASE}/exchanges/received-requests`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setReceivedRequests(Array.isArray(data) ? data : []))
            .catch(console.error);

        // Fetch real reviews
        fetch(`${API_BASE}/reviews/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setMyReviews(Array.isArray(data) ? data : []))
            .catch(console.error);

    }, [token]);

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

    // Replace fake stats with real review stats calculation
    const overall = myReviews.length ? myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length : 0;
    const statsCount = myReviews.length;

    return (
        <div className="min-h-screen bg-background">
            <main className="container py-12 max-w-4xl space-y-8">
                {/* Header card */}
                <Card className="p-8 border-2 shadow-soft">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-primary grid place-items-center text-4xl font-bold text-primary-foreground shadow-soft">{user?.username?.[0]?.toUpperCase() || "Т"}</div>
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold mb-1">{user?.username || "Ти"}</h1>
                            <p className="text-muted-foreground mb-3">Участник в общността · от {new Date().getFullYear()}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className={`w-5 h-5 ${i <= Math.round(overall) ? "fill-primary text-primary" : "text-muted"}`} />
                                    ))}
                                </div>
                                <span className="font-bold text-lg">{overall.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">({statsCount} отзива)</span>
                            </div>
                        </div>
                        <Button className="bg-gradient-primary hover:opacity-90 shadow-soft">Редактирай</Button>
                    </div>
                </Card>

                <Tabs defaultValue="listings" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="listings">Моите обяви ({myDonations.length})</TabsTrigger>
                        <TabsTrigger value="requests">Заявки ({myRequests.length + receivedRequests.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="listings" className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myDonations.map((d) => (
                                <Card key={d.id} className="p-4 border flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-bold">{d.title}</h3>
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
                            {myDonations.length === 0 && <div className="text-muted-foreground p-4">Нямате активни обяви.</div>}
                        </div>
                    </TabsContent>

                    <TabsContent value="requests" className="pt-4 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Входящи заявки (Търсят от вас)</h3>
                            <div className="space-y-3">
                                {receivedRequests.length === 0 && <p className="text-muted-foreground text-sm">Нямате входящи заявки.</p>}
                                {receivedRequests.map(r => (
                                    <Card key={r.id} className="p-4 border flex items-center justify-between gap-4">
                                        <div>
                                            <div className="font-bold text-sm">{r.donation.title}</div>
                                            <div className="text-xs text-muted-foreground">Поискано от: <span className="font-semibold text-foreground">{r.requester.name}</span></div>
                                            <Badge variant="secondary" className="mt-1">{r.status}</Badge>
                                        </div>
                                        <div className="flex gap-2">
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

                        <div>
                            <h3 className="text-xl font-bold mb-4">Изходящи заявки (Вие търсите)</h3>
                            <div className="space-y-3">
                                {myRequests.length === 0 && <p className="text-muted-foreground text-sm">Нямате изходящи заявки.</p>}
                                {myRequests.map(r => (
                                    <Card key={r.id} className="p-4 border flex items-center justify-between gap-4">
                                        <div>
                                            <div className="font-bold text-sm">{r.donation.title}</div>
                                            <div className="text-xs text-muted-foreground">Собственик: <span className="font-semibold text-foreground">{r.donation.user?.name}</span></div>
                                            <Badge variant="secondary" className="mt-1">{r.status}</Badge>
                                        </div>
                                        <div className="flex gap-2">
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

                {/* Eco Calculator */}
                <EcoCalculator />

                {/* Gamification/Leveling */}
                <Gamification />

                {/* Recent reviews */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Отзиви за теб</h2>
                    <div className="space-y-3">
                        {myReviews.length === 0 && <Card className="p-6 border-2 text-center text-muted-foreground">Все още няма отзиви.</Card>}
                        {myReviews.map((r, i) => (
                            <Card key={i} className="p-6 border-2 overflow-hidden">
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    {r.imageUrl && (
                                        <div className="w-full sm:w-32 h-32 shrink-0 bg-muted/30">
                                            <img src={r.imageUrl} alt="Review" className="w-full h-full object-cover rounded-md border" />
                                        </div>
                                    )}
                                    <div className="flex-1 w-full pt-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Quote className="w-4 h-4 text-primary opacity-50 shrink-0" />
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i <= r.rating ? "fill-primary text-primary" : "text-muted"}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground">от {r.reviewer?.name} (За: {r.exchange?.donation?.title})</span>
                                        </div>
                                        {r.comment && <p className="text-sm mb-1 pl-6">{r.comment}</p>}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
