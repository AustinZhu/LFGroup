'use client';

import { usePushConnect } from '@/hooks/usePush';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSigner } from 'wagmi';

const queryClient = new QueryClient();

const Home = () => {
  const { data: signer } = useSigner();
  const router = useRouter();
  const { connect: connectPush } = usePushConnect();

  useEffect(() => {
    (async () => {
      if (signer) {
        await connectPush(signer);
        router.push('/chat');
      }
    })();
  }, [connectPush, router, signer]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='text-4xl font-bold mt-1'>Welcome to</h1>
        <h1 className='text-4xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-green-500 to-green-300 mb-5'>
          LFGroup
        </h1>
        <ConnectButton />
      </div>
    </QueryClientProvider>
  );
};

export default Home;
