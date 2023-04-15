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
  const [message, setMessage] = useState('');
  const accountId = '0x0000000000000000000000000000000000000001';
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

  const handleSend = () => {
    if (message.length > 0) {
      setMessages((prevMessages) => {
        const messages = [...prevMessages];
        messages.push({
          id: '12321',
          senderAddress: '0x0000000000000000000000000000000000000001',
          content: message,
          sent: new Date(),
        } as DecodedMessage);
        return messages;
      });
      setMessage('');
    }
  };

  return (
    <div className='divide-y h-full'>
      <div className='h-2/3 m-4'>
        {messages.map((msg, index) =>
          msg.senderAddress !== accountId ? (
            <div key={index} className='chat chat-start'>
              <div className='chat-image avatar'>
                <div className='w-10'>
                  <IdenticonImg username={msg.senderAddress} width={40} height={40} />
                </div>
              </div>
              <div className='chat-header inline-flex gap-2 p-1'>
                <p>{truncateEthAddress(msg.senderAddress)}</p>
                <time className='text-xs opacity-50'>{msg.sent.toLocaleTimeString()}</time>
              </div>
              <div className='chat-bubble'>{msg.content}</div>
            </div>
          ) : (
            <div key={index} className='chat chat-end'>
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
          ),
        )}
      </div>
      <div className='h-1/5 relative p-2'>
        <div className='h-full w-full'>
          <textarea
            placeholder='Type message here'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='textarea h-full w-full'
            style={{ resize: 'none' }}
          ></textarea>
        </div>
        <button onClick={() => handleSend()} className='absolute right-0 mt-2 btn'>
          Send
        </button>
      </div>
    </div>
  );
}
