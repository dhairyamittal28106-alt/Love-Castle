
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, Heart, MailOpen } from '../components/ui/Icons';
import type { ComponentType } from 'react';
import { InterstitialAd } from '../components/InterstitialAd';

type MotionComponentProps = Record<string, unknown>;
const MotionDiv = motion.div as ComponentType<MotionComponentProps>;

export function SecretLetter() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [showAd, setShowAd] = useState(false);
    const [tempLink, setTempLink] = useState('');

    const encodedMessage = searchParams.get('m');
    const encodedRecipient = searchParams.get('r');

    const [isOpen, setIsOpen] = useState(false);

    // Decrypt if viewing
    const viewedMessage = encodedMessage ? atob(decodeURIComponent(encodedMessage)) : '';
    const viewedRecipient = encodedRecipient ? atob(decodeURIComponent(encodedRecipient)) : '';

    const generateLink = () => {
        if (!message) return;
        const encoded = encodeURIComponent(btoa(message));
        const encodedRec = encodeURIComponent(btoa(recipient));
        const link = `${window.location.origin}/letter?m=${encoded}&r=${encodedRec}`;

        setTempLink(link);
        setShowAd(true);
    };

    const handleAdComplete = () => {
        setShowAd(false);
        setGeneratedLink(tempLink);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Link copied to clipboard! Send it to your valentine ❤️');
    };

    if (encodedMessage) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-2xl w-full text-center">
                    <AnimatePresence>
                        {!isOpen ? (
                            <MotionDiv
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                className="cursor-pointer"
                                onClick={() => {
                                    setTimeout(() => setIsOpen(true), 1000);
                                }}
                            >
                                <div className="relative w-64 h-48 mx-auto bg-love-100 rounded-lg shadow-xl flex items-center justify-center border-2 border-love-300 transform transition-transform hover:scale-105">
                                    <Heart className="w-16 h-16 text-love-500 animate-pulse" />
                                    <div className="absolute -top-4 -right-4 bg-love-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-bounce">
                                        For {viewedRecipient || 'You'}
                                    </div>
                                    <p className="absolute bottom-4 text-love-600 font-medium">Click to Open</p>
                                </div>
                            </MotionDiv>
                        ) : (
                            <MotionDiv
                                initial={{ rotateX: 90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="bg-white p-8 md:p-12 rounded-lg shadow-2xl border border-love-100 relative"
                            >
                                <MailOpen className="w-12 h-12 text-love-500 mx-auto mb-6" />
                                <h2 className="text-3xl font-handwriting text-love-600 mb-6">My Dearest {viewedRecipient},</h2>
                                <p className="text-lg md:text-xl text-gray-700 whitespace-pre-wrap leading-relaxed font-handwriting">
                                    {viewedMessage}
                                </p>
                                <div className="mt-8 pt-8 border-t border-love-100">
                                    <p className="text-sm text-gray-500">
                                        With love,<br />
                                        Your Secret Valentine
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.location.href = '/letter'}
                                    className="mt-8 text-love-500 underline text-sm hover:text-love-700"
                                >
                                    Send your own letter
                                </button>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            {showAd && <InterstitialAd onComplete={handleAdComplete} />}

            <MotionDiv
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-love-100"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-love-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-love-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Secret Love Letter</h1>
                    <p className="text-gray-600">Write a message, get a link, and send it to your special someone.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">To (Optional)</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="e.g., My Babu"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-love-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your heart out..."
                            className="w-full px-4 py-4 h-48 rounded-xl border border-gray-200 focus:ring-2 focus:ring-love-500 focus:border-transparent outline-none transition-all resize-none font-handwriting text-xl"
                        />
                    </div>

                    <button
                        onClick={generateLink}
                        disabled={!message}
                        className="w-full py-4 bg-love-500 text-white rounded-xl font-bold hover:bg-love-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-love-200 transform active:scale-95"
                    >
                        Seal with a Kiss (Generate Link)
                    </button>

                    {generatedLink && !showAd && (
                        <MotionDiv
                            initial={{ height: "0px", opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="bg-love-50 p-4 rounded-xl border border-love-200 mt-4"
                        >
                            <p className="text-sm text-love-800 font-medium mb-2">Your secret link is ready:</p>
                            <div className="flex items-center gap-2">
                                <input
                                    readOnly
                                    value={generatedLink}
                                    className="flex-1 px-3 py-2 bg-white rounded-lg text-sm text-gray-600 border border-love-200"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 bg-love-500 text-white rounded-lg hover:bg-love-600 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </MotionDiv>
                    )}
                </div>
            </MotionDiv>
        </div>
    );
}
