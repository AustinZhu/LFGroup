'use client';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import GroupList from './groupList';

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected &&
        <div className='flex h-screen'>
          <div className='w-[100px] bg-green-100 bg-opacity-25 flex flex-col justify-center items-center'>
            <Image alt='avatar' src='/avatar.png' width={50} height={50} className='mb-2 mt-2' />
            <Image alt='chat' src='/chat.png' width={50} height={50} className='mb-auto' />
            <Image alt='logout' src='/logout.png' width={30} height={30} className='mt-auto mb-4' />
          </div>
          <div className='w-1/4 bg-white'><GroupList /></div>
          <div className='flex-grow bg-gray-200'>test2</div>
        </div>
      }
    </>
  );
}
