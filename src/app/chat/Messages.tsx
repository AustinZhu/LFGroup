'use client';

import { IdenticonImg } from '@/components';
import { truncateEthAddress } from '@/utils/ethereum';
import { Client, DecodedMessage } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';

interface MessagesProps {
  readerClient?: Client;
}

export default function Messages({ readerClient }: MessagesProps) {
  const [messages, setMessages] = useState<DecodedMessage[]>([
    {
      id: '12321',
      senderAddress: '0x0000000000000000000000000000000000000000',
      content: 'Hello World',
      sent: new Date(),
    } as DecodedMessage,
  ]);

  useEffect(() => {
    if (!readerClient) return;

    const streamMessages = async () => {
      const newStream = await readerClient.conversations.streamAllMessages();
      for await (const msg of newStream) {
        setMessages((prevMessages) => {
          const messages = [...prevMessages];
          messages.push(msg);
          return messages;
        });
      }
    };
    streamMessages();
  }, [readerClient?.conversations]);

  return (
    <div className='divide-y h-full'>
      <div className='h-2/3 m-4'>
        {messages.map((msg) => (
          <div className='chat chat-start'>
            <div className='chat-image avatar'>
              <div className='w-10 rounded-full'>
                <IdenticonImg username={msg.senderAddress} width={40} height={40} />
              </div>
            </div>
            <div className='chat-header inline-flex gap-2 p-1'>
              <p>{truncateEthAddress(msg.senderAddress)}</p>
              <time className='text-xs opacity-50'>{msg.sent.toLocaleTimeString()}</time>
            </div>
            <div className='chat-bubble'>{msg.content}</div>
          </div>
        ))}
      </div>
      <div className='h-1/3'>
        <textarea placeholder='Bio' className='textarea h-full w-full'></textarea>
      </div>
    </div>
  );
}
