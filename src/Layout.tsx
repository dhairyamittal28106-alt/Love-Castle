import { Link, Outlet } from 'react-router-dom'; import { BackgroundEffect } from './components/ui/BackgroundEffect';
import { Heart, MessageCircleHeart } from './components/ui/Icons';

export function Layout() {
    return (
        <div className="min-h-screen bg-love-50 font-sans text-stone-800 relative">
            <BackgroundEffect />
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-love-100 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Heart className="w-6 h-6 text-love-500 fill-love-500 animate-heartbeat" />
                        <span className="font-handwriting text-2xl font-bold text-love-600 bg-clip-text">
                            Love Castle
                        </span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/letter" className="text-love-900 hover:text-love-600 transition-colors font-medium">
                            Love Letter
                        </Link>
                        <Link to="/games" className="text-love-900 hover:text-love-600 transition-colors font-medium">
                            Love Triangle
                        </Link>
                        <Link to="/chat" className="text-love-900 hover:text-love-600 transition-colors font-medium flex items-center gap-1">
                            <MessageCircleHeart className="w-4 h-4" />
                            Secret Chat
                        </Link>
                        <Link to="/settings" className="text-love-900 hover:text-love-600 transition-colors font-medium">
                            Settings
                        </Link>
                        <Link to="/dashboard" className="px-4 py-2 bg-love-500 text-white rounded-full hover:bg-love-600 transition-colors shadow-lg shadow-love-200">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>
            <main className="pt-16 min-h-[calc(100vh-footer-height)]">
                <Outlet />
            </main>
            <footer className="py-8 bg-white border-t border-love-100">
                <div className="container mx-auto px-4 text-center text-love-800/60">
                    <p>© 2024 Love Castle Inc.</p>
                    <p className="text-sm">Made with ❤️ for your Valentine</p>
                </div>
            </footer>
        </div>
    );
}
