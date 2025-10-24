import { http, createConfig } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"
import { walletConnect, coinbaseWallet, injected } from "wagmi/connectors"

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Bible DApp",
      preference: "smartWalletOnly",
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      metadata: {
        name: "Bible DApp",
        description: "Daily Bible verses on Base blockchain",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: ["https://bible-api.com/favicon.ico"],
      },
      showQrModal: true,
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
