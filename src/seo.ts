type Metadata = {
  title?: string
  description?: string
  image?: string
}

type MetadataMap = Record<string, Metadata>

export const SEO_METADATA = {
  index: {
    title: "Hydration - An Ocean of Liquidity",
    description:
      "Hydration is a next-gen DeFi protocol which is designed to bring an ocean of liquidity to Polkadot. Our tool for the job the Hydration - an innovative Automated Market Maker (AMM) which unlocks unparalleled efficiencies by combining all assets in a single trading pool.",
    image: "https://hydration.net/opengraph-image.png",
  },
  referrals: {
    image: "https://hydration.net/opengraph-image-ref.png",
  },
} satisfies MetadataMap
