'use client';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import GroupDetail from './GroupDetail';
import GroupList from './GroupList';

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected && (
        <div className='flex h-screen divide-x'>
          <div className='w-[100px] bg-green-100 bg-opacity-25 flex flex-col justify-center items-center'>
            <Image alt='avatar' src='/avatar.png' width={50} height={50} className='mb-2 mt-2' />
            <Image alt='chat' src='/message-circle.svg' width={50} height={50} className='mb-auto' />
            <Image alt='logout' src='/logout.svg' width={30} height={30} className='mt-auto mb-4' />
          </div>
          <div className='w-1/4 bg-white'>
            <GroupList />
          </div>
          <div className='flex-grow bg-white'>
            <GroupDetail />
          </div>
        </div>
      )}
    </>
  );
}
