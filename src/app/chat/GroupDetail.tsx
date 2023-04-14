'use client';

import Image from 'next/image';
import Messages from './Messages';
import MemberList from './MemberList';

export default function GroupDetail() {
  return (
    <div className='divide-y flex flex-col h-full'>
      <div className='p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <h2 className='text-lg font-bold mr-2'>Group Name</h2>
          <h2 className='text-lg font-bold'>(42)</h2>
        </div>
        <div className='flex items-center'>
          <Image alt='addMember' src='/addMember.png' width={40} height={40} className='mr-4' />
          <Image alt='ellipsis' src='/ellipsis.png' width={40} height={40} />
        </div>
      </div>
      <div className='flex-grow'>
        <div className='flex h-full divide-x'>
          <div className='w-3/4'>
            <Messages />
          </div>
          <div className='p-1 w-1/4'>
            <MemberList />
          </div>
        </div>
      </div>
    </div>
  );
}
