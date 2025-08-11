export default function Head() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const title = "Jelly Forge — AI 3D Icon & App Icon Generator";
  const description =
    "Turn logos into stunning 3D jelly icons with transparent backgrounds. Download high‑quality PNGs for iOS, Android, and web.";
  const ogImage = `${appUrl}/window.svg`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Jelly Forge",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: appUrl,
  };

  return (
    <>
      <meta name="theme-color" content="#0f0f23" />
      <meta name="author" content="Jelly Forge" />
      <meta name="publisher" content="Jelly Forge" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="canonical" href={appUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <meta property="og:site_name" content="Jelly Forge" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={appUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}


