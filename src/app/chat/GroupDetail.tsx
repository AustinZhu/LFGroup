'use client';

import { IdenticonImg } from '@/components';
import { usePush } from '@/hooks/usePush';
import { useProfile } from '@lens-protocol/react-web';
import * as PushAPI from '@pushprotocol/restapi';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import MemberList from './MemberList';
import Messages from './Messages';

interface GroupDetailProps {
  currentGroup?: PushAPI.GroupDTO;
  setGroup: (group?: PushAPI.GroupDTO) => void;
}

export default function GroupDetail({ currentGroup, setGroup }: GroupDetailProps) {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [newMember, setNewMember] = useState<string>('');
  const { data: profile } = useProfile({ handle: newMember});
  const [, setIsAdmin] = useState(false);

  const { address } = useAccount();
  const { key } = usePush();

  useEffect(() => {
    if (!currentGroup || !address) return;

    setIsAdmin(
      currentGroup.members
        .filter((member) => member.isAdmin)
        .map((member) => member.wallet)
        .includes(address) || currentGroup.groupCreator === address,
    );
  }, [address, currentGroup]);

  const handleUserInfoClick = () => {
    setShowUserInfo(!showUserInfo);
  };
  if (!address) {
    return null;
  }

  const handleAddMember = async () => {
    if (!currentGroup) {
      return;
    }

    let newMem = newMember;
    if (profile) {
      newMem = profile.ownedBy;
    }
    const currentMembers = currentGroup.members.map((member) => member.wallet);
    const currentAdmins = currentGroup.members
      .filter((member) => member.isAdmin)
      .map((member) => member.wallet);
    const response = await PushAPI.chat.updateGroup({
      chatId: currentGroup.chatId,
      groupName: currentGroup.groupName,
      groupDescription: currentGroup.groupDescription || '',
      members: [...currentMembers, newMem],
      groupImage: currentGroup.groupImage || '',
      admins: [...currentAdmins],
      account: address,
      pgpPrivateKey: key,
    });

    setGroup(response)
  };

  return (
    <div className='divide-y flex flex-col h-full'>
      <input type='checkbox' id='my-modal-3' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label htmlFor='my-modal-3' className='btn btn-sm btn-circle absolute right-2 top-2'>
            ✕
          </label>
          <h3 className='text-lg font-bold'>Add Member</h3>
          <input
            type='text'
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder='Wallet Address'
            className='input w-full max-w-xs mt-2'
          />
          <button className='btn ml-4' onClick={handleAddMember}>
            Add
          </button>
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
          <h2 className='text-lg font-bold mr-2'>{currentGroup?.groupName}</h2>
          <h2 className='text-lg font-bold'>{`(${currentGroup?.members.length})`}</h2>
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
            <Messages group={currentGroup} />
          </div>
          <div className='p-1 w-1/4'>
            <MemberList group={currentGroup} setGroup={setGroup} />
          </div>
        </div>
        <div
          className={`w-1/4 ${
            showUserInfo
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
