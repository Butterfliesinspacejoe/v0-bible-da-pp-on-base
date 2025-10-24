"use client"

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, ChevronDown, AlertCircle } from "lucide-react"
import { base, baseSepolia } from "wagmi/chains"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function WalletConnectButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [error, setError] = useState<string | null>(null)

  const isCorrectNetwork = chainId === base.id || chainId === baseSepolia.id

  const handleConnect = async (connectorId: string) => {
    try {
      setError(null)
      const connector = connectors.find((c) => c.id === connectorId)
      if (connector) {
        await connect({ connector })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    }
  }

  const handleSwitchToBase = async () => {
    try {
      setError(null)
      await switchChain({ chainId: base.id })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to switch network")
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Wallet className="h-4 w-4" />
              {address.slice(0, 6)}...{address.slice(-4)}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Connected Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs font-mono">{address}</DropdownMenuItem>
            <DropdownMenuItem className="text-xs">Network: {chain?.name || "Unknown"}</DropdownMenuItem>
            {!isCorrectNetwork && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSwitchToBase}>Switch to Base</DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => disconnect()} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isCorrectNetwork && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">Please switch to Base network</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2">
            <Wallet className="h-4 w-4" />
            Connect Wallet
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Choose Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {connectors.map((connector) => (
            <DropdownMenuItem key={connector.id} onClick={() => handleConnect(connector.id)} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>{connector.name}</span>
                {connector.id === "coinbaseWalletSDK" && (
                  <span className="text-xs text-muted-foreground">(Recommended)</span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {(error || connectError) && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error || connectError?.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
