import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ComponentType } from 'react';

type MotionComponentProps = Record<string, unknown>;
const MotionDiv = motion.div as ComponentType<MotionComponentProps>;

export function BackgroundEffect() {
    const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; size: number }[]>([]);

    useEffect(() => {
        // Generate static hearts on mount to avoid hydration mismatch if SSR (though this is SPA)
        // and to have them ready.
        const newHearts = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            delay: Math.random() * 20,
            size: Math.random() * 20 + 10, // 10px to 30px
        }));
        setHearts(newHearts);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            {/* Clean Background - no blur, just hearts */}
            <div className="absolute inset-0 bg-transparent" />

            {/* Floating Hearts */}
            {hearts.map((heart) => (
                <MotionDiv
                    key={heart.id}
                    className="absolute bottom-0 text-love-200/40"
                    style={{
                        left: `${heart.x}%`,
                        fontSize: `${heart.size}px`
                    }}
                    animate={{
                        y: [0, -1000],
                        opacity: [0, 1, 0],
                        rotate: [0, 45, -45, 0]
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: heart.delay,
                        ease: "linear"
                    }}
                >
                    ♥
                </MotionDiv>
            ))}
        </div>
    );
}
