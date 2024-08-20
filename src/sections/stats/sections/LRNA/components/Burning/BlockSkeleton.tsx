import Skeleton from "react-loading-skeleton"

export const BlockSkeleton = () => {
  return (
    <div sx={{ textAlign: "center" }}>
      <Skeleton width={200} height={30} />
      <Skeleton width={100} height={10} />
    </div>
  )
}
