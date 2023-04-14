'use client';

import './globals.css';
import { LitProvider } from '@/components';
import { lensConfig } from '@/config/lens';
import { litConfig } from '@/config/lit';
import { chains, wagmiClient } from '@/config/wagmi';
import { LensProvider } from '@lens-protocol/react-web';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <LensProvider config={lensConfig}>
              <LitProvider config={litConfig}>{children}</LitProvider>
            </LensProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
