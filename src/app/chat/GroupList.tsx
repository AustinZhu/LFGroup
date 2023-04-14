'use client';

import Image from 'next/image';
import { useState } from 'react';

const data = [
  'message 1: jwiejifjsajdklfsaldfljsakldjflksjfljlk',
  'message 2 jwiejifjsajdklfsaldfljsakldjflksjfljlk',
  'message 3 jwiejifjsajdklfsaldfljsakldjflksjfljlk',
];

export default function GroupList() {
  const [clicked, setClicked] = useState<number>();

  function handleClick(index: number) {
    setClicked(index);
  }
  return (
    <>
      <div className='bg-gray-100 p-4 flex justify-between items-center'>
        <h2 className='text-lg font-bold'>Group List</h2>
        <div className='dropdown'>
          <label tabIndex={0} className='btn m-1'>
            +
          </label>
          <ul
            tabIndex={0}
            className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <button>Create</button>
            </li>
            <li>
              <button>Join</button>
            </li>
          </ul>
        </div>
      </div>
      <div>
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex items-center mb-4 ${index === clicked ? 'bg-green-100' : ''}`}
            onClick={() => handleClick(index)}
          >
            <Image alt='avatar' src='/avatar1.png' width={40} height={40} className='mr-4' />
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <p className='font-bold'>Group 1</p>
                <span className='ml-auto text-gray-400 text-sm'>10:30 AM</span>
              </div>
              <p>{item}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
