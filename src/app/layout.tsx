'use client';

import { LitProvider } from '@/components';
import XMTPProvider from '@/components/XMTPProvider';
import { lensConfig } from '@/config/lens';
import { litConfig } from '@/config/lit';
import { chains, wagmiClient } from '@/config/wagmi';
import { xmtpConfig } from '@/config/xmtp';
import { LensProvider } from '@lens-protocol/react-web';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <QueryClientProvider client={queryClient}>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <LensProvider config={lensConfig}>
                <LitProvider config={litConfig}>
                  <XMTPProvider config={xmtpConfig}>{children}</XMTPProvider>
                </LitProvider>
              </LensProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </QueryClientProvider>
      </body>
    </html>
  );
}
