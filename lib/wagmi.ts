import { http, createConfig } from 'wagmi'
import { metaMask } from "wagmi/connectors";
import { type Chain } from "viem";

export const citreaTestnet = {
  id: 5115,
  name: "Citrea Testnet",
  nativeCurrency: { name: "Citrea Bitcoin", symbol: "cBTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.citrea.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "CitreaExplorer",
      url: "https://explorer.testnet.citrea.xyz",
    },
  },
  contracts: {
    // Note: Replace these with actual contract addresses when deployed
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 1,
    },
  },
} as const satisfies Chain;

export const config = createConfig({
    chains: [citreaTestnet],
    connectors: [metaMask()],
    transports: {
        [citreaTestnet.id]: http(),
    },
})

