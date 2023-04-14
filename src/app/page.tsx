'use client';

import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <Image alt='Logo' src='/logo.png' width={200} height={200} />
      <h1 className='text-4xl font-bold mt-1'>Welcome to</h1>
      <h1 className='text-4xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-green-500 to-green-300 mb-5'>
        Lenstalk
      </h1>
      <ConnectButton />
    </div>
  );
}
