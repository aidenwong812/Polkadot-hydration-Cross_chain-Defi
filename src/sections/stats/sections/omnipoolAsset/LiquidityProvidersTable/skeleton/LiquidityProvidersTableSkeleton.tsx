import { TableStatsSkeleton } from "components/Table/TableSkeleton"
import { useTranslation } from "react-i18next"
import { useLiquidityProvidersTableSkeleton } from "./LiquidityProvidersTableSkeleton.utils"
import { Icon } from "components/Icon/Icon"
import { Text } from "components/Typography/Text/Text"
import TitleIcon from "assets/icons/StakingTableIcon.svg?react"

export const LiquidityProvidersTableSkeleton = () => {
  const { t } = useTranslation()
  const table = useLiquidityProvidersTableSkeleton()

  return (
    <TableStatsSkeleton
      table={table}
      title={
        <div sx={{ flex: "row", align: "center", gap: 12 }}>
          <Icon sx={{ color: "white" }} icon={<TitleIcon />} />
          <Text fs={[15, 19]} lh={20} color="white" font="GeistMono">
            {t("stats.omnipool.table.providers.title")}
          </Text>
        </div>
      }
    />
  )
}
