import React from 'react';
import { Link } from 'react-router-dom';
import LegalLayout from './LegalLayout';
import { company, fullAddress } from '../../config/company';

const Confidentialite = () => (
  <LegalLayout
    title="Confidentialité"
    seoDescription="Politique de confidentialité de DekorDesign : données collectées, finalités, durée de conservation et vos droits (RGPD)."
    canonical="/confidentialite"
    updated="27 octobre 2026"
  >
    <div className="legal-section">
      <h2>Responsable du traitement</h2>
      <p>
        {company.legalName || company.brand}, {fullAddress}. Pour toute question relative à vos données :{' '}
        <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    </div>

    <div className="legal-section">
      <h2>Données collectées</h2>
      <p>
        Nous ne collectons que les données que vous nous transmettez volontairement via le formulaire de
        contact ou la demande de devis : <strong>nom, adresse e-mail, téléphone (facultatif), sujet et message</strong>,
        ainsi que, le cas échéant, le produit qui vous intéresse.
      </p>
      <p>Aucun compte utilisateur n'est créé et aucun paiement n'est effectué sur le site.</p>
    </div>

    <div className="legal-section">
      <h2>Finalités et base légale</h2>
      <ul>
        <li>Répondre à votre demande d'information ou de rendez-vous ;</li>
        <li>Établir et suivre un devis (mesures précontractuelles prises à votre demande) ;</li>
        <li>Mesurer l'audience du site de manière anonyme, afin de l'améliorer (intérêt légitime).</li>
      </ul>
      <p>Vos données ne sont jamais vendues ni utilisées à des fins publicitaires.</p>
    </div>

    <div className="legal-section">
      <h2>Destinataires et sous-traitants</h2>
      <p>Vos données sont destinées uniquement à l'équipe {company.brand}. Elles transitent par :</p>
      <ul>
        <li><strong>EmailJS</strong> (emailjs.com) : acheminement du formulaire de contact vers notre messagerie ;</li>
        <li><strong>Vercel</strong> : hébergement du site et mesure d'audience anonyme, sans cookie ;</li>
        <li><strong>Cloudflare</strong> : diffusion des images et documents.</li>
      </ul>
      <p>
        Certains de ces prestataires sont situés hors de l'Union européenne ; les transferts sont encadrés par
        les clauses contractuelles types de la Commission européenne ou le Data Privacy Framework.
      </p>
    </div>

    <div className="legal-section">
      <h2>Durée de conservation</h2>
      <p>
        Les demandes de contact et de devis sont conservées <strong>3 ans</strong> à compter de notre dernier
        échange, puis supprimées. Les données d'un client sont conservées pendant la durée légale imposée
        par les obligations comptables (10 ans pour les factures).
      </p>
    </div>

    <div className="legal-section">
      <h2>Cookies et traceurs</h2>
      <p>
        Le site ne dépose <strong>aucun cookie publicitaire ni de suivi</strong>. La mesure d'audience est
        anonyme et fonctionne sans cookie. Votre choix de langue est mémorisé dans votre navigateur
        (stockage local) pour votre confort.
      </p>
      <p>
        La carte Google Maps de la page <Link to="/contact">Contact</Link> n'est chargée que si vous cliquez
        pour l'afficher : Google peut alors déposer ses propres cookies, régis par sa{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>.
      </p>
    </div>

    <div className="legal-section">
      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de
        rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Pour les
        exercer, écrivez-nous à <a href={`mailto:${company.email}`}>{company.email}</a> ; nous répondons sous un mois.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL :{' '}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">cnil.fr/fr/plaintes</a>.
      </p>
    </div>
  </LegalLayout>
);

export default Confidentialite;
