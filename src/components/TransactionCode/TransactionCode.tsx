import { forwardRef } from "react"
import ReactJson, { ReactJsonViewProps } from "react-json-view"
import { theme } from "theme"

export const TransactionCode = forwardRef<HTMLDivElement, ReactJsonViewProps>(
  (props, ref) => (
    <div ref={ref}>
      <ReactJson
        indentWidth={4}
        collapseStringsAfterLength={42}
        quotesOnKeys={false}
        shouldCollapse={false}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        theme={{
          base00: `transparent`,
          base01: "#ddd",
          base02: `rgba(${theme.rgbColors.alpha0}, .06)`,
          base03: "white",
          base04: "purple",
          base05: "white",
          base06: "white",
          base07: theme.colors.basic100,
          base08: "#444",
          base09: theme.colors.brightBlue200Alpha,
          base0A: theme.colors.basic500,
          base0B: "rgba(70, 70, 230, 0)",
          base0C: theme.colors.basic500,
          base0D: theme.colors.warning300,
          base0E: theme.colors.basic100,
          base0F: theme.colors.brightBlue200Alpha,
        }}
        {...props}
        style={{
          fontVariant: "tabular-nums",
          fontFamily: "Geist",
          fontSize: "12px",
          position: "relative",
        }}
      />
    </div>
  ),
)
