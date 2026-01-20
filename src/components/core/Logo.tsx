// 'use client';
import Image from 'next/image';
import React from 'react';


const Logo = () => {
    return (
        <div className='w-[80px] sm:w-[80px] md:w-[100px]  overflow-hidden'>
            <Image
                className="object-contain w-full h-auto"
                src={'/Logo.png'}
                alt="Logo"
                width={220}
                height={150}
                priority
            />
        </div>
    );
};

export default Logo;
