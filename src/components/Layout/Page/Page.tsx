import { Outlet, useMatchRoute, useSearch } from "@tanstack/react-location"
import { BackSubHeader } from "components/Layout/Header/BackSubHeader/BackSubHeader"
import { Header } from "components/Layout/Header/Header"
import { MobileNavBar } from "components/Layout/Header/MobileNavBar/MobileNavBar"
import { Suspense, lazy, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useMedia } from "react-use"
import {
  PoolNavigation,
  Navigation as PoolsNavigation,
} from "sections/pools/navigation/Navigation"
import { Navigation as TradeNavigation } from "sections/trade/navigation/Navigation"
import { Navigation as WalletNavigation } from "sections/wallet/navigation/Navigation"
import { theme } from "theme"
import { LINKS } from "utils/navigation"
import {
  SGradientBg,
  SPage,
  SPageContent,
  SPageInner,
  SSubHeader,
} from "./Page.styled"

type Props = {
  className?: string
}

const ReferralsConnectWrapper = lazy(async () => ({
  default: (await import("sections/referrals/ReferralsConnectWrapper"))
    .ReferralsConnectWrapper,
}))

const Transactions = lazy(async () => ({
  default: (await import("sections/transaction/Transactions")).Transactions,
}))

const Web3Connect = lazy(async () => ({
  default: (await import("sections/web3-connect/Web3Connect")).Web3Connect,
}))

const useSubheaderComponent = () => {
  const { t } = useTranslation()
  const matchRoute = useMatchRoute()
  const search = useSearch()
  const isDesktop = useMedia(theme.viewport.gte.sm)

  if (matchRoute({ to: LINKS.trade, fuzzy: true })) {
    const isBondPage = matchRoute({ to: LINKS.bond })
    return isBondPage ? (
      <BackSubHeader
        label={isDesktop ? t("bonds.details.navigation.label") : ""}
        to={LINKS.bonds}
      />
    ) : isDesktop ? (
      <TradeNavigation />
    ) : null
  }

  if (matchRoute({ to: LINKS.liquidity, fuzzy: true })) {
    return "id" in search ? <PoolNavigation /> : <PoolsNavigation />
  }

  if (matchRoute({ to: LINKS.wallet, fuzzy: true })) {
    return <WalletNavigation />
  }

  if (matchRoute({ to: LINKS.statsOmnipool })) {
    return <BackSubHeader label={t("stats.omnipool.navigation.back")} />
  }
}

export const Page = ({ className }: Props) => {
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)

  const subHeaderComponent = useSubheaderComponent()

  useEffect(() => {
    ref.current?.scrollTo({
      top: 0,
      left: 0,
    })
  }, [pathname])

  return (
    <>
      <SPage ref={ref}>
        <div
          sx={{ flex: "column", height: "100%" }}
          css={{ position: "relative" }}
        >
          <SGradientBg />
          <Header />
          <SPageContent>
            {subHeaderComponent && (
              <SSubHeader>{subHeaderComponent}</SSubHeader>
            )}
            <SPageInner className={className}>
              <Outlet />
            </SPageInner>
          </SPageContent>
          <MobileNavBar />
        </div>
      </SPage>
      <Suspense>
        <Web3Connect />
        <Transactions />
        <ReferralsConnectWrapper />
      </Suspense>
    </>
  )
}
