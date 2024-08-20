import { FC, PropsWithChildren, useState } from "react"
import { useLocation } from "react-use"
import {
  MIGRATION_LS_KEYS,
  MIGRATION_QUERY_PARAM,
  MIGRATION_TARGET_DOMAIN,
  MIGRATION_TRIGGER_DOMAIN,
  serializeLocalStorage,
} from "sections/migration/MigrationProvider.utils"
import { MigrationExportModal } from "./components/MigrationExportModal"
import { MigrationImportModal } from "./components/MigrationImportModal"

export const MigrationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { search, host } = useLocation()

  const [migrationCanceled, setMigrationCanceled] = useState(false)

  const paramKey = `?${MIGRATION_QUERY_PARAM}=`
  const data = search?.replace(paramKey, "") ?? ""

  const shouldExport = MIGRATION_TRIGGER_DOMAIN === host
  const shouldImport =
    MIGRATION_TARGET_DOMAIN === host && search?.startsWith(paramKey)

  if (shouldImport) {
    return <MigrationImportModal data={data} />
  }

  if (shouldExport && !migrationCanceled) {
    return (
      <MigrationExportModal
        data={serializeLocalStorage(MIGRATION_LS_KEYS)}
        onCancel={() => {
          const qs = new URLSearchParams(search)
          const from = qs.get("from")

          if (from) {
            window.location.href = `https://${from}`
          } else {
            setMigrationCanceled(true)
          }
        }}
      />
    )
  }

  return <>{children}</>
}
