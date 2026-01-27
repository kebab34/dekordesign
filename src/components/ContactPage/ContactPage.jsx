import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './ContactPage.css';

// Configuration EmailJS - À remplacer par tes identifiants
const EMAILJS_SERVICE_ID = 'service_lple8rp';
const EMAILJS_TEMPLATE_ID = 'template_vuyv4fh';
const EMAILJS_PUBLIC_KEY = '9tPG038VQ7DsyqKAq';

const ContactPage = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      formRef.current,
      EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      })
      .catch((error) => {
        setIsSubmitting(false);
        setSubmitStatus('error');
        setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
        console.error('EmailJS Error:', error);
        setTimeout(() => setSubmitStatus(null), 5000);
      });
  };

  return (
    <section className="contact-page">
      <div className="contact-header">
        <div className="gold-line"></div>
        <h2 className="contact-title">CONTACTEZ-NOUS</h2>
        <p className="contact-subtitle">Notre équipe est à votre disposition pour répondre à toutes vos questions</p>
      </div>

      <div className="contact-content">
        {/* Informations de contact */}
        <div className="contact-info">
          <h3 className="info-title">Nos Coordonnées</h3>

          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="info-content">
              <h4>Adresse</h4>
              <p>4 Bd Étienne Astegiano</p>
              <p>06150 Cannes</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="info-content">
              <h4>Téléphone</h4>
              <a href="tel:0987594858">09 87 59 48 58</a>
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
              <h4>Horaires d'ouverture</h4>
              <div className="horaires">
                <div className="horaire-row">
                  <span className="jour">Lundi</span>
                  <span className="heures">09:30–12:00, 14:00–18:30</span>
                </div>
                <div className="horaire-row">
                  <span className="jour">Mardi</span>
                  <span className="heures">09:30–12:00, 14:00–18:30</span>
                </div>
                <div className="horaire-row">
                  <span className="jour">Mercredi</span>
                  <span className="heures">09:30–12:00, 14:00–18:30</span>
                </div>
                <div className="horaire-row">
                  <span className="jour">Jeudi</span>
                  <span className="heures">09:30–12:00, 14:00–18:30</span>
                </div>
                <div className="horaire-row">
                  <span className="jour">Vendredi</span>
                  <span className="heures">09:30–12:00, 14:00–18:30</span>
                </div>
                <div className="horaire-row">
                  <span className="jour">Samedi</span>
                  <span className="heures">09:30–12:00, 14:00–18:30</span>
                </div>
                <div className="horaire-row ferme">
                  <span className="jour">Dimanche</span>
                  <span className="heures">Fermé</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="contact-form-container">
          <h3 className="form-title">Envoyez-nous un message</h3>

          {submitStatus === 'success' && (
            <div className="success-message">
              Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nom complet *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Sujet *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps */}
      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2889.8876!2d7.0194!3d43.5558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12ce81b8b8b8b8b8%3A0x0!2s4%20Bd%20%C3%89tienne%20Astegiano%2C%2006150%20Cannes!5e0!3m2!1sfr!2sfr!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation Dekor Design"
        ></iframe>
      </div>
    </section>
  );
};

export default ContactPage;
