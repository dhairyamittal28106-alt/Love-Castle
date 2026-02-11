
import { useEffect } from 'react';

interface GoogleAdSenseProps {
    className?: string;
    style?: React.CSSProperties;
    client?: string; // ca-pub-XXXXXXXXXXXXXXXX
    slot?: string;   // XXXXXXXXXX
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: boolean;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export function GoogleAdSense({
    className = "",
    style = { display: 'block' },
    client = "ca-pub-XXXXXXXXXXXXXXXX", // Default placeholder
    slot = "XXXXXXXXXX",
    format = "auto",
    responsive = true
}: GoogleAdSenseProps) {

    useEffect(() => {
        try {
            if (import.meta.env.MODE === 'production') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    if (import.meta.env.MODE !== 'production') {
        return (
            <div className={`p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm ${className}`} style={style}>
                <p>Google AdSense Placeholder</p>
                <p className="text-xs mt-1">Ads will appear here in production</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <ins className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}>
            </ins>
        </div>
    );
}
