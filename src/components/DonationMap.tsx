import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Shirt, Sofa, BookOpen, Cpu, Package, MapPin, Heart, Search } from "lucide-react";

type PointType = "donation" | "need" | "hub";
type Category = "clothes" | "furniture" | "books" | "tech" | "other";

interface MapPoint {
  id: string;
  type: PointType;
  category: Category;
  title: string;
  desc: string;
  lat: number;
  lng: number;
}

const BURGAS: [number, number] = [42.5048, 27.4626];

const POINTS: MapPoint[] = [
  { id: "1", type: "donation", category: "clothes", title: "Детски дрехи 2-4г", desc: "Запазени, чисти, готови за нов дом.", lat: 42.5061, lng: 27.4682 },
  { id: "2", type: "donation", category: "furniture", title: "Дървено бюро", desc: "Леки следи от употреба, стабилно.", lat: 42.4998, lng: 27.4711 },
  { id: "3", type: "need", category: "tech", title: "Търси лаптоп за ученик", desc: "Семейство от Меден рудник.", lat: 42.4715, lng: 27.4520 },
  { id: "4", type: "hub", category: "other", title: "Пункт ‘Морска градина’", desc: "Прием: пн-пт, 10:00-18:00.", lat: 42.4942, lng: 27.4815 },
  { id: "5", type: "donation", category: "books", title: "Детски книжки", desc: "20 броя, отлично състояние.", lat: 42.5125, lng: 27.4598 },
  { id: "6", type: "need", category: "clothes", title: "Зимни якета, размер S/M", desc: "За социален център.", lat: 42.5183, lng: 27.4749 },
  { id: "7", type: "hub", category: "other", title: "Пункт ‘Славейков’", desc: "Прием: всеки ден до 20:00.", lat: 42.5226, lng: 27.4501 },
  { id: "8", type: "donation", category: "tech", title: "Принтер HP", desc: "Работи отлично, с касета.", lat: 42.4880, lng: 27.4690 },
];

const CATEGORIES: { value: Category | "all"; label: string; icon: typeof Shirt }[] = [
  { value: "all", label: "Всички", icon: Package },
  { value: "clothes", label: "Дрехи", icon: Shirt },
  { value: "furniture", label: "Мебели", icon: Sofa },
  { value: "books", label: "Книги", icon: BookOpen },
  { value: "tech", label: "Техника", icon: Cpu },
];

const TYPE_META: Record<PointType, { label: string; color: string; icon: string }> = {
  donation: { label: "Дарение", color: "hsl(152 56% 38%)", icon: "💚" },
  need: { label: "Нужда", color: "hsl(15 90% 60%)", icon: "🤝" },
  hub: { label: "Пункт", color: "hsl(200 85% 55%)", icon: "📦" },
};

const makeIcon = (type: PointType) =>
  L.divIcon({
    className: "",
    html: `<div style="background:${TYPE_META[type].color};width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.25);border:3px solid white;"><span style="transform:rotate(45deg);font-size:16px;">${TYPE_META[type].icon}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

// haversine km
const distKm = (a: [number, number], b: [number, number]) => {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const Recenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

export const DonationMap = () => {
  const [category, setCategory] = useState<Category | "all">("all");
  const [radius, setRadius] = useState(5);
  const [activeTypes, setActiveTypes] = useState<Record<PointType, boolean>>({
    donation: true,
    need: true,
    hub: true,
  });
  const [center] = useState<[number, number]>(BURGAS);

  const filtered = useMemo(
    () =>
      POINTS.filter((p) => activeTypes[p.type])
        .filter((p) => category === "all" || p.category === category)
        .filter((p) => distKm(center, [p.lat, p.lng]) <= radius),
    [category, radius, activeTypes, center]
  );

  return (
    <section id="map" className="container py-20 lg:py-28">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Карта на добротата</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Виж близо до теб</h2>
        <p className="text-muted-foreground text-lg">
          Дарения, активни нужди и пунктове за събиране — на една карта.
        </p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Filters */}
        <div className="space-y-4">
          <Card className="p-5 border-2">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" /> Категория
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-smooth border-2 ${
                      active
                        ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
                        : "bg-card border-border hover:border-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {c.label}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 border-2">
            <h3 className="font-bold mb-3">Разстояние</h3>
            <Slider
              value={[radius]}
              min={1}
              max={20}
              step={1}
              onValueChange={(v) => setRadius(v[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1 км</span>
              <span className="font-bold text-foreground">{radius} км</span>
              <span>20 км</span>
            </div>
          </Card>

          <Card className="p-5 border-2">
            <h3 className="font-bold mb-3">Покажи</h3>
            <div className="space-y-2">
              {(Object.keys(TYPE_META) as PointType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTypes((s) => ({ ...s, [t]: !s[t] }))}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border-2 transition-smooth ${
                    activeTypes[t] ? "border-primary bg-muted" : "border-border opacity-50"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: TYPE_META[t].color }}
                    />
                    {TYPE_META[t].label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {POINTS.filter((p) => p.type === t).length}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-2 bg-gradient-hero">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-primary mt-0.5" fill="currentColor" />
              <div>
                <div className="font-bold text-sm">{filtered.length} резултата</div>
                <div className="text-xs text-muted-foreground">
                  в радиус {radius} км около центъра
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="overflow-hidden border-2 shadow-soft h-[600px] relative">
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <Recenter center={center} />
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
              center={center}
              radius={radius * 1000}
              pathOptions={{
                color: "hsl(152, 56%, 38%)",
                fillColor: "hsl(152, 70%, 55%)",
                fillOpacity: 0.08,
                weight: 2,
              }}
            />
            {filtered.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon(p.type)}>
                <Popup>
                  <div className="space-y-1 min-w-[180px]">
                    <Badge
                      style={{ background: TYPE_META[p.type].color }}
                      className="text-white border-0"
                    >
                      {TYPE_META[p.type].label}
                    </Badge>
                    <div className="font-bold text-base mt-1">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                    <div className="text-xs text-muted-foreground pt-1">
                      📍 {distKm(center, [p.lat, p.lng]).toFixed(1)} км
                    </div>
                    <Button size="sm" className="w-full mt-2 bg-gradient-primary">
                      Свържи се
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Card>
      </div>
    </section>
  );
};

export default DonationMap;
