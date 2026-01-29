import React from 'react';

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,17,23,1)_0%,_rgba(5,5,10,1)_100%)]" />

            {/* Animated Orbs */}
            <div
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[100px] animate-blob"
                style={{ animationDelay: '0s' }}
            />

            <div
                className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[100px] animate-blob"
                style={{ animationDelay: '2s' }}
            />

            <div
                className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-blue-900/20 blur-[100px] animate-blob"
                style={{ animationDelay: '4s' }}
            />

            {/* Grid Overlay for texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        </div>
    );
}
