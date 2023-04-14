import { chronicle } from '@/config/wagmi';
import { LOCAL_STORAGE_KEYS } from '@lit-protocol/constants';
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { PKPNFT } from '@lit-protocol/contracts-sdk/src/abis/PKPNFT';
import { PKPPermissions } from '@lit-protocol/contracts-sdk/src/abis/PKPPermissions';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { PKPWallet } from '@lit-protocol/pkp-ethers';
import {
  AuthCallback,
  GetSessionSigsProps,
  LitNodeClientConfig,
  SessionSig
} from '@lit-protocol/types';
import { ContractTransaction, Signer } from 'ethers';
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useState } from 'react';
import { SiweMessage } from 'siwe';

interface LitContextValues {
  client: LitNodeClient | undefined;
  setClient: Dispatch<SetStateAction<LitNodeClient | undefined>>;
  config: Partial<LitNodeClientConfig>;
}

export const LitContext = createContext<LitContextValues>({
  client: undefined,
  setClient: () => {},
  config: {},
});

export const useLitConnect = () => {
  const { client, setClient, config } = useContext(LitContext);
  const [isPending, setIsPending] = useState(false);
  const [isConnected, setIsConnected] = useState(client !== undefined);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const connect = async (signer: Signer) => {
    try {
      setIsPending(true);

      const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
      const authNeededCallback: AuthCallback = async (params) => {
        const address = await signer.getAddress();
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign a session key to use with Lit Protocol',
          uri: params.uri,
          version: '1',
          chainId: await signer.getChainId(),
          expirationTime: expiration,
          resources: params.resources,
        });
        const toSign = message.prepareMessage();
        const signature = await signer.signMessage(toSign);
        const authSig: SessionSig = {
          sig: signature,
          derivedVia: 'web3.eth.personal.sign',
          signedMessage: toSign,
          address,
        };

        localStorage.setItem(LOCAL_STORAGE_KEYS.WALLET_SIGNATURE, JSON.stringify(authSig));

        return authSig;
      };
      const baseParams: GetSessionSigsProps = {
        expiration: expiration,
        chain: 'mumbai',
        resources: ['litAction://*', 'litPKP://*'],
        switchChain: false,
        authNeededCallback,
      };

      const litNodeClient = new LitNodeClient(config);
      await litNodeClient.connect();
      await litNodeClient.getSessionSigs(baseParams);

      setClient(litNodeClient);
      setIsConnected(true);
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    connect: useCallback(connect, [setClient, config]),
    isPending,
    isConnected,
    isError,
    error,
  };
};

export const useLitClient = () => {
  const { client } = useContext(LitContext);

  return client;
};

export const useLitDisconnect = () => {
  const { client, setClient } = useContext(LitContext);
  const [isPending, setIsPending] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(client === undefined);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const disconnect = async () => {
    try {
      setIsPending(true);

      localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSION_KEY);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.WALLET_SIGNATURE);

      setClient(undefined);
      setIsDisconnected(true);
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    disconnect: useCallback(disconnect, [setClient]),
    isPending,
    isDisconnected,
    isError,
    error,
  };
};

export const useMintPKP = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const mint = async (signer: Signer) => {
    try {
      setIsPending(true);

      const contracts = new LitContracts({ signer });
      await contracts.connect();

      const { tokenId } = await contracts.pkpNftContractUtil.write.mint();
      const pubKey = await (contracts.pkpNftContract.read as PKPNFT).getPubkey(tokenId);

      setIsSuccess(true);

      return {
        tokenId,
        pubKey,
      };
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    mint: useCallback(mint, []),
    isPending,
    isSuccess,
    isError,
    error,
  };
};

export const usePKPGrantPermission = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const grantPermission = async (signer: Signer, tokenId: string, user: string) => {
    try {
      setIsPending(true);

      const contracts = new LitContracts({ signer });
      await contracts.connect();

      const tx: ContractTransaction =
        await contracts.pkpPermissionsContractUtil.write.addPermittedAddress(tokenId, user);
      await tx.wait();

      setIsSuccess(true);
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    grantPermission: useCallback(grantPermission, []),
    isPending,
    isSuccess,
    isError,
    error,
  };
};

export const usePKPRevokePermission = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const revokePermission = async (signer: Signer, tokenId: string, user: string) => {
    try {
      setIsPending(true);

      const contracts = new LitContracts({ signer });
      await contracts.connect();

      const tx = await (
        contracts.pkpPermissionsContract.write as PKPPermissions
      ).removePermittedAddress(tokenId, user);
      await tx.wait();

      setIsSuccess(true);
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    revokePermission: useCallback(revokePermission, []),
    isPending,
    isSuccess,
    isError,
    error,
  };
};

export const usePKPGetPermissions = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const getPermissions = async (tokenId: string) => {
    try {
      setIsPending(true);

      const contracts = new LitContracts();
      await contracts.connect();

      const permissions = await contracts.pkpPermissionsContractUtil.read.getPermittedAddresses(
        tokenId,
      );

      setIsSuccess(true);

      return permissions;
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    getPermissions: useCallback(getPermissions, []),
    isPending,
    isSuccess,
    isError,
    error,
  };
};

export const usePKPWallet = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const createWallet = async (pkpPubKey: string) => {
    try {
      const sessionAuthSig = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.WALLET_SIGNATURE) || '{}',
      );

      const wallet = new PKPWallet({
        pkpPubKey,
        controllerAuthSig: sessionAuthSig,
        provider: chronicle.rpcUrls.default.http[0],
      });
      await wallet.init();

      setIsSuccess(true);

      return wallet;
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    createWallet: useCallback(createWallet, []),
    isPending,
    isSuccess,
    isError,
    error,
  };
};
