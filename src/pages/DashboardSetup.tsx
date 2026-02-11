
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from '../components/ui/Icons';

export type UserData = {
    userName: string;
    partnerName: string;
    anniversaryDate: string;
};

export function DashboardSetup({ onComplete }: { onComplete: (data: UserData) => void }) {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState<UserData>({
        userName: '',
        partnerName: '',
        anniversaryDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Save and Finish
            localStorage.setItem('loveCastle_userData', JSON.stringify(userData));
            onComplete(userData);
        }
    };

    const isStepValid = () => {
        if (step === 1) return userData.userName.length > 0;
        if (step === 2) return userData.partnerName.length > 0;
        if (step === 3) return userData.anniversaryDate.length > 0;
        return false;
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-love-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-love-100"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-love-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-love-600 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome to Love Castle</h2>
                    <p className="text-gray-600">Let's set up your royal profile</p>
                </div>

                <div className="space-y-6">
                    {step === 1 && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">What is your name?</label>
                            <input
                                type="text"
                                name="userName"
                                value={userData.userName}
                                onChange={handleChange}
                                placeholder="e.g. Romeo"
                                className="w-full px-4 py-3 rounded-xl border border-love-200 focus:ring-2 focus:ring-love-500 outline-none text-lg"
                                autoFocus
                            />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">And your Valentine's name?</label>
                            <input
                                type="text"
                                name="partnerName"
                                value={userData.partnerName}
                                onChange={handleChange}
                                placeholder="e.g. Juliet"
                                className="w-full px-4 py-3 rounded-xl border border-love-200 focus:ring-2 focus:ring-love-500 outline-none text-lg"
                                autoFocus
                            />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">When did your story begin?</label>
                            <input
                                type="date"
                                name="anniversaryDate"
                                value={userData.anniversaryDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-love-200 focus:ring-2 focus:ring-love-500 outline-none text-lg"
                                autoFocus
                            />
                        </motion.div>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="w-full py-4 bg-love-500 text-white rounded-xl font-bold hover:bg-love-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {step === 3 ? 'Enter Castle' : 'Next Step'}
                    </button>

                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-love-500' : 'bg-love-100'}`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
