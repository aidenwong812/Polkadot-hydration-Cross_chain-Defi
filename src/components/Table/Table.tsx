import { SortDirection } from "@tanstack/react-table"
import CaretIcon from "assets/icons/CaretIcon.svg?react"
import { Button, ButtonVariant } from "components/Button/Button"
import { Icon } from "components/Icon/Icon"
import { TableHeader } from "components/Table/Table.styled"
import { ReactNode } from "react"

type TableActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  isLoading?: boolean
  icon?: ReactNode
  onClick?: () => void
  className?: string
}

export const TableAction = (props: TableActionProps) => {
  return (
    <Button
      {...props}
      isLoading={props.isLoading}
      disabled={props.disabled}
      size="compact"
      variant={props.variant}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        props.onClick?.()
      }}
      css={{
        padding: "10px 12px",
        whiteSpace: "nowrap",
      }}
    >
      {props.icon && <Icon size={16} icon={props.icon} />}
      {props.children}
    </Button>
  )
}

export const TableSortHeader = (props: {
  canSort: boolean
  sortDirection?: false | SortDirection
  onSort?: (event: unknown) => void
  className?: string
  children: ReactNode
}) => {
  const { canSort, sortDirection, onSort, className, children } = props
  const isSorting =
    canSort && sortDirection !== undefined && onSort !== undefined
  const asc = sortDirection === "asc" || sortDirection === false ? 1 : 0
  const desc = sortDirection === "desc" || sortDirection === false ? 1 : 0

  return (
    <TableHeader
      canSort={canSort}
      onClick={onSort}
      className={className}
      css={{
        "&:first-of-type > div": {
          justifyContent: "flex-start",
        },
      }}
    >
      <div sx={{ flex: "row", align: "center", gap: 6, justify: "start" }}>
        {children}
        {isSorting && (
          <div sx={{ flex: "column", gap: 2 }}>
            <CaretIcon css={{ rotate: "180deg", opacity: asc }} />
            <CaretIcon css={{ opacity: desc }} />
          </div>
        )}
      </div>
    </TableHeader>
  )
}
