import { useProviderRpcUrlStore } from "api/provider"
import { SCircle, SCircleThumb, SItem } from "./ProviderItem.styled"
import { Text } from "components/Typography/Text/Text"
import { theme } from "theme"
import { InfoTooltip } from "components/InfoTooltip/InfoTooltip"
import { Icon } from "components/Icon/Icon"
import IconRemove from "assets/icons/IconRemove.svg?react"
import IconEdit from "assets/icons/IconEdit.svg?react"
import { useBestNumber } from "api/chain"
import { ProviderStatus } from "sections/provider/ProviderStatus"
import { useEffect, useState } from "react"
import { u32, u64 } from "@polkadot/types"
import { ProviderItemEdit } from "sections/provider/components/ProviderItemEdit/ProviderItemEdit"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { Spinner } from "components/Spinner/Spinner"

type ProviderItemProps = {
  name: string
  url: string
  isActive?: boolean
  isError?: boolean
  custom?: boolean
  onClick: () => void
  onRemove?: (id: string) => void
}

export const ProviderItem = ({
  name,
  url,
  isActive,
  isError,
  custom,
  onClick,
  onRemove,
}: ProviderItemProps) => {
  const [isEdit, setIsEdit] = useState(false)
  const store = useProviderRpcUrlStore()
  const rpcUrl = store.rpcUrl ?? import.meta.env.VITE_PROVIDER_URL

  const isLive = url === rpcUrl

  if (isEdit)
    return (
      <ProviderItemEdit
        name={name}
        url={url}
        onCancel={() => setIsEdit(false)}
      />
    )

  return (
    <SItem onClick={onClick}>
      <div>
        <Text
          color={isActive ? "pink600" : "white"}
          css={{
            gridArea: "name",
            transition: `all ${theme.transitions.default}`,
          }}
        >
          {name}
        </Text>
      </div>
      {isError ? (
        <span
          sx={{ width: 7, height: 7, display: "block" }}
          css={{ background: "#FF4B4B" }}
        />
      ) : (
        <>
          {isLive ? (
            <ProviderSelectItemLive css={{ gridArea: "status" }} />
          ) : (
            <ProviderSelectItemExternal
              url={url}
              css={{ gridArea: "status" }}
            />
          )}
        </>
      )}

      <div
        css={{ gridArea: "url" }}
        sx={{
          textAlign: "right",
          flex: "row",
          align: "center",
          justify: "flex-end",
          gap: 16,
        }}
      >
        <Text
          fs={14}
          fw={500}
          tAlign="right"
          color={isActive ? "pink600" : "basic600"}
          css={{ transition: `all ${theme.transitions.default}` }}
        >
          {new URL(url).hostname}
        </Text>

        <SCircle>{isActive && <SCircleThumb />}</SCircle>
        {custom && (
          <div sx={{ flex: "row", align: "center", gap: 12, ml: 8 }}>
            <InfoTooltip text="Remove" type="black">
              <Icon
                icon={<IconRemove />}
                sx={{ color: "basic700" }}
                css={{ "&:hover": { opacity: 0.7 } }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRemove?.(url)
                }}
              />
            </InfoTooltip>
            <InfoTooltip text="Edit" type="black">
              <Icon
                icon={<IconEdit />}
                sx={{ color: "basic700" }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsEdit(true)
                }}
              />
            </InfoTooltip>
          </div>
        )}
      </div>
    </SItem>
  )
}

const ProviderSelectItemLive = ({ className }: { className?: string }) => {
  const number = useBestNumber()

  return (
    <>
      {number.data?.parachainBlockNumber != null ? (
        <ProviderStatus
          timestamp={number.data.timestamp}
          parachainBlockNumber={number.data?.parachainBlockNumber}
          className={className}
          side="left"
        />
      ) : (
        <span className={className}>
          <Spinner size={16} />
        </span>
      )}
    </>
  )
}

const ProviderSelectItemExternal = ({
  url,
  className,
}: {
  url: string
  className?: string
}) => {
  const [disconnected, setDisconnected] = useState(false)
  const [bestNumberState, setBestNumberState] = useState<
    { parachainBlockNumber: u32; timestamp: u64 } | undefined
  >(undefined)

  useEffect(() => {
    let cancel: () => void
    let cancelInactive: () => void

    const provider = new WsProvider(url)

    provider.on("error", () => {
      cancelInactive = () => provider.disconnect()
    })

    provider.on("disconnected", () => {
      provider.disconnect()
      setDisconnected(true)
    })

    provider.on("connected", load)

    async function load() {
      const api = await ApiPromise.create({ provider })

      async function onNewBlock() {
        const [parachain, timestamp] = await Promise.all([
          api.derive.chain.bestNumber(),
          api.query.timestamp.now(),
        ])

        setBestNumberState({
          parachainBlockNumber: parachain,
          timestamp: timestamp,
        })
      }

      api.on("connected", onNewBlock)
      api.rpc.chain.subscribeNewHeads(onNewBlock).then(
        (newCancel) =>
          (cancel = () => {
            newCancel()
            api.disconnect()
          }),
      )
    }

    return () => {
      cancel?.()
      cancelInactive?.()
    }
  }, [url])

  if (disconnected) {
    return (
      <span
        sx={{ width: 7, height: 7, display: "block" }}
        css={{ background: "#FF4B4B" }}
      />
    )
  }

  return (
    <>
      {bestNumberState != null ? (
        <ProviderStatus
          timestamp={bestNumberState.timestamp}
          parachainBlockNumber={bestNumberState.parachainBlockNumber}
          className={className}
          side="left"
        />
      ) : (
        <span className={className}>
          <Spinner size={16} />
        </span>
      )}
    </>
  )
}
