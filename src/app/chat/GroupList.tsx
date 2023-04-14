'use client';

import Image from 'next/image';
import { useState } from 'react';

const data = [
  'will you go lunch with us ',
  'will you go lunch with us ',
  'will you go lunch with us ',
];

export default function GroupList() {
  const [clicked, setClicked] = useState<number>();

  function handleClick(index: number) {
    setClicked(index);
  }
  return (
    <>
      <div className='p-4 flex justify-between items-center'>
        <h2 className='text-lg font-bold'>Group List</h2>
        <div className='dropdown'>
          <label tabIndex={0} className='btn bg-gray-200 border-0 hover:bg-gray-400'>
            <Image alt='Add' src='/plus.svg' width={24} height={24} className='' />
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
          <div key={index} className='group' onClick={() => handleClick(index)}>
            <div
              className={`flex items-center p-4 group-hover:bg-[#0BA360] ${
                index === clicked ? 'bg-[#0BA360]' : ''
              }`}
            >
              <Image alt='avatar' src='/avatar1.png' width={40} height={40} className='mr-4' />
              <div className='flex flex-col w-full'>
                <div className='flex items-center'>
                  <p
                    className={`font-bold group-hover:text-white ${
                      index === clicked ? 'text-white' : ''
                    }`}
                  >
                    Group 1
                  </p>
                  <span
                    className={`ml-auto group-hover:opacity-50 group-hover:text-gray-100 text-sm ${
                      index === clicked ? 'text-gray-100 opacity-50' : 'text-gray-300'
                    }`}
                  >
                    10:30 AM
                  </span>
                </div>
                <p
                  className={`group-hover:opacity-75 group-hover:text-gray-200 ${
                    index === clicked ? 'opacity-75 text-gray-200' : 'text-gray-500'
                  }`}
                >
                  {item}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
