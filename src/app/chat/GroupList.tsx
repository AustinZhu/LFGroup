'use client';

import { IdenticonImg } from '@/components';
import { usePKPWallet, useMintPKP } from '@/hooks/useLit';
import { useXMTPClient } from '@/hooks/useXMTP';
import { truncateEthAddress } from '@/utils/ethereum';
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { Arrayish, PKPNFT } from '@lit-protocol/contracts-sdk/src/abis/PKPNFT';
import { PKPPermissions } from '@lit-protocol/contracts-sdk/src/abis/PKPPermissions';
import { Client, Conversation } from '@xmtp/xmtp-js';
import { BigNumber, utils } from 'ethers';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';

const mockGroups: string[] = [
  '12214489956700739559714548033094819536594287450588618676882006260107778902796',
];

class Bytes implements Arrayish {
  readonly bytes: Uint8Array;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  toHexString(): string {
    return utils.hexlify(this.bytes);
  }

  slice(start?: number, end?: number): Bytes {
    return new Bytes(this.bytes.slice(start, end));
  }

  get length(): number {
    return this.bytes.length;
  }

  [index: number]: number;
}

interface GroupListProps {
  setReaderClient: (client: Client) => void;
  setConvo: (convo?: Conversation) => void;
  setChatId: (chatId?: string) => void;
}

const GroupList = ({ setReaderClient, setConvo }: GroupListProps) => {
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [groupAddresses, setGroupAddresses] = useState<string[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string>();
  const { createWallet } = usePKPWallet();
  const { data: signer } = useSigner();
  const { mint } = useMintPKP();
  const writer = useXMTPClient();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [groupCode, setGroupCode] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const contracts = new LitContracts({ signer });

  useEffect(() => {
    if (!writer) {
      return;
    }
    const fetchGroupIds = async () => {
      const bytesAddress = utils.solidityPack(['address'], [writer.address]);
      const authMethodId = utils.keccak256(
        utils.defaultAbiCoder.encode(['uint8, bytes'], [1, bytesAddress]),
      );

      const tokenIds = await (
        contracts.pkpPermissionsContract.read as PKPPermissions
      ).getTokenIdsForAuthMethod(1, new Bytes(utils.toUtf8Bytes(authMethodId)));

      const pkpAddresses = await Promise.all(
        tokenIds.map(async (id: BigNumber) => {
          return await (contracts.pkpNftContract.read as PKPNFT).getEthAddress(id);
        }),
      );

      const convoAddrs = (await writer?.conversations.list()).map((c) => c.peerAddress);
      const groupIds = tokenIds
        ?.filter((id, i) => convoAddrs.includes(pkpAddresses[i]))
        .map((id) => id.toString());
      const groupAddresses = pkpAddresses.filter((addr) => convoAddrs.includes(addr));

      setGroupAddresses(groupAddresses);
      setGroupIds(groupIds || []);
      console.log('groupIds', groupIds);
    };

    fetchGroupIds();
  }, [writer]);

  const handleClick = async (id: string) => {
    if (!writer) {
      return;
    }
    setCurrentGroupId(id);
    await contracts.connect();
    const pubKey = await (contracts.pkpNftContract.read as PKPNFT).getPubkey(id);
    const wallet = await createWallet(pubKey);
    if (!wallet) {
      return;
    }

    const reader = await Client.create(wallet, { env: 'production' });
    setReaderClient(reader);

    const convo = await writer.conversations.newConversation(wallet.address);
    setConvo(convo);
  };

  const handleJoin = async () => {
    if (!signer) {
      return;
    }
    if (!groupCode) {
      return;
    }
    setIsPending(true);

    const contracts = new LitContracts({ signer });
    await contracts.connect();
    const pubKey = await (contracts.pkpNftContract.read as PKPNFT).getPubkey(groupCode);
    const wallet = await createWallet(pubKey);
    if (!wallet) {
      setIsPending(false);
      return;
    }
    console.log('wallet', wallet);

    setCurrentChatId(groupCode);

    try {
      const reader = await Client.create(wallet, { env: 'production' });
      setReaderClient(reader);
    } catch (e) {
      console.log('typeof e', typeof e);
      console.log(e);
    }

    const writer = await Client.create(signer, { env: 'production' });
    const convo = await writer.conversations.newConversation(wallet.address);
    setConvo(convo);
    setGroupCode('');
    setIsPending(false);
  };

  const handleCreate = async () => {
    if (!signer) {
      return;
    }
    setIsPending(true);

    const pkpToken = await mint(signer);

    if (pkpToken) {
      // create reader client
      const wallet = await createWallet(pkpToken.pubKey);
      if (!wallet) {
        return;
      }
      setCurrentChatId(pkpToken.tokenId);

      console.log('wallet', wallet);

      const reader = await Client.create(wallet, { env: 'production' });
      setReaderClient(reader);

      const writer = await Client.create(signer, { env: 'production' });
      const convo = await writer.conversations.newConversation(wallet.address);
      console.log('conve', convo);
      console.log('writer', writer);
      setConvo(convo);
    }
    setGroupName('');
    setIsPending(false);
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
              onChange={(e) => setGroupCode(e.target.value)}
              value={groupCode}
              type='text'
              placeholder='Group Code'
              className='input w-full max-w-xs mt-2'
            />
            <button onClick={handleJoin} className='btn ml-4'>
              Join
            </button>
          </div>
        </div>
        <input type='checkbox' id='modal-2' className='modal-toggle' />
        <div className='modal'>
          <div className='modal-box relative'>
            <label htmlFor='modal-2' className='btn btn-sm btn-circle absolute right-2 top-2'>
              ✕
            </label>
            <h3 className='text-lg font-bold'>Create Group</h3>
            <input
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
              type='text'
              placeholder='Group Name'
              className='input w-full max-w-xs mt-2'
            />
            <button onClick={handleCreate} className='btn ml-4'>
              Create
            </button>
          </div>
        </div>
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
              <label htmlFor='modal-1'>
                <button>Join</button>
              </label>
            </li>
            <li>
              <label htmlFor='modal-2'>
                <button>Create</button>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div>
        {groupIds.map((id, i) => (
          <div key={id} className='group' onClick={() => handleClick(id)}>
            <div
              className={`flex items-center p-4 group-hover:bg-[#0BA360] ${id === currentGroupId ? 'bg-[#0BA360]' : ''
                }`}
            >
              <IdenticonImg username={groupAddresses[i]} width={40} height={40} className='mr-4' />
              <div className='flex flex-col w-full'>
                <div className='flex items-center'>
                  <p
                    className={`font-bold group-hover:text-white ${id === currentGroupId ? 'text-white' : ''
                      }`}
                  >
                    {truncateEthAddress(groupAddresses[i])}
                  </p>
                  <span
                    className={`ml-auto group-hover:opacity-50 group-hover:text-gray-100 text-sm ${id === currentGroupId ? 'text-gray-100 opacity-50' : 'text-gray-300'
                      }`}
                  >
                    10:30 AM
                  </span>
                </div>
                <p
                  className={`group-hover:opacity-75 group-hover:text-gray-200 ${id === currentGroupId ? 'opacity-75 text-gray-200' : 'text-gray-500'
                    }`}
                >
                  {'Hello, World!'}
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
