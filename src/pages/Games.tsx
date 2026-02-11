
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Trophy, RotateCcw, Flame, HelpCircle } from '../components/ui/Icons';
import confetti from 'canvas-confetti';
import { InterstitialAd } from '../components/InterstitialAd';

import type { ComponentType } from 'react';

type MotionComponentProps = Record<string, unknown>;
const MotionDiv = motion.div as ComponentType<MotionComponentProps>;
const MotionButton = motion.button as ComponentType<MotionComponentProps>;

export function Games() {
    const [activeGame, setActiveGame] = useState<'calculator' | 'flappy' | 'flames' | 'predictor' | null>(null);

    if (!activeGame) {
        return (
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Love Triangle</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <GameCard
                        title="Love Calculator"
                        description="Discover your destiny with our highly scientific algorithm."
                        icon={<Sparkles className="w-12 h-12 text-white" />}
                        color="bg-purple-500"
                        onClick={() => setActiveGame('calculator')}
                    />
                    <GameCard
                        title="Flappy Heart"
                        description="Dodge the red flags and collect love tokens!"
                        icon={<Heart className="w-12 h-12 text-white" />}
                        color="bg-love-500"
                        onClick={() => setActiveGame('flappy')}
                    />
                    <GameCard
                        title="FLAMES"
                        description="Friends, Lovers, or Enemies? Find out now!"
                        icon={<Flame className="w-12 h-12 text-white" />}
                        color="bg-love-600"
                        onClick={() => setActiveGame('flames')}
                    />
                    <GameCard
                        title="Future Predictor"
                        description="Will you get married? Ask the oracle."
                        icon={<HelpCircle className="w-12 h-12 text-white" />}
                        color="bg-love-400"
                        onClick={() => setActiveGame('predictor')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => setActiveGame(null)}
                className="mb-8 text-love-600 font-medium hover:underline flex items-center gap-2"
            >
                ← Back to Arcade
            </button>
            {activeGame === 'calculator' && <LoveCalculator />}
            {activeGame === 'flappy' && <FlappyHeart />}
            {activeGame === 'flames' && <FlamesGame />}
            {activeGame === 'predictor' && <FuturePredictor />}
        </div>
    );
}

function GameCard({ title, description, icon, color, onClick }: any) {
    return (
        <MotionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="text-left w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl transition-all"
        >
            <div className={`w-24 h-24 rounded-full ${color} flex items-center justify-center mb-6 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-lg">{description}</p>
        </MotionButton>
    );
}

function LoveCalculator() {
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [calculating, setCalculating] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [tempResult, setTempResult] = useState<number | null>(null);

    const calculateLove = () => {
        if (!name1 || !name2) return;
        setCalculating(true);
        setResult(null);

        // Fake calculation delay
        setTimeout(() => {
            // Deterministic "random" based on string char codes
            const combined = (name1 + name2).toLowerCase().replace(/\s/g, '');
            let sum = 0;
            for (let i = 0; i < combined.length; i++) {
                sum += combined.charCodeAt(i);
            }
            const score = (sum % 101); // 0-100
            const finalScore = score >= 80 ? score : Math.min(score + 20, 100);

            setTempResult(finalScore);
            setShowAd(true);
            setCalculating(false);
        }, 1500);
    };

    const handleAdComplete = () => {
        setShowAd(false);
        setResult(tempResult);

        if (tempResult && tempResult > 50) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f43f5e', '#ec4899', '#e11d48']
            });
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-love-100 text-center">
            {showAd && <InterstitialAd onComplete={handleAdComplete} />}

            <h2 className="text-3xl font-bold text-love-600 mb-8 font-handwriting">Love Calculator</h2>

            <div className="space-y-6">
                <div>
                    <input
                        type="text"
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                        placeholder="Your Name"
                        className="w-full text-center px-4 py-3 rounded-xl border border-love-200 focus:ring-2 focus:ring-love-500 outline-none text-lg"
                    />
                </div>
                <div className="text-2xl text-love-400 font-bold">+</div>
                <div>
                    <input
                        type="text"
                        value={name2}
                        onChange={(e) => setName2(e.target.value)}
                        placeholder="Crush's Name"
                        className="w-full text-center px-4 py-3 rounded-xl border border-love-200 focus:ring-2 focus:ring-love-500 outline-none text-lg"
                    />
                </div>

                <button
                    onClick={calculateLove}
                    disabled={calculating || !name1 || !name2}
                    className="w-full py-4 bg-love-500 text-white rounded-xl font-bold hover:bg-love-600 disabled:opacity-50 transition-all shadow-lg"
                >
                    {calculating ? 'Consulting the stars...' : 'Calculate Love %'}
                </button>
            </div>

            <AnimatePresence>
                {result !== null && !showAd && (
                    <MotionDiv
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-8"
                    >
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-love-600 to-purple-600">
                            {result}%
                        </div>
                        <p className="text-xl text-gray-600 mt-2 font-medium">
                            {result > 85 ? "It's destiny! 💍" : result > 60 ? "Looking good! 💖" : "Friendzone warning? 😬"}
                        </p>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
}

// Simple Flappy Bird clone
function FlappyHeart() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showAd, setShowAd] = useState(false);

    useEffect(() => {
        if (!isPlaying) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        const gravity = 0.5;
        const jump = -8;
        const pipeSpeed = 3;
        const pipeGap = 150;

        let birdY = canvas.height / 2;
        let velocity = 0;
        let pipes: { x: number, topHeight: number }[] = [];
        let frameCount = 0;
        let currentScore = 0;

        const birdSize = 30;

        const handleJump = () => {
            velocity = jump;
        };

        // Touch/Click to jump
        const handleClick = () => handleJump();
        canvas.addEventListener('mousedown', handleClick);
        canvas.addEventListener('touchstart', handleClick);

        const checkCollision = (pipe: { x: number, topHeight: number }) => {
            // Pipe collision
            if (
                (50 + birdSize > pipe.x && 50 < pipe.x + 50) &&
                (birdY < pipe.topHeight || birdY + birdSize > pipe.topHeight + pipeGap)
            ) {
                return true;
            }
            return false;
        };

        const drawHeart = (x: number, y: number, size: number) => {
            if (!ctx) return;
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.moveTo(x, y + size / 4);
            ctx.quadraticCurveTo(x, y, x + size / 4, y);
            ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
            ctx.quadraticCurveTo(x + size / 2, y, x + size * 3 / 4, y);
            ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4);
            ctx.quadraticCurveTo(x + size, y + size / 2, x + size / 2, y + size);
            ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
            ctx.fill();
        }

        const loop = () => {
            // Physics
            velocity += gravity;
            birdY += velocity;

            // Generate pipes
            if (frameCount % 100 === 0) {
                const minHeight = 50;
                const maxHeight = canvas.height - pipeGap - minHeight;
                const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
                pipes.push({ x: canvas.width, topHeight });
            }

            // Move pipes
            pipes.forEach(pipe => {
                pipe.x -= pipeSpeed;
            });

            // Remove off-screen pipes
            if (pipes.length > 0 && pipes[0].x < -50) {
                pipes.shift();
                currentScore++;
                setScore(currentScore);
            }

            // Check collisions
            // Floor/Ceiling
            if (birdY > canvas.height - birdSize || birdY < 0) {
                endGame();
                return;
            }
            // Pipes
            for (const pipe of pipes) {
                if (checkCollision(pipe)) {
                    endGame();
                    return;
                }
            }

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = '#fff1f2';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Bird (Heart)
            drawHeart(50, birdY, birdSize);

            // Pipes
            ctx.fillStyle = '#be123c';
            pipes.forEach(pipe => {
                ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
                ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, 50, canvas.height - (pipe.topHeight + pipeGap));
            });

            frameCount++;
            frameId = requestAnimationFrame(loop);
        };

        const endGame = () => {
            setIsPlaying(false);
            // Trigger Ad before showing game over screen
            setShowAd(true);
            if (currentScore > highScore) setHighScore(currentScore);
        };

        loop();

        return () => {
            cancelAnimationFrame(frameId);
            canvas.removeEventListener('mousedown', handleClick);
            canvas.removeEventListener('touchstart', handleClick);
        };
    }, [isPlaying, highScore]);

    const handleAdComplete = () => {
        setShowAd(false);
        setGameOver(true);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-3xl shadow-xl border border-love-100 text-center">
            {showAd && <InterstitialAd onComplete={handleAdComplete} />}

            <div className="flex justify-between items-center mb-4 px-4">
                <div className="text-xl font-bold text-gray-700">Score: {score}</div>
                <div className="text-xl font-bold text-love-600">Best: {highScore}</div>
            </div>
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="w-full bg-love-50 rounded-xl cursor-pointer border-4 border-love-200"
                />
                {(!isPlaying && !gameOver && !showAd) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                        <button
                            onClick={() => { setIsPlaying(true); setScore(0); setGameOver(false); }}
                            className="px-8 py-4 bg-love-500 text-white rounded-full font-bold text-xl hover:bg-love-600 shadow-xl transition-transform transform hover:scale-105"
                        >
                            Start Game
                        </button>
                    </div>
                )}
                {gameOver && !showAd && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl animate-bounce-in">
                            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">Game Over!</h3>
                            <p className="text-lg text-gray-600 mb-6">Score: {score}</p>
                            <button
                                onClick={() => { setIsPlaying(true); setScore(0); setGameOver(false); }}
                                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-love-500 text-white rounded-xl font-bold hover:bg-love-600 transition-colors"
                            >
                                <RotateCcw className="w-5 h-5" /> Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <p className="mt-4 text-gray-500 text-sm">Tap or Click to fly!</p>
        </div>
    )
}

function FlamesGame() {
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [calculating, setCalculating] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [tempResult, setTempResult] = useState<string | null>(null);

    const calculateFlames = () => {
        if (!name1 || !name2) return;
        setCalculating(true);
        setResult(null);

        setTimeout(() => {
            const n1 = name1.toLowerCase().replace(/\s/g, '').split('');
            const n2 = name2.toLowerCase().replace(/\s/g, '').split('');

            n1.forEach((char) => {
                const index = n2.indexOf(char);
                if (index !== -1) {
                    n2.splice(index, 1);
                    const index1 = n1.indexOf(char);
                    if (index1 !== -1) delete n1[index1];
                }
            });

            const remainingCount = n1.filter(c => c).length + n2.length;
            const flames = ['Friends', 'Lovers', 'Affection', 'Marriage', 'Enemy', 'Sibling'];

            let index = 0;
            while (flames.length > 1) {
                index = (index + remainingCount - 1) % flames.length;
                flames.splice(index, 1);
            }

            setTempResult(flames[0]);
            setShowAd(true);
            setCalculating(false);
        }, 1500);
    };

    const handleAdComplete = () => {
        setShowAd(false);
        setResult(tempResult);

        if (['Lovers', 'Marriage', 'Affection'].includes(tempResult || '')) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#f43f5e', '#ec4899', '#e11d48']
            });
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-orange-100 text-center">
            {showAd && <InterstitialAd onComplete={handleAdComplete} />}

            <h2 className="text-3xl font-bold text-orange-500 mb-8 font-handwriting">FLAMES</h2>

            <div className="space-y-6">
                <div>
                    <input
                        type="text"
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                        placeholder="Your Name"
                        className="w-full text-center px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none text-lg"
                    />
                </div>
                <div className="text-2xl text-orange-300 font-bold">VS</div>
                <div>
                    <input
                        type="text"
                        value={name2}
                        onChange={(e) => setName2(e.target.value)}
                        placeholder="Crush's Name"
                        className="w-full text-center px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none text-lg"
                    />
                </div>

                <button
                    onClick={calculateFlames}
                    disabled={calculating || !name1 || !name2}
                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg"
                >
                    {calculating ? 'Analyzing destiny...' : 'Check Relationship'}
                </button>
            </div>

            <AnimatePresence>
                {result && !showAd && (
                    <MotionDiv
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-8"
                    >
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-2">
                            {result}
                        </div>
                        <p className="text-gray-600">
                            {result === 'Marriage' ? "Start planning the wedding! 💍" :
                                result === 'Lovers' ? "It's getting hot in here! ❤️" :
                                    result === 'Enemy' ? "Uh oh... ⚔️" :
                                        result === 'Sibling' ? "Rakhi is coming soon! 🧵" :
                                            "Friends are forever! 🤝"}
                        </p>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
}

function FuturePredictor() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<string | null>(null);
    const [predicting, setPredicting] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [tempAnswer, setTempAnswer] = useState<string | null>(null);

    const predictions = [
        "Yes, definitely! (Unless they're hungry)",
        "The stars say EXACTLY what you want to hear.",
        "Only if you buy them food first.",
        "Future unclear, try asking after a date.",
        "Yes, but you have to do the dishes.",
        "No, but they still love you.",
        "Ask again when mercury is not in retrograde.",
        "100% Yes! (Terms and conditions apply)",
        "Marriage is in the cards! (Uno cards, maybe)",
        "Maybe. Have you tried sending a meme?"
    ];

    const predict = () => {
        if (!question) return;
        setPredicting(true);
        setAnswer(null);

        setTimeout(() => {
            const random = Math.floor(Math.random() * predictions.length);
            setTempAnswer(predictions[random]);
            setShowAd(true);
            setPredicting(false);
        }, 1500);
    };

    const handleAdComplete = () => {
        setShowAd(false);
        setAnswer(tempAnswer);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-blue-100 text-center">
            {showAd && <InterstitialAd onComplete={handleAdComplete} />}

            <h2 className="text-3xl font-bold text-blue-500 mb-8 font-handwriting">Oracle of Love</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Ask a Yes/No Question</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Will we get married?"
                        className="w-full text-center px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                    />
                </div>

                <button
                    onClick={predict}
                    disabled={predicting || !question}
                    className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg"
                >
                    {predicting ? 'Consulting the spirits...' : 'Ask the Future'}
                </button>
            </div>

            <AnimatePresence>
                {answer && !showAd && (
                    <MotionDiv
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100"
                    >
                        <p className="text-xl font-medium text-blue-800">
                            "{answer}"
                        </p>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
}
