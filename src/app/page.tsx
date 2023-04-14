'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useRouter } from 'next/navigation';
import { useSigner } from 'wagmi';

const Home = () => {
  const { data: signer } = useSigner();
  const router = useRouter();

  if (signer) {
    router.push('/chat');
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h1 className='text-4xl font-bold mt-1'>Welcome to</h1>
      <h1 className='text-4xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-green-500 to-green-300 mb-5'>
        LFGroup
      </h1>
      <ConnectButton />
    </div>
  );
};

export default Home;
