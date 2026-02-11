
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Copy, Check } from 'lucide-react';
import { Heart } from '../components/ui/Icons';

export function Settings() {
    const { romanticUsername } = useAuth();
    const [userName, setUserName] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('userName');
        const storedPartner = localStorage.getItem('partnerName');
        if (storedUser) setUserName(storedUser);
        if (storedPartner) setPartnerName(storedPartner);
    }, []);

    const handleSave = () => {
        localStorage.setItem('userName', userName);
        localStorage.setItem('partnerName', partnerName);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // Dispatch storage event to update other components if they listen
        window.dispatchEvent(new Event('storage'));
    };

    const handleCopy = () => {
        if (romanticUsername) {
            navigator.clipboard.writeText(romanticUsername);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-love-100"
            >
                <div className="bg-love-50 px-6 py-8 text-center border-b border-love-100">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <Heart className="w-8 h-8 text-love-500 fill-love-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                    <p className="text-gray-600 mt-2">Customize your love nest</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Romantic Identity Section */}
                    {romanticUsername && (
                        <div className="bg-love-50/50 rounded-xl p-4 border border-love-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Secret Identity
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white px-4 py-2 rounded-lg border border-love-200 font-mono text-love-700">
                                    {romanticUsername}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 text-love-600 hover:bg-love-100 rounded-lg transition-colors"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Share this with your Valentine so they can verify it's you!
                            </p>
                        </div>
                    )}

                    {/* Personal Details Form */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:border-love-500 focus:ring-love-500 sm:text-sm"
                                placeholder="e.g. Romeo"
                            />
                        </div>

                        <div>
                            <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700">
                                Valentine's Name
                            </label>
                            <input
                                type="text"
                                id="partnerName"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:border-love-500 focus:ring-love-500 sm:text-sm"
                                placeholder="e.g. Juliet"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-all ${saved
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-love-600 hover:bg-love-700'
                                }`}
                        >
                            {saved ? 'Saved Successfully!' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
