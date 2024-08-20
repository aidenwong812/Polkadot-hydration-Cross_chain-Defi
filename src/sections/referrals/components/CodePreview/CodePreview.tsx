import { Text } from "components/Typography/Text/Text"
import { ButtonHTMLAttributes, FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useCopyToClipboard, useLocation } from "react-use"
import {
  SContainer,
  SCopyButton,
  SPreviewBox,
  SPreviewContainer,
  SShareBox,
} from "./CodePreview.styled"
import { Button } from "components/Button/Button"
import CopyIcon from "assets/icons/CopyIcon.svg?react"
import TwitterXIcon from "assets/icons/TwitterXIcon.svg?react"
import { useTwitterShare } from "hooks/useTwitterShare"
import {
  REFERRAL_PARAM_NAME,
  REFERRAL_PROD_HOST,
  getShareUrl,
} from "./CorePreview.utils"

type Props = {
  code?: string
  hasExistingCode?: boolean
  disabled?: boolean
}

export const CodePreview: React.FC<Props> = ({
  code,
  disabled = false,
  hasExistingCode = false,
}) => {
  const { t } = useTranslation()
  const { origin } = useLocation()

  const hasCode = !!code
  const codePlaceholder = t("referrals.preview.code.placeholder")
  const codeDisplay = hasCode ? code : codePlaceholder

  const shareUrl = getShareUrl(codeDisplay, origin)

  const shareOnTwitter = useTwitterShare({
    text: t("referrals.share.tweetText"),
    url: `${REFERRAL_PROD_HOST}/${codeDisplay}`,
  })

  return (
    <SContainer disabled={disabled}>
      <SPreviewContainer>
        <SPreviewBox
          isActive={hasExistingCode}
          sx={{ flexBasis: ["100%", "65%"] }}
        >
          <div sx={{ flex: "column", gap: 8 }}>
            <Text>
              {hasExistingCode
                ? t("referrals.preview.link.existing.title")
                : t("referrals.preview.link.title")}
            </Text>
            <Text color="brightBlue300">
              {import.meta.env.VITE_ENV === "production"
                ? `${shareUrl.host}/`
                : `${shareUrl.host}${shareUrl.pathname}?${REFERRAL_PARAM_NAME}=`}
              <Text
                as="span"
                color={code ? "white" : "brightBlue300"}
                sx={{ display: "inline" }}
              >
                {codeDisplay}
              </Text>
            </Text>
          </div>
          <CopyButton disabled={!hasCode} text={shareUrl.href} />
        </SPreviewBox>
        <SPreviewBox
          isActive={hasExistingCode}
          sx={{ flexBasis: ["100%", "35%"] }}
        >
          <div sx={{ flex: "column", gap: 8 }}>
            <Text>{t("referrals.preview.code.title")}</Text>
            <Text color="brightBlue300">{codeDisplay}</Text>
          </div>

          <CopyButton disabled={!hasCode} text={code} />
        </SPreviewBox>
      </SPreviewContainer>
      <SShareBox>
        {hasExistingCode && (
          <Button
            onClick={shareOnTwitter}
            fullWidth
            variant="secondary"
            css={{
              backdropFilter: "blur(6.5px)",
            }}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              px: 35,
            }}
          >
            {t("shareOn")} <TwitterXIcon sx={{ color: "white" }} />
          </Button>
        )}
      </SShareBox>
    </SContainer>
  )
}

const CopyButton: FC<
  {
    text?: string
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ text, ...props }) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [, copyToClipboard] = useCopyToClipboard()

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => {
      setCopied(false)
    }, 5000)

    return () => {
      clearTimeout(id)
      setCopied(false)
    }
  }, [copied, text])

  function copy() {
    if (text) {
      copyToClipboard(text)
      setCopied(true)
    }
  }

  return (
    <SCopyButton
      variant={copied ? "transparent" : "primary"}
      size="micro"
      onClick={copy}
      {...props}
    >
      <CopyIcon width={12} height={12} sx={{ ml: -4 }} />
      {copied ? t("copied") : t("copy")}
    </SCopyButton>
  )
}
