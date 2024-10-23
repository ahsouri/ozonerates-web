import ogImageSrc from "@images/ozonerates_logo.png";

export const SITE = {
  title: "Ozonerates",
  tagline: "Estimating PO3 from Space",
  description: "We have established a robust relationship between ozone production rates and several geophysical parameters obtained from several intensive atmospheric composition campaigns. We have shown that satellite remote sensing data can effectively constrain these parameters, enabling us to produce the first global maps of ozone production rates with unprecedented resolution.",
  description_short: "We produce global maps of PO3 determined from space.",
  url: "https://ozonerates.space",
  author: "Amir Souri",
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "en-US",
    "@id": SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      "@type": "WebSite",
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: "en_US",
  type: "website",
  url: SITE.url,
  title: `${SITE.title}: : Official Website to Get Informed About PO3 Products Determined from Space`,
  description: "We have established a robust relationship between ozone production rates and several geophysical parameters obtained from several intensive atmospheric composition campaigns. We have shown that satellite remote sensing data can effectively constrain these parameters, enabling us to produce the first global maps of ozone production rates with unprecedented resolution.",
  image: ogImageSrc,
};
