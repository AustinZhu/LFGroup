'use client';

import { IdenticonImg } from '@/components';
import { usePush } from '@/hooks/usePush';
import { truncateEthAddress } from '@/utils/ethereum';
import * as PushAPI from '@pushprotocol/restapi';
import { IMessageIPFS } from '@pushprotocol/restapi';
import { Wallet } from 'ethers';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';

interface MessagesProps {
  group?: PushAPI.GroupDTO;
}

export default function Messages({ group }: MessagesProps) {
  const [messages, setMessages] = useState<IMessageIPFS[]>([]);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { key } = usePush();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!group || !address) return;

    const streamMessages = async () => {
      const conversationHash = await PushAPI.chat.conversationHash({
        account: `eip155:${address}`,
        conversationId: group.chatId,
      });
      try {
        const chatHistory = await PushAPI.chat.history({
          threadhash: conversationHash.threadHash,
          account: `eip155:${address}`,
          toDecrypt: true,
          pgpPrivateKey: key,
        });
        setMessages(chatHistory);
      } catch (e) {}
    };

    streamMessages();
  }, [address, group, key]);

  const handleSend = async () => {
    if (!signer || !key || !group) return;

    const response = await PushAPI.chat.send({
      messageContent: message,
      messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
      receiverAddress: group.chatId,
      signer: signer as Wallet,
      pgpPrivateKey: key,
    });

    const newMessages = [...messages, response];
    setMessages(newMessages);
  };

  return (
    <div className='divide-y h-full'>
      <div className='h-2/3 m-4'>
        {messages.map((msg, index) =>
          msg.fromCAIP10 !== `eip155:${address}` ? (
            <div key={index} className='chat chat-start'>
              <div className='chat-image avatar'>
                <div className='w-10'>
                  <IdenticonImg username={msg.fromCAIP10} width={40} height={40} />
                </div>
              </div>
              <div className='chat-header inline-flex gap-2 p-1'>
                <p>{`eip155:${truncateEthAddress(msg.fromCAIP10.replace('eip155:', ''))}`}</p>
                <time className='text-xs opacity-50'>
                  {new Date(msg.timestamp || 0).toLocaleTimeString()}
                </time>
              </div>
              <div className='chat-bubble'>{msg.messageContent}</div>
            </div>
          ) : (
            <div key={index} className='chat chat-end'>
              <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                  <IdenticonImg username={msg.fromCAIP10} width={40} height={40} />
                </div>
              </div>
              <div className='chat-header inline-flex gap-2 p-1'>
                <p>{`eip155:${truncateEthAddress(msg.fromCAIP10.replace('eip155:', ''))}`}</p>
                <time className='text-xs opacity-50'>
                  {new Date(msg.timestamp || 0).toLocaleTimeString()}
                </time>
              </div>
              <div className='chat-bubble'>{msg.messageContent}</div>
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
