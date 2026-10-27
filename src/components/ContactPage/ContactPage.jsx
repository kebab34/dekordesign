import React, { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../SEO/SEO';
import emailjs from '@emailjs/browser';
import { company } from '../../config/company';
import './ContactPage.css';
import { PAGE_SEO } from '../../config/seoPages';

// Configuration EmailJS
const EMAILJS_SERVICE_ID = 'service_lple8rp';
const EMAILJS_TEMPLATE_ID = 'template_vuyv4fh';
const EMAILJS_PUBLIC_KEY = '9tPG038VQ7DsyqKAq';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(`${company.address.street}, ${company.address.postalCode} ${company.address.city}`)}&output=embed`;

const ContactPage = () => {
  const { t } = useTranslation();
  const formRef = useRef();
  const [searchParams] = useSearchParams();
  // Demande de devis depuis une fiche produit : /contact?produit=Nom%20du%20produit
  const product = searchParams.get('produit') || '';

  const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' };
  const [formData, setFormData] = useState(() => product ? {
    ...emptyForm,
    subject: t('contact.quoteSubject', { product }),
    message: t('contact.quoteMessage', { product }),
  } : emptyForm);
  const [consent, setConsent] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData(emptyForm);
        setConsent(false);
        setTimeout(() => setSubmitStatus(null), 6000);
      })
      .catch((error) => {
        setIsSubmitting(false);
        setSubmitStatus('error');
        console.error('EmailJS Error:', error);
        setTimeout(() => setSubmitStatus(null), 6000);
      });
  };

  return (
    <section className="contact-page">
      <SEO {...PAGE_SEO['/contact']} canonical="/contact" />
      <div className="contact-header">
        <div className="gold-line"></div>
        <h1 className="contact-title">{t('contact.title')}</h1>
        <p className="contact-subtitle">{t('contact.subtitle')}</p>
      </div>

      <div className="contact-content">
        {/* Informations de contact */}
        <div className="contact-info">
          <h2 className="info-title">{t('contact.details')}</h2>

          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>{t('contact.address')}</h3>
              <p>{company.address.street}</p>
              <p>{company.address.postalCode} {company.address.city}</p>
              <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer">{t('footer.directions')} →</a>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>{t('contact.phoneEmail')}</h3>
              <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>{t('contact.hours')}</h3>
              <div className="horaires">
                {DAYS.map(day => {
                  const slots = company.hours[day] || [];
                  return (
                    <div key={day} className={`horaire-row ${slots.length ? '' : 'ferme'}`}>
                      <span className="jour">{t(`contact.days.${day}`)}</span>
                      <span className="heures">{slots.length ? slots.map(s => s.join('–')).join(', ') : t('contact.closed')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="contact-form-container">
          <h2 className="form-title">{product ? t('contact.quoteTitle') : t('contact.formTitle')}</h2>
          {product && <p className="contact-product">{t('contact.quoteFor')} <strong>{product}</strong></p>}

          {submitStatus === 'success' && <div className="success-message" role="status">{t('contact.success')}</div>}
          {submitStatus === 'error' && (
            <div className="error-message" role="alert">
              {t('contact.error')} <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
          )}

          <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">{t('contact.name')} *</label>
                <input type="text" id="name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t('contact.email')} *</label>
                <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">{t('contact.phone')}</label>
                <input type="tel" id="phone" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="subject">{t('contact.subject')} *</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">{t('contact.message')} *</label>
              <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required></textarea>
            </div>

            <label className="form-consent">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required />
              <span>
                {t('contact.consent')} <Link to="/confidentialite">{t('contact.privacyLink')}</Link>.
              </span>
            </label>

            <button type="submit" className="submit-btn" disabled={isSubmitting || !consent}>
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps : chargée seulement sur demande (aucun cookie Google sans action du visiteur) */}
      <div className="contact-map">
        {showMap ? (
          <iframe
            src={MAP_EMBED}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('contact.mapTitle')}
          ></iframe>
        ) : (
          <div className="map-placeholder">
            <p>{company.address.street}, {company.address.postalCode} {company.address.city}</p>
            <div className="map-actions">
              <button type="button" onClick={() => setShowMap(true)}>{t('contact.showMap')}</button>
              <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer">{t('contact.openMaps')}</a>
            </div>
            <span className="map-note">{t('contact.mapNote')}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactPage;
