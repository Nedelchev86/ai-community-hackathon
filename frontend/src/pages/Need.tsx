import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {motion} from "framer-motion";
import {useAuth} from "@/contexts/AuthContext";
import {HandHeart} from "lucide-react";
import {MapContainer, TileLayer, Marker, useMapEvents} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { API_BASE } from "@/lib/api";

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

const Need = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "need", // Explicitly set type to "need"
        title: "",
        description: "",
        category: "Други",
        imageUrl: "",
        city: "",
        lat: null as number | null,
        lng: null as number | null,
    });

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Геолокацията не се поддържа от вашия браузър.");
            return;
        }

        toast.info("Взимане на локация...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }));
                toast.success("Локацията е успешно запазена!");
            },
            () => {
                toast.error("Не успяхме да вземем локацията.");
            },
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Трябва да сте влезли в профила си, за да публикувате нужда.");
            navigate("/login");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/donations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Грешка при създаване на заявката");
            }

            toast.success("Успешно публикувано!", {
                description: "Надяваме се скоро някой да се отзове!",
            });

            navigate("/");
        } catch (error: any) {
            toast.error("Възникна грешка", {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-12 flex justify-center">
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="w-full max-w-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center mx-auto shadow-lg mb-4">
                        <HandHeart className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Поискай помощ</h1>
                    <p className="text-muted-foreground mt-2">Сподели от какво имаш нужда, за да могат хората около теб да помогнат.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Информация за нуждата</CardTitle>
                        <CardDescription>Опишете от какво точно се нуждаете в момента.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Заглавие</Label>
                                <Input id="title" name="title" placeholder="напр. Търся детски дрехи за 5-годишно момче" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Описание</Label>
                                <Textarea id="description" name="description" placeholder="Опишете защо имате нужда и всякакви специфични детайли (размери и др.)." value={formData.description} onChange={handleChange} required rows={4} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Категория</Label>
                                <select
                                    id="category"
                                    name="category"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.category}
                                    onChange={handleChange as any}
                                    required
                                >
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
                                <Label htmlFor="city">Град</Label>
                                <select id="city" name="city" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={formData.city} onChange={handleChange as any} required>
                                    <option value="" disabled>
                                        Избери град
                                    </option>
                                    <option value="София">София</option>
                                    <option value="Пловдив">Пловдив</option>
                                    <option value="Варна">Варна</option>
                                    <option value="Бургас">Бургас</option>
                                    <option value="Русе">Русе</option>
                                    <option value="Стара Загора">Стара Загора</option>
                                    <option value="Плевен">Плевен</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Локация за картата</Label>
                                <div className="flex flex-col gap-3">
                                    <div className="h-[250px] w-full rounded-md overflow-hidden border">
                                        <MapContainer center={[42.6977, 23.3219]} zoom={6} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <LocationPicker position={formData.lat && formData.lng ? [formData.lat, formData.lng] : null} setPosition={(p) => setFormData((prev) => ({...prev, lat: p[0], lng: p[1]}))} />
                                        </MapContainer>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Button type="button" variant="outline" onClick={handleGetLocation}>
                                            📍 Вземи моята локация
                                        </Button>
                                        {formData.lat && formData.lng && <span className="text-sm text-orange-600 font-medium">✔️ Локацията е избрана</span>}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Маркирайте с клик върху картата или използвайте геолокация, за да позволите на другите лесно да ви намерят.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">URL към снимка (опционално)</Label>
                                <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={handleChange} />
                            </div>

                            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 mt-6" disabled={isLoading}>
                                {isLoading ? "Изпращане..." : "Публикувай заявката"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Need;
