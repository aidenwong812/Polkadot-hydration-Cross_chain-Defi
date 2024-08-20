import { Text } from "components/Typography/Text/Text"
import { Button, ButtonTransparent } from "components/Button/Button"
import FullFailIcon from "assets/icons/FullFailIcon.svg?react"
import { css } from "@emotion/react"
import { useTranslation } from "react-i18next"
import { SButtons } from "./ReviewTransactionError.styled"
import { Heading } from "components/Typography/Heading/Heading"
import { useCopyToClipboard } from "react-use"
import { FC, useState } from "react"
import { useAccount } from "sections/web3-connect/Web3Connect.utils"
import { Account } from "sections/web3-connect/store/useWeb3ConnectStore"
import { useRpcProvider } from "providers/rpcProvider"

type ReviewTransactionErrorProps = {
  onClose: () => void
  onReview: () => void
  error?: unknown
}

export const ReviewTransactionError: FC<ReviewTransactionErrorProps> = ({
  onClose,
  onReview,
  error,
}) => {
  const { api } = useRpcProvider()
  const { t } = useTranslation()

  const [errorCopied, setErrorCopied] = useState(false)
  const { account } = useAccount()

  const [, copyToClipboard] = useCopyToClipboard()

  function copyError() {
    if (error) {
      copyToClipboard(
        getErrorTemplate(
          account,
          error,
          api.runtimeVersion.specVersion.toString(),
        ),
      )
      setErrorCopied(true)
    }
  }

  return (
    <div sx={{ flex: "column", align: "center", my: 40 }}>
      <FullFailIcon />
      <Heading fs={19} fw={500} tAlign="center" sx={{ mt: 20 }}>
        {t("liquidity.reviewTransaction.modal.error.title")}
      </Heading>
      <div sx={{ flex: "column", align: "center", px: 20, mt: 20 }}>
        <Text tAlign="center" fs={16} color="basic400" fw={400} lh={22}>
          {t("liquidity.reviewTransaction.modal.error.description")}
        </Text>

        <SButtons>
          <Button
            type="button"
            variant="secondary"
            sx={{ mt: 40 }}
            onClick={onClose}
            css={css`
              width: 100%;
              text-align: center;
              flex-grow: 1;
            `}
          >
            {t("liquidity.reviewTransaction.modal.error.close")}
          </Button>
        </SButtons>
        <div sx={{ flex: "row", gap: 20, mt: 10 }}>
          <ButtonTransparent
            type="button"
            sx={{ color: "brightBlue400", fontSize: 14 }}
            onClick={onReview}
          >
            {t("liquidity.reviewTransaction.modal.error.review")}
          </ButtonTransparent>
          {!!error && (
            <ButtonTransparent
              type="button"
              sx={{
                color: errorCopied ? "green400" : "brightBlue400",
                fontSize: 14,
              }}
              onClick={copyError}
            >
              {errorCopied
                ? t("liquidity.reviewTransaction.modal.error.copied")
                : t("liquidity.reviewTransaction.modal.error.copy")}
            </ButtonTransparent>
          )}
        </div>
      </div>
    </div>
  )
}

function getErrorTemplate(
  account: Account | null,
  error: unknown,
  specVersion: string = "",
) {
  let message = ""
  try {
    message =
      error instanceof Error
        ? error.message || error.toString()
        : typeof error === "object"
          ? JSON.stringify(error)
          : `${error}`
  } catch (err) {}

  return `Address: ${account?.address}\nProvider: ${account?.provider}\nMessage: ${message}\nSpec Version: ${specVersion}`
}
