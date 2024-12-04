'use client'

import { useEffect, useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useAccount, useBalance } from 'wagmi'

const compactHash = (hash: string) => {
  return hash ? hash.slice(0, 7) + '...' + hash.slice(-5) : '...'
}

export const ConnectButton = () => {
  const wagmiAccount = useAccount()
  const account = useAppKitAccount()

  const [isClient, setIsClient] = useState(false)

  const [ethBalance, setEthBalance] = useState<string | null>(null)
  const [usdtBalance, setUsdtBalance] = useState<string | null>(null)
  const [busdBalance, setBusdBalance] = useState<string | null>(null)
  const [hexBalance, setHexBalance] = useState<string | null>(null)

  // Fetch ETH balance
  const { data: ethData, isLoading: isEthLoading } = useBalance({
    address: wagmiAccount.address
  })

  // Fetch BUSD balance (BEP-20/ERC-20 on Ethereum Mainnet)
  const { data: busdData, isLoading: isBusdLoading } = useBalance({
    address: wagmiAccount.address,
    token: '0x4fabb145d64652a948d72533023f6e7a623c7c53' // Ethereum Mainnet BUSD
  })

  // Fetch HEX balance
  const { data: hexData, isLoading: isHexLoading } = useBalance({
    address: wagmiAccount.address,
    token: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39' // Ethereum Mainnet HEX
  })

  // Fetch USDT balance
  const { data: usdtData, isLoading: isUsdtLoading } = useBalance({
    address: wagmiAccount.address,
    token: '0xdAC17F958D2ee523a2206206994597C13D831ec7' // Пример адреса токена USDT
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (ethData && !isEthLoading) setEthBalance(`${ethData.formatted} ${ethData.symbol}`)
    if (busdData && !isBusdLoading) setBusdBalance(`${busdData.formatted} ${busdData.symbol}`)
    if (hexData && !isHexLoading) setHexBalance(`${hexData.formatted} ${hexData.symbol}`)
    if (usdtData && !isUsdtLoading) setUsdtBalance(`${usdtData.formatted} ${usdtData.symbol}`)
  }, [
    ethData,
    isEthLoading,
    busdData,
    isBusdLoading,
    hexData,
    isHexLoading,
    usdtData,
    isUsdtLoading
  ])

  if (!isClient) {
    return (
      <div className="column">
        <span className="text-black">useAppKitAccount: ...</span>
        <span className="text-black">useAccount (wagmi): ...</span>
        <span className="text-black">ETH Balance: ...</span>
        <span className="text-black">BUSD Balance: ...</span>
        <span className="text-black">HEX Balance: ...</span>
        <span className="text-black">USDT Balance: ...</span>
        <appkit-button />
      </div>
    )
  }

  const compactAddress = compactHash(account.address || '')
  const compactAddressWagmi = compactHash(wagmiAccount.address || '')

  return (
    <div className="column">
      <span className="text-black">useAppKitAccount: {compactAddress}</span>
      <span className="text-black">useAccount (wagmi): {compactAddressWagmi}</span>
      <span className="text-black">ETH Balance: {ethBalance || 'Loading...'}</span>
      <span className="text-black">BUSD Balance: {busdBalance || 'Loading...'}</span>
      <span className="text-black">HEX Balance: {hexBalance || 'Loading...'}</span>
      <span className="text-black">USDT Balance: {usdtBalance || 'Loading...'}</span>
      <appkit-button />
    </div>
  )
}
