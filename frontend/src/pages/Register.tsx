import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ArrowLeft, UserPlus, Mail, Lock, User as UserIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {motion} from "framer-motion";
import {useAuth} from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

const Register = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Паролите не съвпадат!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Грешка при регистрация");
            }

            // Автоматичен логин след успешна регистрация
            const loginResponse = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                throw new Error(loginData.message || "Грешка при автоматичен вход");
            }

            // Използване на функцията login от AuthContext
            login(loginData.access_token, loginData.user);

            toast.success("Регистрацията е успешна!", {
                description: "Влязохте успешно в профила си.",
            });

            navigate("/"); // Пренасочване към началната страница
        } catch (error: any) {
            toast.error("Възникна грешка", {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl" />
                <div className="absolute top-[40%] -left-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
            </div>

            <div className="container flex-1 flex flex-col justify-center items-center py-12">
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Към началото
                </Link>

                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto shadow-glow mb-4">
                            <UserPlus className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Създай профил</h1>
                        <p className="text-muted-foreground mt-2">Присъедини се към общността на Пулсът на Доброто</p>
                    </div>

                    <Card className="border-2 shadow-soft backdrop-blur-sm bg-background/90">
                        <CardHeader className="pb-4">
                            <CardTitle>Регистрация</CardTitle>
                            <CardDescription>Въведи своите данни, за да създадеш акаунт.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Име и Фамилия</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="name" name="name" placeholder="Иван Иванов" className="pl-9 bg-background/50" value={formData.name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Имейл адрес</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" name="email" type="email" placeholder="ivan@example.com" className="pl-9 bg-background/50" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Парола</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-9 bg-background/50" value={formData.password} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Потвърди паролата</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" className="pl-9 bg-background/50" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 mt-2 h-11" disabled={isLoading}>
                                    {isLoading ? "Регистриране..." : "Регистрирай се"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t border-border/50 pt-6 pb-6">
                            <p className="text-sm text-muted-foreground">
                                Вече имаш профил?{" "}
                                <Link to="/login" className="text-primary font-medium hover:underline">
                                    Влез от тук
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
