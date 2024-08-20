import UpdateMetadataIcon from "assets/icons/UpdateMetadataIcon.svg?react"
import { Button } from "components/Button/Button"
import { Modal } from "components/Modal/Modal"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  SVersion,
  SVersionArrow,
  SVersionContainer,
} from "./WalletUpgradeModal.styled"
import { useUpdateMetadataMutation } from "sections/web3-connect/upgrade/WalletUpgradeModal.utils"

export function WalletUpgradeModal() {
  const { state, mutation } = useUpdateMetadataMutation()

  const [open, setOpen] = useState(true)
  const onClose = () => setOpen(false)
  const { t } = useTranslation()

  if (!state.data || !state.data.needsUpdate) return null

  return (
    <Modal open={open} onClose={onClose} title="" disableCloseOutside>
      <div sx={{ flex: "column", align: "center", width: "100%" }}>
        <UpdateMetadataIcon />

        <Spacer size={12} />

        <Text
          fs={19}
          lh={24}
          fw={500}
          font="GeistMono"
          tAlign="center"
          tTransform="uppercase"
        >
          {t("metadata.update.title")}
        </Text>

        <Spacer size={8} />

        <Text
          tAlign="center"
          fs={16}
          lh={22}
          color="basic400"
          fw={400}
          css={{ maxWidth: 350 }}
        >
          {t("metadata.update.description")}
        </Text>

        <Spacer size={40} />

        <SVersionContainer>
          <SVersion variant="left">
            <Text color="basic400">{t("metadata.update.version.old")}</Text>
            <Text fs={20} fw={700} color="basic400">
              {state.data?.currVersion ?? "-"}
            </Text>
          </SVersion>

          <SVersionArrow>
            <svg
              width="118"
              height="11"
              viewBox="0 0 118 11"
              fill="none"
              xmlns="http://www.w3.org/2000.svg?react"
            >
              <path
                d="M0 5.5H117M117 5.5L112 0.5M117 5.5L112 10.5"
                stroke="#85D1FF"
              />
            </svg>
          </SVersionArrow>

          <SVersion variant="right">
            <Text tAlign={["left", "right"]} color="brightBlue600">
              {t("metadata.update.version.new")}
            </Text>
            <Text
              tAlign={["left", "right"]}
              fs={20}
              fw={700}
              color="brightBlue300"
            >
              {state.data?.nextVersion}
            </Text>
          </SVersion>
        </SVersionContainer>

        <Spacer size={40} />

        <div
          sx={{ flex: ["column", "row"], gap: 16, justify: "space-between" }}
          css={{ alignSelf: "stretch" }}
        >
          <Button onClick={onClose}>{t("metadata.update.cancel")}</Button>
          <Button
            variant="primary"
            isLoading={mutation.isLoading}
            onClick={() => mutation.mutateAsync().then(onClose)}
            sx={{ width: ["auto", 196] }}
          >
            {t("metadata.update.confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
