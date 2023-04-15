'use client';

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
  }, []);

  return (
    <div className='px-2'>
      <h3 className='text-lg font-bold text-gray-700'>Members</h3>
      <div>
        {members.map((member) => (
          <div key={member} className='flex items-center mb-4'>
            <div className='w-10 rounded-full'>
              <IdenticonImg
                username={member}
                width={50}
                height={50}
                className='rounded-full mr-4'
              />
            </div>
            <p className='text-gray-700 ml-1'>{truncateEthAddress(member)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
