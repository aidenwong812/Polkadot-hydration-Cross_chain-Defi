import { useTranslation } from "react-i18next"
import { TPool, TXYKPool } from "sections/pools/PoolsPage.utils"
import { useFarms } from "api/farms"
import { FarmDetailsCard } from "sections/pools/farms/components/detailsCard/FarmDetailsCard"
import { useState } from "react"
import { u32 } from "@polkadot/types"
import { Modal } from "components/Modal/Modal"
import { FarmDetailsModal } from "sections/pools/farms/modals/details/FarmDetailsModal"
import { useBestNumber } from "api/chain"
import { Text } from "components/Typography/Text/Text"
import { Separator } from "components/Separator/Separator"

export const AvailableFarms = ({ pool }: { pool: TPool | TXYKPool }) => {
  const { t } = useTranslation()
  const [selectedFarmId, setSelectedFarmId] = useState<{
    yieldFarmId: u32
    globalFarmId: u32
  } | null>(null)
  const farms = useFarms([pool.id])
  const bestNumber = useBestNumber()

  if (!farms.data?.length) return null

  const selectedFarm = farms.data.find(
    (farm) =>
      farm.globalFarm.id.eq(selectedFarmId?.globalFarmId) &&
      farm.yieldFarm.id.eq(selectedFarmId?.yieldFarmId),
  )

  const currentBlock = bestNumber.data?.relaychainBlockNumber
    .toBigNumber()
    .dividedToIntegerBy(
      selectedFarm?.globalFarm.blocksPerPeriod.toNumber() ?? 1,
    )

  const isMultipleFarms = farms.data.length > 1

  return (
    <>
      <Separator
        color="white"
        opacity={0.06}
        sx={{
          mt: 4,
          mx: "-30px",
          width: "calc(100% + 60px)",
        }}
      />
      <div sx={{ flex: "column", gap: 10 }}>
        <Text fs={18} font="GeistMono" tTransform="uppercase">
          {t("farms.modal.joinedFarms.available.label")}
        </Text>
        <div
          sx={{
            flex: ["column", isMultipleFarms ? "row" : "column"],
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {farms.data.map((farm, i) => {
            return (
              <FarmDetailsCard
                compact
                key={i}
                poolId={pool.id}
                farm={farm}
                onSelect={() => {
                  setSelectedFarmId({
                    globalFarmId: farm.globalFarm.id,
                    yieldFarmId: farm.yieldFarm.id,
                  })
                }}
              />
            )
          })}
        </div>
      </div>
      {selectedFarm && (
        <Modal
          open={true}
          onClose={() => setSelectedFarmId(null)}
          title={t("farms.modal.details.title")}
        >
          <FarmDetailsModal
            poolId={pool.id}
            farm={selectedFarm}
            depositNft={undefined}
            currentBlock={currentBlock?.toNumber()}
          />
        </Modal>
      )}
    </>
  )
}
