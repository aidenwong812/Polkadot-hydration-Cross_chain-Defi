import {
  VisibilityState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { useMedia } from "react-use"
import { theme } from "theme"
import { ButtonTransparent } from "components/Button/Button"
import ChevronRightIcon from "assets/icons/ChevronRight.svg?react"
import { useMemo } from "react"
import { AssetSkeleton } from "components/Skeleton/AssetSkeleton"
import { CellSkeleton } from "components/Skeleton/CellSkeleton"

export const useOmnipoolAssetsTableSkeleton = (enableAnimation = true) => {
  const { t } = useTranslation()
  const { display } = createColumnHelper()

  const isDesktop = useMedia(theme.viewport.gte.sm)

  const columnVisibility: VisibilityState = {
    symbol: true,
    tvl: true,
    volume: isDesktop,
    fee: isDesktop,
    pol: isDesktop,
    actions: isDesktop,
  }

  const columns = useMemo(
    () => [
      display({
        id: "symbol",
        header: t("stats.pol.table.assets.header.asset"),
        cell: () => <AssetSkeleton enableAnimation={enableAnimation} />,
      }),
      display({
        id: "pol",
        header: t("stats.pol.table.assets.header.pol"),
        cell: () => <CellSkeleton enableAnimation={enableAnimation} />,
      }),
      display({
        id: "volume",
        header: t("stats.pol.table.assets.header.volume"),
        cell: () => <CellSkeleton enableAnimation={enableAnimation} />,
      }),
      display({
        id: "actions",
        cell: () => (
          <ButtonTransparent css={{ color: theme.colors.iconGray }}>
            <ChevronRightIcon />
          </ButtonTransparent>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDesktop, enableAnimation],
  )

  return useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility },
  })
}

const mockData = [1, 2, 3, 4, 5]
