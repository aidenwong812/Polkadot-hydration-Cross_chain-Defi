import { useUserReferrer } from "api/referrals"
import ChainlinkIcon from "assets/icons/ChainlinkIcon.svg?react"
import { Card } from "components/Card/Card"
import { useAccount } from "sections/web3-connect/Web3Connect.utils"
import { ReferrerSignForm } from "./ReferrerSignForm"
import Skeleton from "react-loading-skeleton"
import { ReferrerInfo } from "./ReferrerInfo"
import { useTranslation } from "react-i18next"

export const ReferrerCard = () => {
  const { account } = useAccount()

  const referrer = useUserReferrer(account?.address)
  const { t } = useTranslation()

  return (
    <Card
      title={t("referrals.referrer.yourReferrer")}
      variant="secondary"
      icon={<ChainlinkIcon />}
      css={{ flexGrow: 3 }}
    >
      {referrer.isInitialLoading ? (
        <Skeleton css={{ width: "100%" }} height={38} />
      ) : referrer.data ? (
        <ReferrerInfo referrerAddress={referrer.data} />
      ) : (
        <ReferrerSignForm />
      )}
    </Card>
  )
}
