import React from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

export default function LoadingSpinner({
    size = 'md',
    text = 'جاري التحميل',
    fullScreen = false
}: LoadingSpinnerProps) {
    const sizeValues = {
        sm: { width: 40, height: 20 },
        md: { width: 60, height: 30 },
        lg: { width: 80, height: 40 }
    };

    const { width, height } = sizeValues[size];
    const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;

    const InfinityIcon = () => (
        <svg
            width={width}
            height={height}
            viewBox="0 0 60 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
        >
            <motion.path
                d="M15 15C15 15 15 7 7.5 7C0 7 0 15 0 15C0 15 0 23 7.5 23C15 23 15 15 15 15C15 15 15 7 22.5 7C30 7 30 15 30 15C30 15 30 23 22.5 23C15 23 15 15 15 15Z"
                stroke="#DC2626"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, pathOffset: 0 }}
                animate={{ 
                    pathLength: 1,
                    pathOffset: [0, 1]
                }}
                transition={{
                    pathLength: { duration: 0.8, ease: "easeInOut" },
                    pathOffset: { duration: 1.5, ease: "linear", repeat: Infinity }
                }}
                style={{ transform: 'translateX(15px)' }}
            />
        </svg>
    );

    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <InfinityIcon />
            {text && (
                <motion.p
                    className="text-gray-600 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return ReactDOM.createPortal(
            <motion.div
                className="fixed inset-0 bg-white z-999 flex items-center justify-center"
                style={{ width: '100vw', height: '100vh', top: 0, left: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {content}
            </motion.div>,
            document.body
        );
    }

    return content;
}
