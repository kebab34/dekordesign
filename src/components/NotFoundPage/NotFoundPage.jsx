import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const links = [
    { to: '/collections', label: t('nav.collections') },
    { to: '/sanitaire', label: t('nav.bathroom') },
    { to: '/cuisines', label: t('nav.kitchens') },
    { to: '/menuiserie', label: t('nav.joinery') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <section className="nf-page">
      <Helmet>
        <title>{`${t('notFound.title')} | DekorDesign`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <span className="nf-code">404</span>
      <div className="nf-line"></div>
      <h1 className="nf-title">{t('notFound.title')}</h1>
      <p className="nf-text">{t('notFound.text')}</p>
      <Link to="/" className="nf-home">{t('notFound.home')}</Link>
      <div className="nf-links">
        {links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
      </div>
    </section>
  );
};

export default NotFoundPage;
