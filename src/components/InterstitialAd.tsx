
import { useState, useEffect } from 'react';
import { GoogleAdSense } from './GoogleAdSense';
import { motion } from 'framer-motion';

interface InterstitialAdProps {
    onComplete: () => void;
    duration?: number; // seconds
}

export function InterstitialAd({ onComplete, duration = 5 }: InterstitialAdProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-2xl max-w-lg w-full text-center shadow-2xl"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Your result is coming up in {timeLeft}...
                </h3>

                <div className="min-h-[250px] bg-gray-50 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                    <GoogleAdSense
                        client="ca-pub-8295491395007414"
                        slot="1011003061"
                        format="rectangle"
                    />
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className="bg-love-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / duration) * 100}%` }}
                    ></div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Please wait a moment while we prepare your special surprise.
                </p>
            </motion.div>
        </div>
    );
}
