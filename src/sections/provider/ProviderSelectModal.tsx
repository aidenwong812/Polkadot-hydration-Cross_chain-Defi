import { useProviderRpcUrlStore } from "api/provider"
import { Modal } from "components/Modal/Modal"
import { useState } from "react"

import { Switch } from "components/Switch/Switch"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { ProviderSelectForm } from "sections/provider/ProviderSelectForm"
import { useRpcStore } from "state/store"
import { SSwitchContainer } from "./ProviderSelectModal.styled"
import { DeleteModal } from "./components/DeleteModal/DeleteModal"
import { Button } from "components/Button/Button"

export function ProviderSelectModal(props: {
  open: boolean
  onClose: () => void
}) {
  const { setRpcUrl, autoMode, setAutoMode } = useProviderRpcUrlStore()
  const [removeRpcUrl, setRemoveRpcUrl] = useState<string | undefined>()
  const { t } = useTranslation()
  const { removeRpc } = useRpcStore()

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        title={t("rpc.change.modal.title")}
        headerVariant="GeistMono"
      >
        <SSwitchContainer
          sx={{
            flex: "row",
            align: "center",
            justify: "space-between",
            gap: 10,
          }}
        >
          <div sx={{ maxWidth: 280 }}>
            <Text fs={13} sx={{ mb: 4 }}>
              {t("rpc.change.modal.autoMode.title")}
            </Text>
            <Text color="basic400" fs={12}>
              {t("rpc.change.modal.autoMode.desc")}
            </Text>
          </div>
          <div sx={{ flex: "row", align: "center", gap: 8 }}>
            <Text fs={11} color="basic400">
              {autoMode
                ? t("rpc.change.modal.autoMode.enabled")
                : t("rpc.change.modal.autoMode.disabled")}
            </Text>
            <Switch
              name="rpc-auto-mode"
              value={autoMode}
              onCheckedChange={setAutoMode}
            />
          </div>
        </SSwitchContainer>

        <div sx={{ pt: 12 }}>
          {autoMode ? (
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                props.onClose()
              }}
            >
              {t("rpc.change.modal.close")}
            </Button>
          ) : (
            <>
              <ProviderSelectForm
                onSave={(rpcUrl) => {
                  setRpcUrl(rpcUrl)
                }}
                onRemove={(rpc) => {
                  setRemoveRpcUrl(rpc)
                }}
                onClose={props.onClose}
              />
              {!!removeRpcUrl && (
                <DeleteModal
                  onBack={() => setRemoveRpcUrl(undefined)}
                  onConfirm={() => {
                    removeRpc(removeRpcUrl)
                    setRemoveRpcUrl(undefined)
                  }}
                />
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  )
}
