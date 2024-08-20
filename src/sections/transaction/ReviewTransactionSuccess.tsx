import { Text } from "components/Typography/Text/Text"
import { Button } from "components/Button/Button"
import FullSuccessIcon from "assets/icons/FullSuccessIcon.svg?react"
import { useTranslation } from "react-i18next"
import { Heading } from "components/Typography/Heading/Heading"
import { ReviewTransactionProgress } from "./ReviewTransactionProgress"

export const ReviewTransactionSuccess = (props: { onClose: () => void }) => {
  const { t } = useTranslation()

  return (
    <>
      <div sx={{ flex: "column", align: "center", width: "100%", my: 40 }}>
        <FullSuccessIcon />
        <Heading fs={19} fw={500} tAlign="center" sx={{ mt: 20 }}>
          {t("liquidity.reviewTransaction.modal.success.title")}
        </Heading>
        <div sx={{ flex: "column", align: "center", px: 20, mt: 20, mb: 40 }}>
          <Text tAlign="center" fs={16} color="basic400" fw={400} lh={22}>
            {t("liquidity.reviewTransaction.modal.success.description")}
          </Text>

          <Button variant="secondary" sx={{ mt: 40 }} onClick={props.onClose}>
            {t("liquidity.reviewTransaction.modal.success.close")}
          </Button>
        </div>
      </div>
      <ReviewTransactionProgress duration={3} onComplete={props.onClose} />
    </>
  )
}
