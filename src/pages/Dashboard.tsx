import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, MessageCircle, Coffee, TrendingUp, Sun, Bell } from '../components/ui/Icons';
import type { ComponentType } from 'react';
import { DashboardSetup, type UserData } from './DashboardSetup';

type MotionComponentProps = Record<string, unknown>;
const MotionDiv = motion.div as ComponentType<MotionComponentProps>;

export function Dashboard() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // Dynamic metrics state
    const [loveScore, setLoveScore] = useState(0);
    const [textsCount, setTextsCount] = useState(0);
    const [daysTogether, setDaysTogether] = useState(0);

    const [nextDate, setNextDate] = useState<string | null>('2024-02-14'); // Default Valentine's
    const [goodMorningSent, setGoodMorningSent] = useState(false);
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('loveCastle_userData');
        if (stored) {
            const data = JSON.parse(stored);
            setUserData(data);

            // Calculate initial metrics based on start date
            if (data.anniversaryDate) {
                const start = new Date(data.anniversaryDate);
                const now = new Date();
                const diffTime = now.getTime() - start.getTime();
                const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

                setDaysTogether(diffDays);
                setLoveScore(diffDays * 50); // 50 points per day
                setTextsCount(diffDays * 12); // Average 12 texts per day
            }
        }
        setLoading(false);
    }, []);

    // Check for "Day Before" message
    useEffect(() => {
        if (nextDate) {
            const today = new Date();
            const date = new Date(nextDate);
            const diffTime = date.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                setShowReminder(true);
            }
        }
    }, [nextDate]);

    const handleSendGoodMorning = () => {
        setGoodMorningSent(true);
        setLoveScore(prev => prev + 10);
        setTextsCount(prev => prev + 1);
    };

    if (loading) return null;

    if (!userData) {
        return <DashboardSetup onComplete={(data) => {
            setUserData(data);
            // Recalculate immediately for new users
            const start = new Date(data.anniversaryDate);
            const now = new Date();
            const diffTime = now.getTime() - start.getTime();
            const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
            setDaysTogether(diffDays);
            setLoveScore(diffDays * 50);
            setTextsCount(diffDays * 12);
        }} />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {userData.userName} & {userData.partnerName}</h1>
                    <p className="text-gray-600">Real-time analytics of your love life</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Status: Healthy & Cute
                </div>
            </div>

            {/* Notifications / Reminders */}
            <AnimatePresence>
                {/* Day Before Reminder */}
                {showReminder && (
                    <MotionDiv
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 p-4 bg-love-100 border border-love-200 rounded-xl flex items-center gap-4 text-love-800"
                    >
                        <Bell className="w-6 h-6 animate-bounce" />
                        <div>
                            <h3 className="font-bold">Romantic Alert!</h3>
                            <p>Tomorrow is your Date Night! Don't forget to wear that nice shirt.</p>
                        </div>
                    </MotionDiv>
                )}

                {/* Good Morning Reminder */}
                {!goodMorningSent && (
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-6 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl border border-orange-200 shadow-sm flex items-center justify-between flex-wrap gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full shadow-sm text-orange-500">
                                <Sun className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Morning Routine</h3>
                                <p className="text-gray-600">You haven't sent your "Good Morning" text yet!</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSendGoodMorning}
                            className="px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
                        >
                            Send Now (+10 XP)
                        </button>
                    </MotionDiv>
                )}
            </AnimatePresence>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    icon={<Heart className="w-5 h-5 text-white" />}
                    label="Love Score"
                    value={loveScore.toLocaleString()}
                    trend="+10XP today"
                    color="bg-love-500"
                />
                <MetricCard
                    icon={<Calendar className="w-5 h-5 text-white" />}
                    label="Days Together"
                    value={daysTogether.toString()}
                    trend="Since start"
                    color="bg-purple-500"
                />
                <MetricCard
                    icon={<MessageCircle className="w-5 h-5 text-white" />}
                    label="Texts Sent"
                    value={textsCount.toLocaleString()}
                    trend="& counting..."
                    color="bg-blue-500"
                />
                <MetricCard
                    icon={<Coffee className="w-5 h-5 text-white" />}
                    label="Next Date"
                    value={nextDate ? new Date(nextDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Plan one!'}
                    trend="Upcoming"
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Date Planner Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Activity Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Affection Over Time</h3>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                            {[40, 65, 45, 80, 55, 90, 100].map((height, i) => (
                                <div key={i} className="w-full bg-love-50 rounded-t-lg relative group">
                                    <MotionDiv
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="absolute bottom-0 w-full bg-love-500 opacity-80 rounded-t-lg group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Date Planner Widget */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-love-500" />
                            Plan a Date
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="date"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-love-500 outline-none"
                                onChange={(e) => setNextDate(e.target.value)}
                            />
                            <div className="flex-1 relative">
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-love-500 outline-none appearance-none bg-white">
                                    <option>Dinner & Movie</option>
                                    <option>Picnic</option>
                                    <option>Stargazing</option>
                                    <option>Netflix & Chill</option>
                                </select>
                            </div>
                            <button className="px-6 py-2 bg-love-500 text-white rounded-xl font-medium hover:bg-love-600 transition-colors shadow-md">
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {goodMorningSent && (
                            <ActivityItem
                                icon={<Sun className="w-4 h-4 text-orange-500" />}
                                title="Sent 'Good Morning'"
                                time="Just now"
                            />
                        )}
                        <ActivityItem
                            icon={<TrendingUp className="w-4 h-4 text-green-500" />}
                            title="Relationship Started"
                            time={userData.anniversaryDate ? new Date(userData.anniversaryDate).toLocaleDateString() : 'Unknown'}
                        />
                        <ActivityItem
                            icon={<MessageCircle className="w-4 h-4 text-blue-500" />}
                            title="Love Score Updated"
                            time="Today"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, label, value, trend, color }: any) {
    return (
        <MotionDiv
            whileHover={{ y: -2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
                </div>
                <div className={`p-3 rounded-xl ${color} shadow-lg shadow-opacity-20`}>
                    {icon}
                </div>
            </div>
            <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
            </div>
        </MotionDiv>
    )
}

function ActivityItem({ icon, title, time }: any) {
    return (
        <div className="flex items-center gap-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
        </div>
    )
}
