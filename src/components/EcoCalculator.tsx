import {Card} from "@/components/ui/card";
import {Trees, Droplet, Cloud, Trophy, Leaf} from "lucide-react";
import {motion} from "framer-motion";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent} from "@/components/ui/chart";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer} from "recharts";

const MOCK_DATA = [
    {month: "Яну", co2: 12, water: 450},
    {month: "Фев", co2: 25, water: 800},
    {month: "Мар", co2: 40, water: 1200},
    {month: "Апр", co2: 30, water: 950},
    {month: "Май", co2: 55, water: 1600},
];

const chartConfig = {
    co2: {
        label: "Спестен CO2 (кг)",
        color: "hsl(142.1 76.2% 36.3%)", // primary green
    },
    water: {
        label: "Спестена вода (л)",
        color: "hsl(217.2 91.2% 59.8%)", // blue
    },
} satisfies ChartConfig;

export default function EcoCalculator() {
    const totalCO2 = 162;
    const totalWater = 5000;
    const level = 4; // Represents the tree growth level

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center shadow-soft">
                    <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Личен Еко-калкулатор</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Eco Stats & Tree */}
                <Card className="p-6 border-2 shadow-soft overflow-hidden relative isolate h-full">
                    {/* Tree Animation */}
                    <div className="absolute -bottom-4 -right-4 opacity-10 z-[-1] pointer-events-none">
                        <motion.div initial={{scale: 0, originY: 1}} animate={{scale: 1}} transition={{type: "spring", bounce: 0.4, duration: 2}}>
                            <Trees className="w-64 h-64 text-emerald-600" />
                        </motion.div>
                    </div>

                    <h3 className="font-bold text-lg mb-6">Твоят принос към природата</h3>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Cloud className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Спестени CO2 емисии</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {totalCO2} <span className="text-lg">кг</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Droplet className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Спестена питейна вода</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {totalWater} <span className="text-lg">л</span>
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col items-center text-center mt-6">
                            <motion.div initial={{scale: 0.8}} animate={{scale: [0.8, 1.1, 1]}} transition={{duration: 0.5, delay: 0.5}}>
                                <Trees className="w-12 h-12 text-primary drop-shadow-sm mb-2" />
                            </motion.div>
                            <h4 className="font-bold text-primary">Дърво на живота: Ниво {level}</h4>
                            <p className="text-xs text-muted-foreground mt-1">Твоето фиктивно дръвче расте благодарение на добрите ти дела! Още 38 XP до Ниво 5.</p>
                        </div>
                    </div>
                </Card>

                {/* Chart */}
                <Card className="p-6 border-2 shadow-soft h-full flex flex-col">
                    <h3 className="font-bold text-lg mb-6">Принос по месеци</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ChartContainer config={chartConfig} className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart accessibilityLayer data={MOCK_DATA} margin={{top: 10, right: 10, bottom: 10, left: 10}}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="water" fill="var(--color-water)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="co2" fill="var(--color-co2)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
