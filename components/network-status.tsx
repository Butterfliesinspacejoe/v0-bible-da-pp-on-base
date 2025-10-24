"use client"

import { useAccount, useChainId } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

export function NetworkStatus() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  if (!isConnected) {
    return null
  }

  const isBase = chainId === base.id
  const isBaseSepolia = chainId === baseSepolia.id
  const isCorrectNetwork = isBase || isBaseSepolia

  return (
    <Badge variant={isCorrectNetwork ? "default" : "destructive"} className="gap-1.5">
      {isCorrectNetwork ? (
        <>
          <CheckCircle2 className="h-3 w-3" />
          {isBase ? "Base Mainnet" : "Base Sepolia"}
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          Wrong Network
        </>
      )}
    </Badge>
  )
}
