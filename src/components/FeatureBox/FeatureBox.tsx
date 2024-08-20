import { FC, ReactNode } from "react"
import { Text } from "components/Typography/Text/Text"
import { SContainer } from "./FeatureBox.styled"

type FeatureBoxProps = {
  label?: ReactNode
  secondaryLabel?: ReactNode
  title: ReactNode
  description?: string
  bordered?: boolean
  className?: string
}

export const FeatureBox: FC<FeatureBoxProps> = ({
  label,
  secondaryLabel,
  title,
  description,
  bordered = false,
  className,
}) => (
  <SContainer bordered={bordered} className={className}>
    <div
      sx={{
        flex: "row",
        justify: "space-between",
        align: "center",
        flexWrap: "wrap",
      }}
    >
      {label && typeof label === "string" ? (
        <Text fs={14} color="basic300" css={{ whiteSpace: "nowrap" }}>
          {label}
        </Text>
      ) : (
        label
      )}
      {secondaryLabel}
    </div>

    <div>{title}</div>
    {description && (
      <Text color="darkBlue200" sx={{ mt: 6 }} lh={22}>
        {description}
      </Text>
    )}
  </SContainer>
)
