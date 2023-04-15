'use client';

import { Client, Conversation } from '@xmtp/xmtp-js';
import Image from 'next/image';
import MemberList from './MemberList';
import Messages from './Messages';

interface GroupDetailProps {
  readerClient?: Client;
  convo?: Conversation;
  chatId?: string;
}

export default function GroupDetail({ readerClient, chatId }: GroupDetailProps) {
  return (
    <div className='divide-y flex flex-col h-full'>
      <div className='p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <h2 className='text-lg font-bold mr-2'>Group Name</h2>
          <h2 className='text-lg font-bold'>(42)</h2>
        </div>
        <div className='flex items-center'>
          <Image alt='Add Member' src='/user-plus.svg' width={24} height={24} className='mr-4' />
          <Image alt='More' src='/dots.svg' width={24} height={24} />
        </div>
      </div>
      <div className='flex-grow'>
        <div className='flex h-full divide-x'>
          <div className='w-3/4'>
            <Messages readerClient={readerClient} />
          </div>
          <div className='p-1 w-1/4'>
            <MemberList chatId={chatId}/>
          </div>
        </div>
      </div>
    </div>
  );
}
