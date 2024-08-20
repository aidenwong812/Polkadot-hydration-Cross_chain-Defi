import HydraLogoFull from "assets/icons/HydraLogoFull.svg?react"
import { Icon } from "components/Icon/Icon"
import { SHeader } from "components/Layout/Header/Header.styled"
import { useVisibleElements } from "hooks/useVisibleElements"
import { useMedia } from "react-use"
import { theme } from "theme"
import { Link, useMatchRoute, useSearch } from "@tanstack/react-location"
import { LINKS, resetSearchParams } from "utils/navigation"
import { Suspense, lazy } from "react"
import HydraLogo from "assets/icons/HydraLogo.svg?react"

const HeaderBanners = lazy(async () => ({
  default: (await import("components/Layout/Header/banners/HeaderBanners"))
    .HeaderBanners,
}))

const HeaderMenu = lazy(async () => ({
  default: (await import("components/Layout/Header/menu/HeaderMenu"))
    .HeaderMenu,
}))

const HeaderToolbar = lazy(async () => ({
  default: (await import("components/Layout/Header/toolbar/HeaderToolbar"))
    .HeaderToolbar,
}))

export const Header = () => {
  const search = useSearch()
  const matchRoute = useMatchRoute()

  const isMediumMedia = useMedia(theme.viewport.lt.md)

  const { hiddenElementsKeys, observe } = useVisibleElements()

  const isSubmitTransactionPath = matchRoute({ to: LINKS.submitTransaction })

  return (
    <div css={{ position: "sticky", top: 0, zIndex: 5 }}>
      {!isSubmitTransactionPath && (
        <Suspense>
          <HeaderBanners />
        </Suspense>
      )}
      <SHeader>
        <div sx={{ flex: "row", justify: "space-between", align: "center" }}>
          <div sx={{ flex: "row", align: "center", gap: 40 }}>
            <Link
              to={
                isSubmitTransactionPath ? LINKS.submitTransaction : LINKS.swap
              }
              search={resetSearchParams(search)}
            >
              <Icon
                sx={{ color: "white" }}
                icon={
                  !isMediumMedia ? (
                    <HydraLogoFull />
                  ) : (
                    <Icon size={24} icon={<HydraLogo />} />
                  )
                }
              />
            </Link>
            {!isSubmitTransactionPath && (
              <Suspense>
                <HeaderMenu ref={observe} />
              </Suspense>
            )}
          </div>
          <Suspense>
            <HeaderToolbar menuItems={hiddenElementsKeys} />
          </Suspense>
        </div>
      </SHeader>
    </div>
  )
}
