import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient } from 'wagmi';
import { Chain, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

export const chronicle: Chain = {
  id: 175177,
  network: 'Chronicle - Lit Protocol Testnet',
  name: 'Chronicle - Lit Protocol Testnet',
  rpcUrls: {
    public: {
      http: ['https://chain-rpc.litprotocol.com/http'],
    },
    default: {
      http: ['https://chain-rpc.litprotocol.com/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lit Protocol Explorer',
      url: 'https://chain.litprotocol.com/',
    },
  },
  nativeCurrency: {
    name: 'LIT',
    symbol: 'LIT',
    decimals: 18,
  },
};

export const { chains, provider, webSocketProvider } = configureChains(
  [polygon],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'My App',
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});
