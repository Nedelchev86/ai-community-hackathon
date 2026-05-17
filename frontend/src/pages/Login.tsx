import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, Mail, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Грешка при вход");
            }

            login(data.access_token, data.user);
            
            toast.success("Успешен вход!", {
                description: `Добре дошли отново, ${data.user.name}!`,
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
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl" />
                <div className="absolute bottom-[20%] -left-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
            </div>

            <div className="container flex-1 flex flex-col justify-center items-center py-12">
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Към началото
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto shadow-glow mb-4">
                            <LogIn className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Влез в профила си</h1>
                        <p className="text-muted-foreground mt-2">Продължи да правиш добро в твоята общност</p>
                    </div>

                    <Card className="border-2 shadow-soft backdrop-blur-sm bg-background/90">
                        <CardHeader className="pb-4">
                            <CardTitle>Вход</CardTitle>
                            <CardDescription>Въведи своите данни за достъп.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Имейл адрес</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="email" 
                                            name="email" 
                                            type="email" 
                                            placeholder="ivan@example.com" 
                                            className="pl-9 bg-background/50"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="username"
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password">Парола</Label>
                                        <a href="#" className="text-xs text-primary hover:underline">Забравена парола?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="password" 
                                            name="password" 
                                            type="password" 
                                            placeholder="••••••••" 
                                            className="pl-9 bg-background/50"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 mt-2 h-11" disabled={isLoading}>
                                    {isLoading ? "Влизане..." : "Влез"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t border-border/50 pt-6 pb-6">
                            <p className="text-sm text-muted-foreground">
                                Нямаш профил?{" "}
                                <Link to="/register" className="text-primary font-medium hover:underline">
                                    Регистрирай се
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;

