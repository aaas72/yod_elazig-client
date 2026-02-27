import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
    children: React.ReactNode,
    variant?: 'primary' | 'secondary',
    icon?: React.ReactNode,
    onClick?: () => void,
    className?: string,
    href?: string,
    // Removing 'as' since we handle polymorphism via href
}

export default function Button({children, variant = 'primary', icon, onClick, className = '', href}: ButtonProps) {
    const baseStyles = "px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base cursor-pointer justify-center shadow";

    const variantStyles: Record<'primary' | 'secondary', string> = {
        primary: "text-red-800 border-2 hover:bg-[#FFC0C0] hover:px-8",
        secondary: "bg-transparent  border-1  "
    };

    // دمج baseStyles + variantStyles + className الخارجي
    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

    const content = (
        <>
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            <span>{children}</span>
        </>
    );

    if (href) {
        // Internal link
        if (href.startsWith('/') || href.startsWith('#')) {
            return (
                <Link to={href} className={combinedStyles} onClick={onClick}>
                    {content}
                </Link>
            );
        }
        // External link
        return (
            <a href={href} className={combinedStyles} onClick={onClick} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={combinedStyles}>
            {content}
        </button>
    );
}
