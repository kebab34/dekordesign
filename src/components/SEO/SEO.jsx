import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical, image }) => {
  const siteName = 'DekorDesign';
  const defaultDesc = 'DekorDesign — Carrelages, sanitaires, meubles de salle de bain, cuisines, menuiserie et pergolas. Showroom à Cannes.';
  const defaultImage = 'https://dekordesign.fr/logo-dekor.png';
  const baseUrl = 'https://dekordesign.fr';

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Carrelage & Aménagement Intérieur Cannes`;
  const desc = description || defaultDesc;
  const img = image || defaultImage;
  const url = canonical ? `${baseUrl}${canonical}` : baseUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {/* General */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="geo.region" content="FR-06" />
      <meta name="geo.placename" content="Cannes" />
    </Helmet>
  );
};

export default SEO;
