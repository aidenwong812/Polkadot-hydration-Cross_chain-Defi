import { Button } from "components/Button/Button"
import { DollarAssetValue } from "components/DollarAssetValue/DollarAssetValue"
import { Text } from "components/Typography/Text/Text"
import { useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import {
  TMiningNftPosition,
  useXYKDepositValues,
} from "sections/pools/PoolsPage.utils"
import { useEnteredDate } from "utils/block"
import { BN_0 } from "utils/constants"
import { JoinedFarmsDetails } from "sections/pools/farms/modals/joinedFarmDetails/JoinedFarmsDetails"
import { SSeparator, SValueContainer } from "./FarmingPosition.styled"
import { useDepositShare } from "./FarmingPosition.utils"
import { JoinedFarms } from "./joined/JoinedFarms"
import { RedepositFarms } from "./redeposit/RedepositFarms"
import { DisplayValue } from "components/DisplayValue/DisplayValue"
import { LrnaPositionTooltip } from "sections/pools/components/LrnaPositionTooltip"
import { useRpcProvider } from "providers/rpcProvider"
import { useFarmExitAllMutation } from "utils/farms/exit"
import { TOAST_MESSAGES } from "state/toasts"
import { ToastMessage } from "state/store"
import { useAccount } from "sections/web3-connect/Web3Connect.utils"
import ExitIcon from "assets/icons/Exit.svg?react"
import { Icon } from "components/Icon/Icon"
import { Farm } from "api/farms"

function FarmingPositionDetailsButton(props: {
  poolId: string
  depositNft: TMiningNftPosition
}) {
  const { t } = useTranslation()
  const [farmDetails, setFarmDetails] = useState(false)

  return (
    <>
      <Button
        size="compact"
        onClick={() => setFarmDetails(true)}
        css={{ flex: "1 0 0 " }}
      >
        {t("farms.positions.joinedFarms.button.label")}
      </Button>

      {farmDetails && (
        <JoinedFarmsDetails
          poolId={props.poolId}
          depositNft={props.depositNft}
          isOpen={farmDetails}
          onClose={() => setFarmDetails(false)}
        />
      )}
    </>
  )
}

const ExitFarmsButton = (props: {
  poolId: string
  depositNft: TMiningNftPosition
}) => {
  const { t } = useTranslation()
  const { assets } = useRpcProvider()
  const { account } = useAccount()

  const meta = assets.getAsset(props.poolId.toString())

  const toast = TOAST_MESSAGES.reduce((memo, type) => {
    const msType = type === "onError" ? "onLoading" : type
    memo[type] = (
      <Trans
        t={t}
        i18nKey={`farms.modal.exit.toast.${msType}`}
        tOptions={{
          amount: props.depositNft.data.shares.toBigNumber(),
          fixedPointScale: meta.decimals,
        }}
      >
        <span />
        <span className="highlight" />
      </Trans>
    )
    return memo
  }, {} as ToastMessage)

  const exit = useFarmExitAllMutation([props.depositNft], props.poolId, toast)

  return (
    <Button
      size="compact"
      variant="error"
      onClick={() => exit.mutate()}
      isLoading={exit.isLoading}
      disabled={exit.isLoading || account?.isExternalWalletConnected}
      css={{ flex: "1 0 0 " }}
    >
      <Icon icon={<ExitIcon />} />
      {t("farms.positions.exitFarms.button.label")}
    </Button>
  )
}

export const FarmingPosition = ({
  index,
  poolId,
  depositNft,
  availableYieldFarms,
}: {
  index: number
  poolId: string
  depositNft: TMiningNftPosition
  availableYieldFarms: Farm[]
}) => {
  const { t } = useTranslation()
  const { assets } = useRpcProvider()

  const meta = assets.getAsset(poolId)
  const isXYK = assets.isShareToken(meta)

  // use latest entry date
  const enteredDate = useEnteredDate(
    depositNft.data.yieldFarmEntries.reduce(
      (acc, curr) =>
        acc.lt(curr.enteredAt.toBigNumber())
          ? curr.enteredAt.toBigNumber()
          : acc,
      BN_0,
    ),
  )

  return (
    <>
      <div
        sx={{ flex: ["column", "row"], gap: [6, 0], justify: "space-between" }}
      >
        <Text fw={[500, 400]}>
          {t("farms.positions.position.title", { index })}
        </Text>
        <div sx={{ flex: "row", gap: 8 }}>
          <ExitFarmsButton poolId={poolId} depositNft={depositNft} />
          <FarmingPositionDetailsButton
            poolId={poolId}
            depositNft={depositNft}
          />
        </div>
      </div>

      <div
        sx={{
          flex: "row",
          justify: "space-between",
          align: "center",
          py: [0, 10],
        }}
      >
        <JoinedFarms poolId={poolId} depositNft={depositNft} />
      </div>
      <SSeparator sx={{ width: "70%", mx: "auto" }} />

      <div
        sx={{
          flex: "column",
          gap: 10,
          py: 10,
        }}
      >
        <SValueContainer>
          <Text color="basic500" fs={14} lh={16}>
            {t("farms.positions.labels.enterDate")}
          </Text>
          <Text fs={14}>
            {t("farms.positions.labels.enterDate.value", {
              date: enteredDate.data,
            })}
          </Text>
        </SValueContainer>
        <SSeparator />
        {isXYK ? (
          <XYKFields depositNft={depositNft} />
        ) : (
          <OmnipoolFields poolId={poolId} depositNft={depositNft} />
        )}
      </div>

      {availableYieldFarms.length ? (
        <RedepositFarms
          poolId={poolId}
          depositNft={depositNft}
          availableYieldFarms={availableYieldFarms}
        />
      ) : null}
    </>
  )
}

const OmnipoolFields = ({
  poolId,
  depositNft,
}: {
  poolId: string
  depositNft: TMiningNftPosition
}) => {
  const { t } = useTranslation()
  const position = useDepositShare(poolId, depositNft.id.toString())

  const { meta, amountShifted, amountDisplay, valueShifted, lrnaShifted } =
    position.data ?? {}

  return (
    <>
      <SValueContainer>
        <Text color="basic500" fs={14} lh={16}>
          {t("farms.positions.labels.initialValue")}
        </Text>
        <div sx={{ flex: "column", align: "flex-end" }}>
          <Text fs={14}>
            {t("value.tokenWithSymbol", {
              value: amountShifted,
              symbol: meta?.symbol,
            })}
          </Text>
          <Text fs={11} css={{ color: "rgba(221, 229, 255, 0.61)" }}>
            <DisplayValue value={amountDisplay} />
          </Text>
        </div>
      </SValueContainer>
      <SSeparator />
      <SValueContainer>
        <div sx={{ flex: "row" }}>
          <Text color="basic500" fs={14} lh={16}>
            {t("farms.positions.labels.currentValue")}
          </Text>
          <LrnaPositionTooltip
            assetId={meta?.id}
            tokenPosition={valueShifted}
            lrnaPosition={lrnaShifted}
          />
        </div>

        {position.data && (
          <div sx={{ flex: "column", align: "flex-end" }}>
            <Text fs={14}>
              {t("value.tokenWithSymbol", {
                value: position.data.totalValueShifted,
                symbol: meta?.symbol,
              })}
            </Text>
            <DollarAssetValue
              value={position.data.valueDisplay}
              wrapper={(children) => (
                <Text fs={11} lh={12} color="whiteish500">
                  {children}
                </Text>
              )}
            >
              <DisplayValue value={position.data.valueDisplay} />
            </DollarAssetValue>
          </div>
        )}
      </SValueContainer>
    </>
  )
}

const XYKFields = ({ depositNft }: { depositNft: TMiningNftPosition }) => {
  const { t } = useTranslation()
  const { amountUSD, assetA, assetB } =
    useXYKDepositValues([depositNft]).data?.[0] ?? {}

  return (
    <SValueContainer>
      <Text color="basic500" fs={14} lh={16}>
        {t("farms.positions.labels.currentValue")}
      </Text>
      <div sx={{ flex: "column", align: "flex-end" }}>
        <Text fs={14}>
          {t("value.tokenWithSymbol", {
            value: assetA?.amount,
            symbol: assetA?.symbol,
          })}{" "}
          |{" "}
          {t("value.tokenWithSymbol", {
            value: assetB?.amount,
            symbol: assetB?.symbol,
          })}
        </Text>
        <Text fs={11} css={{ color: "rgba(221, 229, 255, 0.61)" }}>
          <DisplayValue value={amountUSD} />
        </Text>
      </div>
    </SValueContainer>
  )
}
