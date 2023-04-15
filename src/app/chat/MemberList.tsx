'use client';

import Image from 'next/image';
import { IdenticonImg } from '@/components';
import { usePKPGetPermissions } from '@/hooks/useLit';
import { truncateEthAddress } from '@/utils/ethereum';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const mockMembers = [
  '0x0000002000002000002000002000002000002000',
  '0x0000002000002000002000002000002000002001',
];

interface MemberListProps {
  chatId?: string;
}

const MemberList = ({ chatId }: MemberListProps) => {
  const [members, setMembers] = useState<string[]>(mockMembers);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(-1);
  const { address } = useAccount();
  const { getPermissions } = usePKPGetPermissions();

  useEffect(() => {
    if (!chatId) return;
    const getMembers = async () => {
      const members = await getPermissions(chatId);
      if (!members) return;
      setIsAdmin(members[0] === address);
      setMembers(members);
    };
    getMembers();
  }, [address, chatId, getPermissions]);

  const handleShowCard = (id: number) => {
    setShowCard(!showCard);
    setCurrentUserId(id);
  };
  return (
    <div className='px-2 relative'>
      <h3 className='text-lg font-bold text-gray-700'>Members</h3>
      <input type='checkbox' id='modal-5' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label htmlFor='modal-5' className='btn btn-sm btn-circle absolute right-2 top-2'>
            ✕
          </label>
          <h3 className='text-lg font-bold'>Remove member</h3>
          <p className='mb-2'>Are you sure you want to remove this member?</p>
          <div className='flex justify-end'>
            <button className='btn btn-active btn-ghost'>Cancel</button>
            <button className='btn btn-active btn-secondary ml-2 '>Remove</button>
          </div>
        </div>
      </div>
      {members.map((member, index) => (
        <div key={member} className='relative group'>
          <div className='flex items-center mb-4 px-2 py-2 rounded-lg hover:bg-gray-200'>
            <div className='w-10 rounded-full'>
              <IdenticonImg
                username={member}
                width={50}
                height={50}
                className='rounded-full mr-4'
              />
            </div>
            <p className='text-gray-700 ml-1'>{truncateEthAddress(member)}</p>
            <div className='hidden group-hover:flex ml-auto'>
              <button
                className='bg-gray-200 p-2 hover:bg-gray-300'
                onClick={() => handleShowCard(index)}
              >
                <Image alt='More' src='/dots.svg' width={10} height={10} />
              </button>
            </div>
          </div>
          {showCard && currentUserId !== null && currentUserId === index && (
            <div className='absolute right-0 mt-2 p-2 bg-white border shadow-md z-10'>
              <div className='flex items-center mb-4'>
                <div className='flex flex-col items-center'>
                  <div className='flex items-center'>
                    <IdenticonImg
                      username={member}
                      width={50}
                      height={50}
                      className='rounded-full mr-2'
                    />
                    <p className='text-gray-700 font-medium ml-5'>{truncateEthAddress(member)}</p>
                  </div>
                  <div className='my-2 border-b w-full'></div>
                  <p className='text-gray-700 items-center'>0x00000000000000000</p>
                  <button className='btn btn-error btn-wide'>
                    <label htmlFor='modal-5'>Remove</label>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <style jsx>{`
        .group:hover .absolute {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default MemberList;
