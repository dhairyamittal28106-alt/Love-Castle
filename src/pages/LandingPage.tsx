import { motion } from 'framer-motion';
import { Heart, Utensils, MessageCircleHeart, Gamepad2 } from '../components/ui/Icons';
import { Link } from 'react-router-dom';
import type { ComponentType, ReactNode } from 'react';

type MotionComponentProps = Record<string, unknown>;
const MotionDiv = motion.div as ComponentType<MotionComponentProps>;

export function LandingPage() {
    return (
        <div className="space-y-20 pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-love-50 to-white">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-20 h-20 bg-love-200 rounded-full opacity-30 animate-float" />
                    <div className="absolute bottom-20 right-10 w-32 h-32 bg-love-300 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-love-100 text-love-600 text-sm font-medium mb-6 animate-bounce">
                            ❤️ Valentine's Special Edition
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Manage Your <span className="font-handwriting text-love-500">Love Life</span> <br />
                            Like a Pro
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            The only SaaS (Sweetheart as a Service) platform you need.
                            Track hugs, send secret letters, and finally answer the ultimate question...
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/letter" className="group px-8 py-4 bg-love-500 text-white rounded-full text-lg font-semibold shadow-xl shadow-love-200 hover:shadow-2xl hover:bg-love-600 transition-all transform hover:-translate-y-1">
                                Write a Secret Letter
                                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">💌</span>
                            </Link>
                            <Link to="/games" className="px-8 py-4 bg-white text-love-600 border-2 border-love-100 rounded-full text-lg font-semibold hover:bg-love-50 transition-colors">
                                Enter Love Triangle
                            </Link>
                        </div>
                    </MotionDiv>
                </div>
            </section>

            {/* Meme Section */}
            <section className="container mx-auto px-4">
                <MotionDiv
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-love-100 max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="w-16 h-16 bg-love-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Utensils className="w-8 h-8 text-love-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">"Mere Babu Ne Khana Khaya?"</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Never miss a meal check-in again. Our advanced algorithms remind you to ask the most important question in the universe.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="font-semibold text-lg mb-2">99.9% Uptime</div>
                            <p className="text-sm text-gray-500">Always online for late night talks.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="font-semibold text-lg mb-2">Smart Alerts</div>
                            <p className="text-sm text-gray-500">Get notified when mood swings apply.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="font-semibold text-lg mb-2">Cuddle Analytics</div>
                            <p className="text-sm text-gray-500">Track affection metrics in real-time.</p>
                        </div>
                    </div>
                </MotionDiv>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Everything you need for Feb 14th</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<MessageCircleHeart className="w-6 h-6 text-white" />}
                        title="Secret Letters"
                        description="Send encrypted love notes that only your valentine can decode."
                        color="bg-pink-500"
                    />
                    <FeatureCard
                        icon={<Gamepad2 className="w-6 h-6 text-white" />}
                        title="Love Triangle"
                        description="Test your compatibility and play fun mini-games together."
                        color="bg-purple-500"
                    />
                    <FeatureCard
                        icon={<Heart className="w-6 h-6 text-white" />}
                        title="Love Calculator"
                        description="Scientific* proof that you two are meant to be. (*not actually scientific)"
                        color="bg-red-500"
                    />
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description, color }: { icon: ReactNode, title: string, description: string, color: string }) {
    return (
        <MotionDiv
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all"
        >
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 shadow-md`}>
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </MotionDiv>
    )
}
