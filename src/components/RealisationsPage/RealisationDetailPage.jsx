import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../SEO/SEO';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { realisations } from '../../data/realisations';
import { tileUrl } from '../../config/assets';
import { quoteUrl } from '../../config/company';
import { realisationSeo } from '../../config/seo';
import { formatDate } from './RealisationsPage';
import './RealisationsPage.css';

const RealisationDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [lightbox, setLightbox] = useState(null);
  const r = realisations.find(x => x.slug === slug);

  const photos = r ? [r.cover, ...(r.images || [])] : [];
  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = e => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, photos.length, close]);

  if (!r) return <NotFoundPage />;

  const others = realisations.filter(x => x.slug !== r.slug).slice(0, 3);

  return (
    <section className="real-page">
      <SEO {...realisationSeo(r)} />

      {lightbox !== null && (
        <div className="real-lb" onClick={close}>
          <button className="real-lb-close" onClick={close} aria-label={t('catalog.close')}>✕</button>
          <img src={tileUrl(photos[lightbox])} alt={r.title} onClick={e => e.stopPropagation()} />
          {photos.length > 1 && <span className="real-lb-count">{lightbox + 1} / {photos.length}</span>}
        </div>
      )}

      <nav className="real-breadcrumb">
        <Link to="/">{t('catalog.home')}</Link>
        <span>/</span>
        <Link to="/realisations">{t('realisations.crumb')}</Link>
        <span>/</span>
        <span>{r.title}</span>
      </nav>

      <div className="real-detail-head">
        <span className="real-meta">
          {t(`realisations.categories.${r.category}`)} · {r.city}{r.date ? ` · ${formatDate(r.date, i18n.language)}` : ''}
        </span>
        <h1 className="real-detail-title">{r.title}</h1>
        {r.description && <p className="real-detail-desc">{r.description}</p>}
      </div>

      <div className="real-gallery">
        {photos.map((key, i) => (
          <button key={key} className={`real-photo ${i === 0 ? 'real-photo--main' : ''}`} onClick={() => setLightbox(i)}>
            <img src={tileUrl(key, i === 0 ? 'lg' : 'sm')} alt={`${r.title} — ${i + 1}`} loading={i < 3 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>

      {r.products?.length > 0 && (
        <div className="real-products">
          <h2>{t('realisations.productsUsed')}</h2>
          <div>
            {r.products.map(p => <Link key={p.to} to={p.to}>{p.label} →</Link>)}
          </div>
        </div>
      )}

      <div className="real-bottom">
        <p>{t('realisations.yourProject')}</p>
        <Link to={quoteUrl(`Projet similaire à « ${r.title} »`)} className="real-btn">{t('catalog.requestQuote')}</Link>
      </div>

      {others.length > 0 && (
        <div className="real-others">
          <h2>{t('realisations.others')}</h2>
          <div className="real-grid">
            {others.map(o => (
              <Link key={o.slug} to={`/realisations/${o.slug}`} className="real-card">
                <div className="real-img"><img src={tileUrl(o.cover, 'sm')} alt={o.title} loading="lazy" /></div>
                <div className="real-info"><h3 className="real-name">{o.title}</h3></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RealisationDetailPage;
