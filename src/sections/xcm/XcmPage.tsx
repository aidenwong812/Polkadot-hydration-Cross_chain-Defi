import { SContainer } from "./XcmPage.styled"

import type { TxInfo } from "@galacticcouncil/apps"

import { z } from "zod"
import { MakeGenerics, useSearch } from "@tanstack/react-location"
import * as React from "react"
import * as Apps from "@galacticcouncil/apps"
import { createComponent, EventName } from "@lit-labs/react"

import { useAccount } from "sections/web3-connect/Web3Connect.utils"
import { useActiveRpcUrlList } from "api/provider"
import { useStore } from "state/store"
import { useWeb3ConnectStore } from "sections/web3-connect/store/useWeb3ConnectStore"
import {
  DEFAULT_DEST_CHAIN,
  getDefaultSrcChain,
  getDesiredWalletMode,
  getNotificationToastTemplates,
  getSubmittableExtrinsic,
  getXCall,
} from "sections/xcm/XcmPage.utils"
import { genesisHashToChain } from "utils/helpers"

type WalletChangeDetail = {
  srcChain: string
}

export const XcmApp = createComponent({
  tagName: "gc-xcm",
  elementClass: Apps.XcmApp,
  react: React,
  events: {
    onXcmNew: "gc:xcm:new" as EventName<CustomEvent<TxInfo>>,
    onWalletChange: "gc:wallet:change" as EventName<
      CustomEvent<WalletChangeDetail>
    >,
  },
})

const stableCoinAssetId = import.meta.env.VITE_STABLECOIN_ASSET_ID

const XcmAppSearch = z.object({
  srcChain: z.string().optional(),
  destChain: z.string().optional(),
  asset: z.string().optional(),
})

type SearchGenerics = MakeGenerics<{
  Search: z.infer<typeof XcmAppSearch>
}>

export function XcmPage() {
  const { account } = useAccount()
  const { createTransaction } = useStore()

  const [incomingSrcChain, setIncomingSrcChain] = React.useState("")
  const [srcChain, setSrcChain] = React.useState(
    getDefaultSrcChain(account?.address),
  )

  const rawSearch = useSearch<SearchGenerics>()
  const search = XcmAppSearch.safeParse(rawSearch)

  const { toggle: toggleWeb3Modal } = useWeb3ConnectStore()

  const rpcUrlList = useActiveRpcUrlList()

  const ref = React.useRef<Apps.XcmApp>(null)

  const handleSubmit = async (e: CustomEvent<TxInfo>) => {
    await createTransaction(
      {
        tx: await getSubmittableExtrinsic(e.detail),
        ...getXCall(e.detail),
      },
      {
        onSuccess: () => {},
        onSubmitted: () => {},
        toast: getNotificationToastTemplates(e.detail),
      },
    )
  }

  React.useEffect(() => {
    return useWeb3ConnectStore.subscribe((state, prevState) => {
      const hasAccountChanged =
        state.account && state.account.address !== prevState.account?.address

      if (hasAccountChanged) {
        setSrcChain(
          incomingSrcChain || getDefaultSrcChain(state.account?.address),
        )
      }
    })
  }, [incomingSrcChain])

  const handleWalletChange = (e: CustomEvent<WalletChangeDetail>) => {
    const { srcChain } = e.detail

    const walletMode = getDesiredWalletMode(srcChain)

    setIncomingSrcChain(srcChain)

    toggleWeb3Modal(walletMode, {
      chain: srcChain,
    })
  }

  const srcChainDefault =
    search.success && search.data.srcChain ? search.data.srcChain : srcChain

  const destChainDefault =
    search.success && search.data.destChain
      ? search.data.destChain
      : DEFAULT_DEST_CHAIN

  const assetDefault =
    search.success && search.data.asset
      ? search.data.asset
      : srcChain === "ethereum"
        ? "eth"
        : undefined
  const ss58Prefix = genesisHashToChain(account?.genesisHash).prefix

  const blacklist =
    import.meta.env.VITE_ENV === "production"
      ? "acala-evm,darwinia"
      : "darwinia"

  return (
    <SContainer>
      <XcmApp
        ref={ref}
        srcChain={srcChainDefault}
        destChain={destChainDefault}
        asset={assetDefault}
        accountName={account?.name}
        accountProvider={account?.provider}
        accountAddress={account?.address}
        apiAddress={rpcUrlList.join()}
        stableCoinAssetId={stableCoinAssetId}
        onXcmNew={handleSubmit}
        onWalletChange={handleWalletChange}
        ss58Prefix={ss58Prefix}
        blacklist={blacklist}
      />
    </SContainer>
  )
}
