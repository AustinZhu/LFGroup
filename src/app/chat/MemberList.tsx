'use client';

import Image from 'next/image';

const members = [
  {
    name: 'Alice',
    avatarSrc: '/avatar1.png',
  },
  {
    name: 'Bob',
    avatarSrc: '/avatar1.png',
  },
  {
    name: 'Charlie',
    avatarSrc: '/avatar1.png',
  },
];

export default function MemberList() {
  return (
    <div className='px-2'>
      <h3 className='text-lg font-bold text-gray-700'>Members</h3>
      <div>
        {members.map((member) => (
          <div key={member.name} className='flex items-center mb-4'>
            <div className='w-10 rounded-full'>
              <Image
                src={member.avatarSrc}
                alt='Avatar'
                width={50}
                height={50}
                className='rounded-full mr-4'
              />
            </div>
            <p className='text-gray-700 ml-1'>{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
