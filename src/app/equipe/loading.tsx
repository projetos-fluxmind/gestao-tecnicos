import React from 'react';

export default function EquipeLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <div className="h-10 w-64 bg-white/5 rounded-xl" />
                    <div className="h-4 w-48 bg-white/5 rounded-lg" />
                </div>
                <div className="h-12 w-48 bg-white/5 rounded-xl" />
            </header>

            {/* Control Hub Skeleton */}
            <div className="glass p-6 rounded-3xl flex flex-col md:flex-row gap-6 border border-white/5">
                <div className="flex-1 h-14 bg-white/5 rounded-2xl" />
                <div className="w-48 h-14 bg-white/5 rounded-2xl" />
                <div className="w-32 h-14 bg-white/5 rounded-2xl" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass rounded-[2rem] p-8 flex flex-col sm:flex-row gap-8 border border-white/5">
                        <div className="w-28 h-28 rounded-3xl bg-white/5 flex-shrink-0" />
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <div className="h-8 w-48 bg-white/5 rounded-lg" />
                                <div className="h-4 w-32 bg-white/5 rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-14 bg-white/5 rounded-2xl" />
                                <div className="h-14 bg-white/5 rounded-2xl" />
                            </div>
                            <div className="flex justify-between pt-2">
                                <div className="flex gap-2">
                                    <div className="w-11 h-11 bg-white/5 rounded-xl" />
                                    <div className="w-11 h-11 bg-white/5 rounded-xl" />
                                </div>
                                <div className="w-32 h-11 bg-white/5 rounded-xl" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
