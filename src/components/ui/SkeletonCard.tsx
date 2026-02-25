import React from 'react';

interface SkeletonCardProps {
    variant?: 'news' | 'event' | 'default';
    className?: string;
}

export default function SkeletonCard({ variant = 'default', className = '' }: SkeletonCardProps) {
    if (variant === 'news') {
        return (
            <div className={`bg-white rounded-xl overflow-hidden shadow-md ${className}`}>
                <div className="skeleton h-48 w-full rounded-none" />
                <div className="p-6 space-y-3">
                    <div className="skeleton-title" />
                    <div className="skeleton-text w-full" />
                    <div className="skeleton-text w-3/4" />
                    <div className="flex gap-4 mt-4">
                        <div className="skeleton-text w-20" />
                        <div className="skeleton-text w-20" />
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'event') {
        return (
            <div className={`bg-white rounded-xl overflow-hidden shadow-md ${className}`}>
                <div className="skeleton h-48 w-full rounded-none" />
                <div className="p-6 space-y-3">
                    <div className="skeleton-title" />
                    <div className="skeleton-text w-full" />
                    <div className="skeleton-text w-2/3" />
                    <div className="flex items-center gap-2 mt-4">
                        <div className="skeleton w-5 h-5 rounded-full" />
                        <div className="skeleton-text w-32" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl p-6 shadow-md ${className}`}>
            <div className="skeleton-title" />
            <div className="space-y-2 mt-4">
                <div className="skeleton-text w-full" />
                <div className="skeleton-text w-5/6" />
                <div className="skeleton-text w-4/6" />
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 6, variant = 'default' }: { count?: number; variant?: 'news' | 'event' | 'default' }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} variant={variant} />
            ))}
        </div>
    );
}
