import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';

export const iconVariants = cva('', {
    variants: {
        size: {
            '16': 'w-4 h-4',
            '24': 'w-6 h-6',
            '32': 'w-8 h-8',
            '40': 'w-10 h-10',
            '48': 'w-12 h-12',
            '80': 'w-20 h-20',
            '128': 'w-32 h-32',
            '160': 'w-40 h-40',
            '180': 'w-56 h-56',
            '200': 'w-72 h-72',
        },
    },
    defaultVariants: {
        size: '16',
    },
});

interface SvgProps extends React.SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> { }

export type IconType = SvgProps;



import { cn } from "@/lib/utils";


export const FoodIcon: React.FC<IconType> = ({ size, className, ...props }) => {
    return (
        <svg
            {...props}
            className={cn(iconVariants({ size, className }))}
            width="36"
            height="44"
            viewBox="0 0 36 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props} // allows passing className, style, onClick, etc.
        >
            <path
                d="M4 12L7.52041 32.8097C8.13232 36.4268 8.43827 38.2353 9.52013 39.4834C12.4288 42.8389 23.5712 42.8389 26.4799 39.4834C27.5617 38.2353 27.8677 36.4268 28.4796 32.8097L32 12"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
            />
            <path
                d="M4 12L5.48556 8.57521C6.70337 5.7677 7.31227 4.36394 8.58202 3.5712C11.761 1.58649 23.8905 1.36887 27.418 3.5712C28.6877 4.36394 29.2966 5.7677 30.5144 8.57521L32 12"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
            />
            <path
                d="M2 12H34"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
            />
            <ellipse
                cx="18"
                cy="27"
                rx="4"
                ry="5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
            />
        </svg>
    )
}
