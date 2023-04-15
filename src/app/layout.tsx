'use client';

import { PushProvider } from '@/components';
import { lensConfig } from '@/config/lens';
import { chains, wagmiClient } from '@/config/wagmi';
import { LensProvider } from '@lens-protocol/react-web';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <LensProvider config={lensConfig}>
              <PushProvider>{children}</PushProvider>
            </LensProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
