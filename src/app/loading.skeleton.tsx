import React from 'react';

export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <div className="h-10 w-64 bg-white/5 rounded-xl" />
                    <div className="h-4 w-48 bg-white/5 rounded-lg" />
                </div>
                <div className="flex gap-4">
                    <div className="h-10 w-32 bg-white/5 rounded-xl" />
                    <div className="h-10 w-40 bg-white/5 rounded-xl" />
                </div>
            </header>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass p-6 rounded-2xl h-32 border border-white/5 bg-white/2" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass rounded-3xl h-[400px] border border-white/5" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass h-24 rounded-3xl border border-white/5" />
                        <div className="glass h-24 rounded-3xl border border-white/5" />
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="glass h-80 rounded-3xl border border-white/5" />
                    <div className="glass h-40 rounded-3xl border border-white/5" />
                </div>
            </div>
        </div>
    );
}
