import React from 'react';
import { Link } from 'react-router-dom';
import LegalLayout from './LegalLayout';
import { company, fullAddress, SITE_URL } from '../../config/company';

// Ligne « libellé / valeur » affichée uniquement si la valeur est renseignée
const Row = ({ label, value }) => (value ? <><dt>{label}</dt><dd>{value}</dd></> : null);

const MentionsLegales = () => (
  <LegalLayout
    title="Mentions légales"
    seoDescription="Mentions légales du site DekorDesign : éditeur, hébergement, propriété intellectuelle."
    canonical="/mentions-legales"
    updated="27 octobre 2026"
  >
    <div className="legal-section">
      <h2>Éditeur du site</h2>
      <dl className="legal-dl">
        <Row label="Nom commercial" value={company.brand} />
        <Row label="Raison sociale" value={company.legalName} />
        <Row label="Forme juridique" value={company.legalForm} />
        <Row label="SIRET" value={company.siret} />
        <Row label="RCS" value={company.rcs} />
        <Row label="N° TVA intracommunautaire" value={company.vatNumber} />
        <Row label="Adresse" value={`${fullAddress}, ${company.address.country}`} />
        <Row label="Téléphone" value={company.phone} />
        <Row label="E-mail" value={company.email} />
        <Row label="Directeur de la publication" value={company.publicationDirector} />
      </dl>
    </div>

    <div className="legal-section">
      <h2>Hébergement</h2>
      {company.hosts.map(h => (
        <p key={h.name}>
          <strong>{h.role}</strong> : {h.name}, {h.address} — <a href={h.url} target="_blank" rel="noopener noreferrer">{h.url.replace('https://', '')}</a>
        </p>
      ))}
    </div>

    <div className="legal-section">
      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble du contenu du site {SITE_URL.replace('https://', '')} (textes, mise en page, logo, éléments graphiques)
        est la propriété de {company.legalName || company.brand}, sauf mention contraire. Toute reproduction ou
        représentation, totale ou partielle, sans autorisation écrite préalable est interdite.
      </p>
      <p>
        Les visuels et fiches techniques des produits sont la propriété de leurs fabricants respectifs
        (Bien Seramik, Kobos, Soprano, Atölye Mutfak, Aderka, Genius Pergola, Mikapen…) et sont reproduits
        dans le cadre de la présentation de leurs produits par notre showroom.
      </p>
    </div>

    <div className="legal-section">
      <h2>Informations produits</h2>
      <p>
        Les photographies, coloris, formats et caractéristiques sont fournis à titre indicatif et peuvent
        varier selon les séries de fabrication et l'écran utilisé. Le site présente un catalogue et ne permet
        pas la vente en ligne : seuls les devis établis par notre showroom ont une valeur contractuelle.
      </p>
    </div>

    <div className="legal-section">
      <h2>Données personnelles</h2>
      <p>
        Le traitement des données transmises via le formulaire de contact est détaillé dans notre{' '}
        <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>
    </div>
  </LegalLayout>
);

export default MentionsLegales;
