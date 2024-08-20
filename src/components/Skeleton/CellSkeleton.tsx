import Skeleton from "react-loading-skeleton"

type Props = { enableAnimation?: boolean }

export const CellSkeleton = ({ enableAnimation }: Props) => (
  <div sx={{ flex: "row" }}>
    <Skeleton width={72} height={18} enableAnimation={enableAnimation} />
  </div>
)
