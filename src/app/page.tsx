'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import AccountAbstractionExample from './component'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected} = useAccount()

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          By{' '}
          <Image
            src="/next.svg"
            alt="Next Logo"
            className="dark:invert ml-2"
            width={100}
            height={24}
            priority
          />
        </div>

        <ConnectButton />
      </div>

      { isConnected && <AccountAbstractionExample /> }

    </main>
  )
}
