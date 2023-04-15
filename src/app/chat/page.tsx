'use client';

import { IdenticonImg } from '@/components';
import { useLitDisconnect } from '@/hooks/useLit';
import * as PushAPI from '@pushprotocol/restapi';
import Image from 'next/image';
import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import GroupDetail from './GroupDetail';
import GroupList from './GroupList';

const ChatPage = () => {
  const { address } = useAccount();
  const { disconnectAsync: disconnectWallet } = useDisconnect();
  const { disconnect: disconnectLit } = useLitDisconnect();

  const [currentGroup, setCurrentGroup] = useState<PushAPI.GroupDTO>();

  if (!address) {
    return null;
  }

  const handleLogout = async () => {
    await disconnectLit();
    await disconnectWallet();
  };

  return (
    <div className='flex h-screen divide-x'>
      <div className='w-[100px] bg-green-100 bg-opacity-25 flex flex-col justify-center items-center'>
        <IdenticonImg
          username={address}
          width={50}
          height={50}
          className='my-4 rounded-full border-[#0BA360] border-2'
          alt={address}
        />
        <Image alt='chat' src='/message-circle.svg' width={32} height={32} className='mb-auto' />
        <a href='/' onClick={handleLogout}>
          <Image alt='logout' src='/logout.svg' width={32} height={32} className='mt-auto mb-4' />
        </a>
      </div>
      <div className='w-1/4 bg-white'>
        <GroupList setGroup={setCurrentGroup}/>
      </div>
      <div className='flex-grow bg-white'>
        <GroupDetail currentGroup={currentGroup} setGroup={setCurrentGroup} />
      </div>
    </div>
  );
};

export default ChatPage;
