'use client';

import Image from 'next/image';

export default function Messages() {
  return (
    <div className='divide-y h-full'>
      <div className='h-2/3 mx-2'>
        <div className='chat chat-start'>
          <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
              <Image
                src='/avatar1.png'
                alt='Avatar'
                width={40}
                height={40}
                className='w-12 h-12 rounded-full mr-4'
              />
            </div>
          </div>
          <div className='chat-bubble'>
            It was said that you would, destroy the Sith, not join them.
          </div>
        </div>
        <div className='chat chat-start'>
          <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
              <Image
                src='/avatar1.png'
                alt='Avatar'
                width={40}
                height={40}
                className='w-12 h-12 rounded-full mr-4'
              />
            </div>
          </div>
          <div className='chat-bubble'>It was you who would bring balance to the Force</div>
        </div>
        <div className='chat chat-start'>
          <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
              <Image
                src='/avatar1.png'
                alt='Avatar'
                width={40}
                height={40}
                className='w-12 h-12 rounded-full mr-4'
              />
            </div>
          </div>
          <div className='chat-bubble'>Not leave it in Darkness</div>
        </div>
        <div className='chat chat-end'>
          <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
              <Image
                src='/avatar1.png'
                alt='Avatar'
                width={40}
                height={40}
                className='w-12 h-12 rounded-full mr-4'
              />
            </div>
          </div>
          <div className='chat-bubble'>You underestimate my power!</div>
        </div>
      </div>
      <div className='h-1/3'>
        <textarea placeholder='Bio' className='textarea h-full w-full'></textarea>
      </div>
    </div>
  );
}
