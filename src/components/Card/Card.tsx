import { Icon } from "components/Icon/Icon"
import { SContainer, SHeader } from "./Card.styled"
import { Text } from "components/Typography/Text/Text"

import { FC, ReactNode } from "react"

type Props = {
  title?: string
  icon?: ReactNode
  children: ReactNode
  variant?: "flat" | "primary" | "secondary" | "green"
  className?: string
}

export const Card: FC<Props> = ({
  children,
  variant = "flat",
  title,
  icon,
  className,
}) => {
  return (
    <SContainer variant={variant} className={className}>
      {title && (
        <SHeader variant={variant}>
          {icon && (
            <Icon
              sx={{
                color:
                  variant === "primary"
                    ? "pink600"
                    : variant === "green"
                      ? "white"
                      : "brightBlue300",
              }}
              icon={icon}
            />
          )}
          <Text fs={15} color="white" font="GeistMono" tTransform="uppercase">
            {title}
          </Text>
        </SHeader>
      )}
      <div
        sx={{
          p: "20px 30px 30px",
          color: "white",
          flex: "row",
          align: "end",
        }}
        css={{ flex: 1 }}
      >
        {children}
      </div>
    </SContainer>
  )
}
