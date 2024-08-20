import { WalletProviderType } from "sections/web3-connect/Web3Connect.utils"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { omit } from "utils/rx"

export enum WalletProviderStatus {
  Connected = "connected",
  Pending = "pending",
  Disconnected = "disconnected",
  Error = "error",
}

export enum WalletMode {
  Default = "default",
  EVM = "evm",
  Substrate = "substrate",
  SubstrateEVM = "substrate-evm",
  SubstrateH160 = "substrate-h160",
}

export type Account = {
  name: string
  address: string
  displayAddress?: string
  genesisHash?: `0x${string}`
  provider: WalletProviderType
  isExternalWalletConnected?: boolean
  delegate?: string
}
type WalletProviderMeta = {
  chain: string
}
type WalletProviderState = {
  open: boolean
  provider: WalletProviderType | null
  recentProvider: WalletProviderType | null
  account: Account | null
  status: WalletProviderStatus
  mode: WalletMode
  error?: string
  meta?: WalletProviderMeta | null
}

type WalletProviderStore = WalletProviderState & {
  toggle: (mode?: WalletMode, meta?: WalletProviderMeta) => void
  setAccount: (account: Account | null) => void
  setProvider: (provider: WalletProviderType | null) => void
  setStatus: (
    provider: WalletProviderType | null,
    status: WalletProviderStatus,
  ) => void
  setError: (error: string) => void
  disconnect: () => void
}

const initialState: WalletProviderState = {
  open: false,
  provider: null,
  recentProvider: null,
  account: null,
  status: WalletProviderStatus.Disconnected,
  mode: WalletMode.Default,
  error: "",
  meta: null,
}

export const useWeb3ConnectStore = create<WalletProviderStore>()(
  persist(
    (set) => ({
      ...initialState,
      toggle: (mode, meta) =>
        set((state) => {
          const isValidMode = mode && Object.values(WalletMode).includes(mode)
          return {
            ...state,
            mode: isValidMode ? mode : WalletMode.Default,
            open: !state.open,
            meta: meta ?? null,
          }
        }),
      setAccount: (account) => set((state) => ({ ...state, account })),
      setProvider: (provider) =>
        set((state) => ({ ...state, provider, recentProvider: provider })),
      setStatus: (provider, status) => {
        const isConnected = status === WalletProviderStatus.Connected
        const isError = status === WalletProviderStatus.Error
        return set((state) => ({
          ...state,
          provider,
          recentProvider: provider,
          status,
          account: isConnected ? state.account : null,
          error: isError ? state.error : "",
        }))
      },
      setError: (error) => set((state) => ({ ...state, error })),
      disconnect: () => {
        set((state) => ({
          ...state,
          ...initialState,
          open: state.open,
          recentProvider: state.provider,
        }))
      },
    }),
    {
      name: "web3-connect",
      partialize: (state) => omit(["open"], state),
      version: 4,
    },
  ),
)
