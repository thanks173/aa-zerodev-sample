'use client'

import { useState } from 'react'
import { useAccount, erc20ABI } from 'wagmi'
import {
  prepareSendUserOperation, sendUserOperation,
  usePrepareContractBatchWrite, useContractBatchWrite,
  usePrepareSendUserOperation, useSendUserOperation
} from '@zerodev/wagmi'
import sampleNftAbi from "@/abi/SampleNFT-Mumbai.json";
import { encodeFunctionData, parseEther } from 'viem'
import { jwtDecode } from "jwt-decode"

const SAMPLE_NFT_ADDRESS = '0x34bE7f35132E97915633BC1fc020364EA5134863'
const SAMPLE_ERC20_ADDRESS = '0x82182FcB01171CDbd6D06667162928E6362332ac'

export default function AccountAbstractionExample() {
  const { connector: activeConnector, address } = useAccount()
  const [userInfo, setUserInfo] = useState<undefined | Object>(undefined)
  const [userWallet, setUserWallet] = useState<undefined | Object>(undefined)
  const [sendResult, setSendResult] = useState<undefined | Object>(undefined)

  const getUserInfo = async () => {
    const info = await (activeConnector as any)?.web3Auth?.getUserInfo()
    console.log(info)

    const decoded = jwtDecode(info.idToken);
    setUserWallet((decoded as any)?.wallets)
    setUserInfo({
      ...info,
      idToken: undefined,
      oAuthAccessToken: undefined,
      oAuthIdToken: undefined,
      profileImage: undefined
    })
  }

  // sendUserOperation
  const sendOperation = async () => {
    setSendResult(undefined)
    const config = await prepareSendUserOperation({
      to: address,
      data: '0x',
      value: BigInt('1'),
    })
    const result = await sendUserOperation(config)
    setSendResult(result)
  }

  // useSendUserOperation: https://wagmi.sh/react/hooks/useSendTransaction
  const data = encodeFunctionData({
    abi: sampleNftAbi,
    functionName: "mint",
    args: [address],
  })

  const { config } = usePrepareSendUserOperation({
    to: SAMPLE_NFT_ADDRESS,
    data: data,
    value: BigInt('0'),
    onError(error) {
      console.log('Error', error)
    },
    onSettled(data, error) {
      console.log('Settled', { data, error })
    },
    onSuccess(data) {
      console.log('Success', data)
    },
  })

  const { sendUserOperation: write, sendUserOperationAsync: writeAsync, data: writeData } = useSendUserOperation(config)

  // useContractBatchWrite
  const { config: batchConfig } = usePrepareContractBatchWrite({
    calls: [
      {
        address: SAMPLE_NFT_ADDRESS,
        abi: sampleNftAbi,
        functionName: "mint",
        args: [address],
      },
      {
        address: SAMPLE_ERC20_ADDRESS,
        abi: erc20ABI,
        functionName: "transfer",
        args: [address, parseEther('10')],
      }
    ],
    enabled: true
  })

  const { sendUserOperation: batchWrite, sendUserOperationAsync: batchWriteAsync, data: batchWriteData } = useContractBatchWrite(batchConfig)

  return (
    <>
      <div className="flex flex-col items-center mt-32">
        <div>
          {address}
        </div>
      </div>

      <div className="flex flex-col items-center mt-32">
        <div>
          {JSON.stringify(userWallet)}
        </div>
        <div>
          {JSON.stringify(userInfo)}
        </div>
        <button
          className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
          onClick={getUserInfo}>
            Get User Info
        </button>
      </div>

      <div className="flex flex-col items-center mt-32">
        <div>
          {JSON.stringify(sendResult)}
        </div>
        <div className="flex space-x-3">
          <button
            className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
            onClick={() => sendOperation()}>
              sendUserOperation
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-32">
        <div>
          {JSON.stringify(writeData)}
        </div>
        <div className="flex space-x-3">
          <button
            className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
            onClick={() => {
              write && write()
            }}>
            useSendUserOperation
          </button>
          <button
            className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
            onClick={() => {
              writeAsync && writeAsync()
            }}>
            useSendUserOperation Async
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-32">
        <div>
          {JSON.stringify(batchWriteData)}
        </div>
        <div className="flex space-x-3">
          <button
            className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
            onClick={() => {
              batchWrite && batchWrite()
            }}>
            useContractBatchWrite
          </button>
          <button
            className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
            onClick={() => {
              batchWriteAsync && batchWriteAsync()
            }}>
            useContractBatchWrite Async
          </button>
        </div>
      </div>
    </>
  )
}
