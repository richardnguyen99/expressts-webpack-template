const defaultMeta = {
  title: "ExWt",
  description: "ExpressTS Webpack Template",
  image: `${process.env.BASE_URL}/public/assets/images/logo.png`,
  url: `${process.env.BASE_URL}/`,
  "og:title": "Home | ExWt",
  "og:type": "website",
  "og:url": `${process.env.BASE_URL}/`,
  "og:description": "ExpressTS Webpack Template",
  "og:site_name": "ExWt",
  "twitter:card": "summary",
  "twitter:site": "@exwt",
  "twitter:creator": "@exwt",
};

type Meta = typeof defaultMeta;

export const getMeta = (meta: Partial<Meta>) => {
  return { ...defaultMeta, ...meta };
}
