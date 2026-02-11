
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BackgroundEffect } from './components/ui/BackgroundEffect';
import { Heart, MessageCircleHeart, Menu, X } from './components/ui/Icons';
import { GoogleAdSense } from './components/GoogleAdSense';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="min-h-screen bg-love-50 font-sans text-stone-800 relative">
            <BackgroundEffect />
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-love-100 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                        <Heart className="w-6 h-6 text-love-500 fill-love-500 animate-heartbeat" />
                        <span className="font-handwriting text-2xl font-bold text-love-600 bg-clip-text">
                            Love Castle
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/letter" label="Love Letter" />
                        <NavLink to="/games" label="Love Triangle" />
                        <Link to="/chat" className="text-love-900 hover:text-love-600 transition-colors font-medium flex items-center gap-1">
                            <MessageCircleHeart className="w-4 h-4" />
                            Secret Chat
                        </Link>
                        <NavLink to="/settings" label="Settings" />
                        <Link to="/dashboard" className="px-4 py-2 bg-love-500 text-white rounded-full hover:bg-love-600 transition-colors shadow-lg shadow-love-200">
                            Dashboard
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-love-600 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-md md:hidden flex flex-col p-6 gap-6 overflow-y-auto border-b border-love-100"
                    >
                        <MobileNavLink to="/letter" label="💌 Love Letter" onClick={closeMenu} />
                        <MobileNavLink to="/games" label="🎮 Love Triangle" onClick={closeMenu} />
                        <MobileNavLink to="/chat" label="💬 Secret Chat" onClick={closeMenu} />
                        <MobileNavLink to="/settings" label="⚙️ Settings" onClick={closeMenu} />
                        <Link
                            to="/dashboard"
                            onClick={closeMenu}
                            className="w-full py-4 bg-love-500 text-white text-center rounded-xl font-bold text-lg hover:bg-love-600 shadow-lg"
                        >
                            Dashboard
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="pt-16 min-h-[calc(100vh-footer-height)]">
                <Outlet />
            </main>

            {/* Ad Container */}
            <div className="container mx-auto px-4 py-4">
                <GoogleAdSense
                    client="ca-pub-8295491395007414"
                    slot="1011003061"
                    className="w-full overflow-hidden"
                />
            </div>

            <footer className="py-8 bg-white border-t border-love-100">
                <div className="container mx-auto px-4 text-center text-love-800/60">
                    <p>© 2026 Love Castle Inc.</p>
                    <p className="text-sm">Made with ❤️ for your Valentine</p>
                </div>
            </footer>
        </div>
    );
}

function NavLink({ to, label }: { to: string, label: string }) {
    return (
        <Link to={to} className="text-love-900 hover:text-love-600 transition-colors font-medium">
            {label}
        </Link>
    );
}

function MobileNavLink({ to, label, onClick }: { to: string, label: string, onClick: () => void }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="text-xl font-medium text-love-800 border-b border-love-50 pb-4 active:text-love-600"
        >
            {label}
        </Link>
    );
}
