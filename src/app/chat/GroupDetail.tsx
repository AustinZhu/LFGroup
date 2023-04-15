'use client';

import { Client, Conversation } from '@xmtp/xmtp-js';
import { IdenticonImg } from '@/components';
import Image from 'next/image';
import MemberList from './MemberList';
import Messages from './Messages';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface GroupDetailProps {
  readerClient?: Client;
  convo?: Conversation;
  chatId?: string;
}

export default function GroupDetail({ readerClient, chatId }: GroupDetailProps) {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const { address } = useAccount();
  const handleUserInfoClick = () => {
    setShowUserInfo(!showUserInfo);
  };
  if (!address) {
    return null;
  }
  return (
    <div className='divide-y flex flex-col h-full'>
      <input type='checkbox' id='my-modal-3' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label htmlFor='my-modal-3' className='btn btn-sm btn-circle absolute right-2 top-2'>
            ✕
          </label>
          <h3 className='text-lg font-bold'>Add Member</h3>
          <input type='text' placeholder='Wallet Address' className='input w-full max-w-xs mt-2' />
          <button className='btn ml-4'>Button</button>
        </div>
      </div>
      <input type='checkbox' id='modal-4' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label htmlFor='modal-4' className='btn btn-sm btn-circle absolute right-2 top-2'>
            ✕
          </label>
          <h3 className='text-lg font-bold'>Leave Group</h3>
          <p className='mb-2'>Are you sure you want to leave this group?</p>
          <div className='flex justify-end'>
            <button className='btn btn-active btn-ghost'>Cancel</button>
            <button className='ml-2 btn btn-active btn-secondary'>Leave</button>
          </div>
        </div>
      </div>
      <div className='p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <h2 className='text-lg font-bold mr-2'>Group Name</h2>
          <h2 className='text-lg font-bold'>(42)</h2>
        </div>
        <div className='flex items-center'>
          <label htmlFor='my-modal-3'>
            <Image alt='Add Member' src='/user-plus.svg' width={24} height={24} className='mr-4' />
          </label>
          <Image
            onClick={() => handleUserInfoClick()}
            alt='More'
            src='/dots.svg'
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className='flex-grow flex flex-col justify-between'>
        <div className='flex h-full divide-x'>
          <div className='w-3/4'>
            <Messages readerClient={readerClient} />
          </div>
          <div className='p-1 w-1/4'>
            <MemberList chatId={chatId} />
          </div>
        </div>
        <div
          className={`w-1/4 ${showUserInfo
            ? 'fixed z-10 top-0 right-0 h-screen bg-white p-4 shadow-lg flex-grow'
            : 'hidden'
            }`}
        >
          <div className='flex flex-col items-center justify-center ml-4 mt-auto flex-grow'>
            <button
              className='btn btn-sm btn-circle absolute top-2 right-2'
              onClick={() => handleUserInfoClick()}
            >
              ✕
            </button>
            <IdenticonImg
              username={address}
              width={50}
              height={50}
              className='my-4 rounded-full border-[#0BA360] border-2'
              alt={address}
            />
            <p className='text-sm'>{address}</p>
            <div className='mb-4'>
              <h2 className='text-lg mt-2'>Group Name</h2>
              <input
                type='text'
                placeholder='Group Name'
                className='input input-bordered w-full max-w-xs'
              />
              <p className='text-lg mt-2'>Username</p>
              <input
                type='text'
                placeholder='User Name'
                className='input input-bordered w-full max-w-xs'
              />
            </div>
            <button className='btn btn-error btn-wide absolute bottom-0 mb-4'>
              <label htmlFor='modal-4'>Leave Group</label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
