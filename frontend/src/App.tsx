import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {Toaster} from "@/components/ui/toaster";
import {TooltipProvider} from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";
import Heroes from "./pages/Heroes.tsx";
import Events from "./pages/Events.tsx";
import WallOfHope from "./pages/WallOfHope.tsx";
import Forest from "./pages/Forest.tsx";
import Partners from "./pages/Partners.tsx";
import MapPage from "./pages/MapPage.tsx";
import Donate from "./pages/Donate.tsx";
import Need from "./pages/Need.tsx";
import {Header} from "./components/Header.tsx";
import {AuthProvider} from "./contexts/AuthContext.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <AuthProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1 pt-[73px]">
                            <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/map" element={<MapPage />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/heroes" element={<Heroes />} />
                                <Route path="/events" element={<Events />} />
                                <Route path="/wall" element={<WallOfHope />} />
                                <Route path="/forest" element={<Forest />} />
                                <Route path="/partners" element={<Partners />} />
                                <Route path="/donate" element={<Donate />} />
                                <Route path="/need" element={<Need />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
