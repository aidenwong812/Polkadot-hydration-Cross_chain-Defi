import { AssetLogo } from "components/AssetIcon/AssetIcon"
import { Icon } from "components/Icon/Icon"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import TrashIcon from "assets/icons/IconRemove.svg?react"
import { useTranslation } from "react-i18next"
import { DollarAssetValue } from "components/DollarAssetValue/DollarAssetValue"
import { useState } from "react"
import { RemoveLiquidity } from "sections/pools/modals/RemoveLiquidity/RemoveLiquidity"
import { Button } from "components/Button/Button"
import { useAccount } from "sections/web3-connect/Web3Connect.utils"
import { DisplayValue } from "components/DisplayValue/DisplayValue"
import { LrnaPositionTooltip } from "sections/pools/components/LrnaPositionTooltip"
import { useRpcProvider } from "providers/rpcProvider"
import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"
import { TPoolFullData, TXYKPool } from "sections/pools/PoolsPage.utils"
import { useMedia } from "react-use"
import { theme } from "theme"
import { JoinFarmsButton } from "sections/pools/farms/modals/join/JoinFarmsButton"
import { TLPData } from "utils/omnipool"

type Props = {
  position: TLPData
  index: number
  pool: TPoolFullData
  onSuccess: () => void
}

export function LiquidityPositionRemoveLiquidity(
  props:
    | {
        pool: TPoolFullData
        position: TLPData
        onSuccess: () => void
      }
    | {
        pool: TXYKPool
        position?: never
        onSuccess: () => void
      },
) {
  const { t } = useTranslation()
  const { account } = useAccount()
  const [openRemove, setOpenRemove] = useState(false)
  return (
    <>
      <Button
        variant="error"
        size="compact"
        onClick={() => setOpenRemove(true)}
        disabled={
          account?.isExternalWalletConnected || !props.pool.canRemoveLiquidity
        }
        css={{ flex: "1 0 0" }}
      >
        <div sx={{ flex: "row", align: "center", justify: "center" }}>
          <Icon size={12} icon={<TrashIcon />} sx={{ mr: 4 }} />
          {t("remove")}
        </div>
      </Button>
      {openRemove && (
        <RemoveLiquidity
          pool={props.pool}
          isOpen={openRemove}
          onClose={() => setOpenRemove(false)}
          position={props.position}
          onSuccess={props.onSuccess}
        />
      )}
    </>
  )
}

export const LiquidityPosition = ({
  position,
  index,
  onSuccess,
  pool,
}: Props) => {
  const { t } = useTranslation()
  const { assets } = useRpcProvider()
  const meta = assets.getAsset(position.assetId)
  const isDesktop = useMedia(theme.viewport.gte.sm)

  return (
    <>
      <div sx={{ flex: "column", gap: 16 }} css={{ flex: 1 }}>
        <div
          sx={{
            flex: ["column", "row"],
            gap: [6, 0],
            justify: "space-between",
          }}
        >
          <div sx={{ flex: "row", gap: 7, align: "center" }}>
            {assets.isStableSwap(meta) ? (
              <MultipleIcons
                size={24}
                icons={meta.assets.map((asset: string) => ({
                  icon: <AssetLogo key={asset} id={asset} />,
                }))}
              />
            ) : (
              <Icon size={24} icon={<AssetLogo id={position.assetId} />} />
            )}
            <Text fs={14} color={["white", "basic100"]}>
              {t("liquidity.asset.positions.position.title", { index })}
            </Text>
          </div>
          <div
            sx={{
              flex: "row",
              gap: 12,
            }}
          >
            <JoinFarmsButton
              poolId={pool.id}
              position={position}
              onSuccess={onSuccess}
            />
            <LiquidityPositionRemoveLiquidity
              position={position}
              onSuccess={onSuccess}
              pool={pool}
            />
          </div>
        </div>

        <Separator color="white" opacity={0.06} />

        <div
          sx={{
            flex: ["column", "row"],
            justify: "space-between",
            gap: [10, 0],
          }}
        >
          <div
            sx={{
              flex: ["row", "column"],
              gap: 6,
              justify: ["space-between", "start"],
            }}
          >
            <Text fs={[13, 14]} color="whiteish500">
              {t("liquidity.asset.positions.position.initialValue")}
            </Text>
            <div sx={{ flex: "column", align: ["end", "start"] }}>
              <Text fs={[13, 16]}>
                {t("value.token", {
                  value: position.amountShifted,
                  numberSuffix: ` ${meta.symbol}`,
                })}
              </Text>
            </div>
          </div>
          <Separator
            orientation={isDesktop ? "vertical" : "horizontal"}
            color="white"
            opacity={0.06}
          />
          <div
            sx={{
              flex: ["row", "column"],
              gap: 6,
              justify: "space-between",
            }}
          >
            <div sx={{ display: "flex", gap: 6 }}>
              <Text fs={[13, 14]} color="whiteish500">
                {t("liquidity.asset.positions.position.currentValue")}
              </Text>
              <LrnaPositionTooltip
                assetId={position.assetId}
                tokenPosition={position.valueShifted}
                lrnaPosition={position.lrnaShifted}
              />
            </div>
            <div sx={{ flex: "column", align: ["end", "start"] }}>
              <Text fs={[13, 16]}>
                {t("value.token", {
                  value: position.totalValueShifted,
                  numberSuffix: ` ${meta.symbol}`,
                })}
              </Text>
              <DollarAssetValue
                value={position.valueDisplay}
                wrapper={(children) => (
                  <Text fs={[11, 12]} lh={[14, 16]} color="whiteish500">
                    {children}
                  </Text>
                )}
              >
                <DisplayValue value={position.valueDisplay} />
              </DollarAssetValue>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
