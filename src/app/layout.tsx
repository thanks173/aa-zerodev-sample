import { Metadata } from 'next'
import dynamic from 'next/dynamic'
const WagmiProvider = dynamic(() => import('./provider'), { ssr: false })

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  )
}
