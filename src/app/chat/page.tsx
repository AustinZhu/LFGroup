'use client';
import { IdenticonImg } from '@/components';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import GroupDetail from './GroupDetail';
import GroupList from './GroupList';

const ChatPage = () => {
  const { address } = useAccount();

  if (!address) {
    return null;
  }

  return (
    <div className='flex h-screen divide-x'>
      <div className='w-[100px] bg-green-100 bg-opacity-25 flex flex-col justify-center items-center'>
        <IdenticonImg username={address} width={50} height={50} className='my-4 rounded-full border-[#0BA360] border-2' alt={address} />
        <Image alt='chat' src='/message-circle.svg' width={32} height={32} className='mb-auto' />
        <Image alt='logout' src='/logout.svg' width={32} height={32} className='mt-auto mb-4' />
      </div>
      <div className='w-1/4 bg-white'>
        <GroupList />
      </div>
      <div className='flex-grow bg-white'>
        <GroupDetail />
      </div>
    </div>
  );
};

export default ChatPage;
