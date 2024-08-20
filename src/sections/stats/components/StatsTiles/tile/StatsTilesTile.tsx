import IconLink from "assets/icons/LinkIcon.svg?react"
import IconMinus from "assets/icons/MinusIcon.svg?react"
import IconPlus from "assets/icons/PlusIcon.svg?react"
import { Spacer } from "components/Spacer/Spacer"
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m as motion,
} from "framer-motion"
import { Trans, useTranslation } from "react-i18next"
import { useToggle } from "react-use"
import { STATS_TILES } from "sections/stats/components/StatsTiles/StatsTiles.util"
import {
  SContainer,
  SDescription,
  SIcon,
  SLink,
  STitle,
  TILE_COLOR,
} from "./StatsTilesTile.styled"

type Props = {
  id: (typeof STATS_TILES)[number]["id"]
  link: string
  variant: keyof typeof TILE_COLOR
}

export const StatsTilesTile = ({ id, link, variant }: Props) => {
  const { t } = useTranslation()
  const [expanded, toggleExpanded] = useToggle(false)

  return (
    <SContainer variant={variant} onClick={toggleExpanded}>
      <SIcon>{expanded ? <IconMinus /> : <IconPlus />}</SIcon>
      <STitle>{t(`stats.tiles.${id}.title`)}</STitle>
      <div sx={{ width: "95%" }}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false}>
            {!expanded && (
              <motion.div {...propsDesc}>
                <SDescription>
                  {t(`stats.tiles.${id}.description`)}
                </SDescription>
              </motion.div>
            )}
            {expanded && (
              <motion.div {...propsContent}>
                <Spacer axis="vertical" size={132} />
                <SDescription>
                  <Trans t={t} i18nKey={`stats.tiles.${id}.content`}>
                    <br />
                  </Trans>
                </SDescription>
                <Spacer axis="vertical" size={20} />
                <SLink to={link}>
                  {t("stats.tiles.link")}
                  <IconLink />
                </SLink>
              </motion.div>
            )}
          </AnimatePresence>
        </LazyMotion>
      </div>
    </SContainer>
  )
}

const propsDesc = {
  key: "description",
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  transition: { duration: 0.3 },
}
const propsContent = {
  key: "content",
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3 },
}
