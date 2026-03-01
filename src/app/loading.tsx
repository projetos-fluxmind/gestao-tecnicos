import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-brand-cyan/20 blur-3xl rounded-full animate-pulse" />

                {/* Spinner */}
                <div className="relative flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-white/5 border-t-brand-cyan rounded-full animate-spin shadow-[0_0_20px_#06d0f933]" />

                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-black tracking-[0.3em] neon-text-cyan animate-pulse">
                            SGT <span className="font-light text-foreground/30">PRO</span>
                        </h2>
                        <div className="h-1 w-24 bg-white/5 mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-cyan animate-loading-progress" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
