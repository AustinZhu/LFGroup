'use client';

import { IdenticonImg } from '@/components';
import { usePush } from '@/hooks/usePush';
import * as PushAPI from '@pushprotocol/restapi';
import { GroupDTO } from '@pushprotocol/restapi';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface GroupListProps {
  setGroup: (group?: GroupDTO) => void;
}

const GroupList = ({ setGroup }: GroupListProps) => {
  const { address } = useAccount();
  const { key } = usePush();
  const [currentGroup, setCurrentGroup] = useState<number>();
  const [groups, setGroups] = useState<PushAPI.GroupDTO[]>([]);
  const [latestMsgs, setLatestMsgs] = useState<{ msg: string; sent: Date }[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');

  useEffect(() => {
    const fetchGroups = async () => {
      const chats = await PushAPI.chat.chats({
        account: `eip155:${address}`,
        toDecrypt: true,
        pgpPrivateKey: key,
      });

      const groups = chats
        .filter((chat) => chat.chatId !== undefined)
        .map(
          async (chat) =>
            await PushAPI.chat.getGroup({
              chatId: chat.chatId!,
            }),
        );

      const resolvedGroups = await Promise.all(groups);
      setGroups(resolvedGroups);

      const latests = resolvedGroups.map(async (group) => {
        const conversationHash = await PushAPI.chat.conversationHash({
          account: `eip155:${address}`,
          conversationId: group.chatId,
        });
        const latest = await PushAPI.chat.latest({
          threadhash: conversationHash.threadHash,
          account: `eip155:${address}`,
          toDecrypt: true,
          pgpPrivateKey: key,
        });
        return {
          msg: latest[0]?.messageContent || '',
          sent: new Date(latest[0]?.timestamp || 0),
        }
      });
      const resolvedMsgs = await Promise.all(latests);
      setLatestMsgs(resolvedMsgs);
    };

    fetchGroups();
  }, [address, key, latestMsgs]);

  const handleClick = async (id: number) => {
    setCurrentGroup(id);
    setGroup(groups[id]);
  };

  const handleCreate = async () => {
    if (!address) {
      return;
    }
    const response = await PushAPI.chat.createGroup({
      groupName,
      groupImage: 'https://avatars.githubusercontent.com/u/64157541?s=200&v=4',
      groupDescription: 'test',
      members: [],
      admins: [],
      isPublic: true,
      account: address,
      pgpPrivateKey: key,
    });

    setGroups([...groups, response]);
    setCurrentGroup(groups.length);
  };

  return (
    <>
      <div className='p-4 flex justify-between items-center'>
        <input type='checkbox' id='modal-1' className='modal-toggle' />
        <div className='modal'>
          <div className='modal-box relative'>
            <label htmlFor='modal-1' className='btn btn-sm btn-circle absolute right-2 top-2'>
              ✕
            </label>
            <h3 className='text-lg font-bold'>Join Group</h3>
            <input
              onChange={(e) => setGroupId(e.target.value)}
              value={groupId}
              type='text'
              placeholder='Group Id'
              className='input w-full max-w-xs mt-2'
            />
          </div>
        </div>
        <input type='checkbox' id='modal-2' className='modal-toggle' />
        <div className='modal'>
          <div className='modal-box relative'>
            <label htmlFor='modal-2' className='btn btn-sm btn-circle absolute right-2 top-2'>
              ✕
            </label>
            <h3 className='text-lg font-bold'>Create Group</h3>
            <div className='modal-action flex flex-row justify-center items-center'>
              <input
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                type='text'
                placeholder='Group Name'
                className='input w-full max-w-xs'
              />
              <label onClick={handleCreate} htmlFor='modal-2' className='btn'>
                Create
              </label>
            </div>
          </div>
        </div>
        <h2 className='text-lg font-bold'>Group List</h2>
        <label className='btn' htmlFor='modal-2'>
          <Image alt='Add' src='/plus.svg' width={24} height={24} className='' />
        </label>
      </div>
      <div>
        {groups.map((group, i) => (
          <div key={i} className='group' onClick={() => handleClick(i)}>
            <div
              className={`flex items-center p-4 group-hover:bg-[#0BA360] ${
                i === currentGroup ? 'bg-[#0BA360]' : ''
              }`}
            >
              <IdenticonImg username={group.chatId} width={40} height={40} className='mr-4' />
              <div className='flex flex-col w-full'>
                <div className='flex items-center'>
                  <p
                    className={`font-bold group-hover:text-white ${
                      i === currentGroup ? 'text-white' : ''
                    }`}
                  >
                    {group.groupName}
                  </p>
                  <span
                    className={`ml-auto group-hover:opacity-50 group-hover:text-gray-100 text-sm ${
                      i === currentGroup ? 'text-gray-100 opacity-50' : 'text-gray-300'
                    }`}
                  >
                    {latestMsgs[i]?.sent.toLocaleTimeString()}
                  </span>
                </div>
                <p
                  className={`group-hover:opacity-75 group-hover:text-gray-200 ${
                    i === currentGroup ? 'opacity-75 text-gray-200' : 'text-gray-500'
                  }`}
                >
                  {latestMsgs[i]?.msg}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GroupList;
