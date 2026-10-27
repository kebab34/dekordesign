import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../../config/company';
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, seoTitle } from '../../config/seo';

// Titre, description, URL canonique et aperçu de partage propres à chaque page.
// Les mêmes balises sont pré-générées dans le HTML de chaque page par scripts/seo/build-seo.mjs
// (marquées data-rh) : Helmet les remplace sans doublon une fois l'application chargée.

const SEO = ({ title, description, canonical, image, noindex }) => {
  const fullTitle = seoTitle(title);
  const desc = description || DEFAULT_DESCRIPTION;
  const img = image || DEFAULT_IMAGE;
  const url = `${SITE_URL}${canonical || '/'}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};

export default SEO;
