import styled from "@emotion/styled"
import { ButtonTransparent } from "components/Button/Button"
import { theme } from "theme"

export const SProviderContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  padding-top: 12px;

  @media ${theme.viewport.gte.sm} {
    gap: 12px;
  }
`

export const SProviderButton = styled(ButtonTransparent)`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  gap: 4px;

  padding: 16px 12px;

  border: none;
  border-radius: ${theme.borderRadius.medium}px;

  transition: background ${theme.transitions.default};
  cursor: pointer;

  background: rgba(${theme.rgbColors.primaryA06}, 0.06);

  border: 1px solid transparent;

  &:hover {
    background: rgba(${theme.rgbColors.primaryA15}, 0.12);
    border: 1px solid rgba(${theme.rgbColors.brightBlue300}, 0.12);
  }

  &:active {
    background: rgba(${theme.rgbColors.brightBlue100}, 0.35);
  }

  @media ${theme.viewport.gte.sm} {
    padding: 24px 16px;
  }
`

export const SAltProviderButton = styled(ButtonTransparent)`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${theme.colors.basic400};

  font-size: 14px;

  padding: 4px 12px;

  width: 100%;

  border-radius: 4px;
  border: 1px solid rgba(${theme.rgbColors.brightBlue300}, 0.12);

  &:hover {
    color: ${theme.colors.brightBlue300};
  }

  @media ${theme.viewport.gte.sm} {
    border: 0;
    padding: 0;
  }
`

export const SExpandButton = styled(ButtonTransparent)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: ${theme.colors.basic400};

  svg {
    transition: ${theme.transitions.default};
  }

  &[aria-expanded="true"] {
    svg {
      transform: rotate(180deg);
    }
  }

  &:hover {
    color: ${theme.colors.brightBlue300};
`
