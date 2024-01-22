'use client'

import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { polygonMumbai } from 'viem/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit'
import {
  googleWallet,
  twitterWallet,
} from '@zerodev/wagmi/rainbowkit'

const ZERODEV_PROJECT_ID = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || ""
const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY || ""

const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ""
const WEB3AUTH_NETWORK = process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK === "sapphire_mainnet" ? "sapphire_mainnet" : "sapphire_devnet"
const WEB3AUTH_TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_AUTH0_CLIENT_ID || ""
const WEB3AUTH_TWITTER_VERIFIER = process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER || ""
const WEB3AUTH_TWITTER_JWT_DOMAIN = process.env.NEXT_PUBLIC_WEB3AUTH_AUTH0_DOMAIN || ""
const WEB3AUTH_WHITELABEL_NAME = process.env.NEXT_PUBLIC_WEB3AUTH_WHITELABEL_NAME || ""

export default function WagmiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const allowedChains = [polygonMumbai]

  const twitterConnector = twitterWallet({
    chains: allowedChains,
    options: {
      projectId: ZERODEV_PROJECT_ID,
      shimDisconnect: true,
      web3authOptions: {
        clientId: WEB3AUTH_CLIENT_ID,
        sessionTime: 60,
        web3AuthNetwork: WEB3AUTH_NETWORK,
      },
      adapterSettings: {
        uxMode: "redirect",
        loginConfig: {
          twitter: {
            clientId: WEB3AUTH_TWITTER_CLIENT_ID,
            name: 'Twitter',
            typeOfLogin: 'twitter',
            verifier: WEB3AUTH_TWITTER_VERIFIER,
            jwtParameters: {
              domain: WEB3AUTH_TWITTER_JWT_DOMAIN,
              verifierIdField: "sub",
            },
          },
        },
        whiteLabel: {
          appName: WEB3AUTH_WHITELABEL_NAME,
        }
      },
    }
  })

  const connectors = connectorsForWallets([
    {
      groupName: 'Social',
      wallets: [
        twitterConnector,
      ],
    },
  ]);

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    allowedChains,
    [alchemyProvider({ apiKey: ALCHEMY_KEY })],
  )
  const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  })


  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider
        chains={chains}
        modalSize={'compact'}
        theme={darkTheme({
          accentColor: '#7b3fe4',
          accentColorForeground: 'white',
          borderRadius: 'medium',
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
