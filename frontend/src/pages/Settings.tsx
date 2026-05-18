import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {User, Phone, MapPin, Info, Lock, ArrowLeft, ShieldCheck, BadgeCheck, Mail} from "lucide-react";
import {useAuth} from "@/contexts/AuthContext";
import {toast} from "sonner";
import {Link, useNavigate} from "react-router-dom";
import {API_BASE} from "@/lib/api";

const TRUST_CHECKS = [
  { icon: Mail, label: "Имейл потвърден", done: true },
  { icon: Phone, label: "Телефон потвърден", done: true },
  { icon: BadgeCheck, label: "Лична карта (опц.)", done: false },
  { icon: MapPin, label: "Локация потвърдена", done: true },
];

const Settings = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    const [profileData, setProfileData] = useState({ 
        name: user?.name || "", 
        avatarUrl: user?.avatarUrl || "",
        phone: user?.phone || "",
        city: user?.city || "",
        bio: user?.bio || "",
        password: ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({ 
                name: user.name, 
                avatarUrl: user.avatarUrl || "",
                phone: user.phone || "",
                city: user.city || "",
                bio: user.bio || "",
                password: ""
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/users/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });
            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem("user", JSON.stringify(updatedUser));
                toast.success("Профилът е обновен успешно!");
                // Clear password field after successful update
                setProfileData(prev => ({ ...prev, password: "" }));
                // We don't necessarily need to reload, the context should update if we had a way to notify it
                // but since AuthContext reads from localStorage on init, a small reload or navigating back is fine.
                navigate("/profile");
                window.location.reload(); 
            } else {
                const err = await res.json();
                toast.error("Грешка при обновяване на профила: " + (err.message || "Неизвестна грешка"));
            }
        } catch (err) {
            toast.error("Грешка при комуникация със сървъра.");
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Снимката е твърде голяма. Максималният размер е 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileData({ ...profileData, avatarUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="container py-12 max-w-3xl space-y-8">
                <div className="flex items-center gap-4">
                    <Link to="/profile">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight">Настройки на профила</h1>
                </div>

                <Card className="p-8 border-2 shadow-soft">
                    <form onSubmit={handleProfileUpdate} className="space-y-8">
                        <div className="flex flex-col sm:flex-row items-start gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-soft relative group">
                                    {profileData.avatarUrl ? (
                                        <img src={profileData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-muted grid place-items-center text-muted-foreground text-4xl">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                    <label htmlFor="avatar-upload-settings" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center cursor-pointer text-white text-xs font-bold text-center p-2">
                                        Смени снимка
                                    </label>
                                    <input id="avatar-upload-settings" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                </div>
                                <p className="text-xs text-muted-foreground max-w-[120px] text-center">Квадратна снимка, до 5MB</p>
                            </div>

                            <div className="flex-1 w-full space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2"><User className="w-4 h-4" /> Име и Фамилия</Label>
                                        <Input value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} required placeholder="Вашето име" autoComplete="name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2"><Phone className="w-4 h-4" /> Телефон</Label>
                                        <Input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="+359 888 123 456" autoComplete="tel" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Град</Label>
                                        <Input value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} placeholder="напр. София" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2"><Lock className="w-4 h-4" /> Нова парола (оставете празно за без промяна)</Label>
                                        <Input type="password" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})} placeholder="******" autoComplete="new-password" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Info className="w-4 h-4" /> Информация за мен</Label>
                                    <Textarea 
                                        value={profileData.bio} 
                                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
                                        rows={4} 
                                        placeholder="Разкажете малко за себе си, вашите каузи и защо сте част от общността..." 
                                    />
                                </div>

                                <div className="flex justify-end pt-4 border-t gap-4">
                                    <Link to="/profile">
                                        <Button type="button" variant="outline">Отказ</Button>
                                    </Link>
                                    <Button type="submit" size="lg" className="bg-gradient-primary px-12 shadow-soft hover:opacity-90">Запази промените</Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Card>

                {/* Trust card */}
                <Card className="p-8 border-2 shadow-soft">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            <h3 className="font-bold text-xl">Доверен профил</h3>
                        </div>
                        <Badge className="sm:ml-auto w-fit bg-primary/10 text-primary border-0 text-sm px-3 py-1">75% Завършен</Badge>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Завършете всички стъпки, за да изградите максимално доверие в общността и да получите значка "Доверен потребител".
                    </p>
                    <Progress value={75} className="h-3 mb-8" />
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        {TRUST_CHECKS.map((t, i) => {
                            const Icon = t.icon;
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                                        t.done ? "border-primary/30 bg-primary/5 shadow-sm" : "border-dashed border-border opacity-70 hover:opacity-100 hover:border-primary/50 cursor-pointer"
                                    }`}
                                    onClick={() => !t.done && toast.info(`Функцията за потвърждаване на ${t.label.toLowerCase()} предстои да бъде добавена.`)}
                                >
                                    <div className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${t.done ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground"}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm truncate">{t.label}</div>
                                        <div className="text-xs text-muted-foreground">{t.done ? "Потвърдено" : "Изисква действие"}</div>
                                    </div>
                                    {t.done ? (
                                        <BadgeCheck className="w-6 h-6 text-primary shrink-0" />
                                    ) : (
                                        <Button variant="outline" size="sm" className="h-8 shrink-0">Потвърди</Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default Settings;
