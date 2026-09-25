import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

const DOC_TITLES: Record<string, { en: string; fr: string }> = {
  "privacy-policy": { en: "Privacy Policy", fr: "Politique de confidentialité" },
  "terms-and-conditions": { en: "Terms and Conditions", fr: "Conditions générales" },
  "cookie-policy": { en: "Cookie Policy", fr: "Politique relative aux cookies" },
  "accessibility-statement": { en: "Accessibility Statement", fr: "Déclaration d'accessibilité" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}): Promise<Metadata> {
  const { locale, doc } = await params;
  const titles = DOC_TITLES[doc];
  if (!titles) return {};
  return {
    title: locale === "fr" ? titles.fr : titles.en,
    robots: { index: false }, // pages légales : pas de valeur SEO, on économise le crawl budget
  };
}

type LegalDoc = {
  en: { title: string; paragraphs: string[] };
  fr: { title: string; paragraphs: string[] };
};

const DOCS: Record<string, LegalDoc> = {
  "privacy-policy": {
    en: {
      title: "Privacy Policy",
      paragraphs: [
        "This demonstration site explains how personal data collected through the tracking and contact forms is processed.",
        "Only the data you submit (name, email address, parcel information) is stored in our database and is used solely to provide shipment tracking and to answer your enquiries.",
        "Data is never sold or shared with third parties. You may request access, rectification or deletion of your personal data at any time via the contact page.",
        "Cookies are limited to what is strictly necessary: session management for the administration area and language preference.",
      ],
    },
    fr: {
      title: "Politique de confidentialité",
      paragraphs: [
        "Ce site de démonstration décrit la manière dont les données personnelles collectées via les formulaires de suivi et de contact sont traitées.",
        "Seules les données que vous soumettez (nom, adresse e-mail, informations du colis) sont conservées dans notre base et utilisées uniquement pour assurer le suivi des expéditions et répondre à vos demandes.",
        "Les données ne sont jamais vendues ni partagées avec des tiers. Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment via la page contact.",
        "Les cookies se limitent au strict nécessaire : gestion de session pour l'espace d'administration et préférence de langue.",
      ],
    },
  },
  "terms-and-conditions": {
    en: {
      title: "Terms and Conditions",
      paragraphs: [
        "This platform is a technical demonstration inspired by the visuals of a logistics website; the services described are illustrative.",
        "Shipment information and tracking statuses shown here are provided for demonstration purposes and may not reflect real shipments.",
        "The site, its code and its content are provided \"as is\", without warranty of any kind. Use of the administration area is restricted to authorised personnel.",
        "Any abuse, automated scraping or attempt to disrupt the service may result in access being revoked.",
      ],
    },
    fr: {
      title: "Conditions générales",
      paragraphs: [
        "Cette plateforme est une démonstration technique inspirée des visuels d'un site logistique ; les services décrits sont illustratifs.",
        "Les informations d'expédition et les statuts de suivi affichés ici sont fournis à titre de démonstration et peuvent ne pas correspondre à des envois réels.",
        "Le site, son code et son contenu sont fournis « en l'état », sans garantie d'aucune sorte. L'accès à l'espace d'administration est réservé au personnel autorisé.",
        "Tout abus, scrap automatisé ou tentative de perturbation du service peut entraîner la révocation de l'accès.",
      ],
    },
  },
  "cookie-policy": {
    en: {
      title: "Cookie Policy",
      paragraphs: [
        "This site uses a minimal set of cookies, none of which are used for advertising.",
        "Session cookie: created when you sign in to the administration area; it is deleted when you sign out.",
        "Language preference: stored so the site can be displayed in your chosen language (English or French).",
        "You can clear cookies at any time from your browser settings without affecting the public pages.",
      ],
    },
    fr: {
      title: "Politique relative aux cookies",
      paragraphs: [
        "Ce site utilise un ensemble minimal de cookies, aucun n'étant utilisé à des fins publicitaires.",
        "Cookie de session : créé lors de la connexion à l'espace d'administration ; il est supprimé à la déconnexion.",
        "Préférence de langue : enregistrée pour afficher le site dans la langue choisie (anglais ou français).",
        "Vous pouvez supprimer les cookies à tout moment depuis les réglages de votre navigateur sans affecter les pages publiques.",
      ],
    },
  },
  "accessibility-statement": {
    en: {
      title: "Accessibility Statement",
      paragraphs: [
        "We aim to conform to WCAG 2.1 level AA across this site.",
        "Measures in place: semantic landmarks (header, nav, main, footer), visible focus states, sufficient colour contrast, alternative text on all meaningful images and keyboard-operable navigation.",
        "Limitations: the world-map visual relies on colour-coded markers supplemented by an accessible list of countries and facilities.",
        "If you encounter an accessibility barrier, please report it via the contact page so we can address it.",
      ],
    },
    fr: {
      title: "Déclaration d'accessibilité",
      paragraphs: [
        "Nous visons la conformité WCAG 2.1 niveau AA sur l'ensemble du site.",
        "Mesures en place : repères sémantiques (header, nav, main, footer), états de focus visibles, contrastes de couleurs suffisants, textes alternatifs sur toutes les images significatives et navigation utilisable au clavier.",
        "Limitations : la carte du monde repose sur des marqueurs colorés, compensés par une liste accessible des pays et implantations.",
        "Si vous rencontrez un obstacle d'accessibilité, signalez-le via la page contact afin que nous puissions le corriger.",
      ],
    },
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  setRequestLocale(locale);

  const content = DOCS[doc];
  if (!content) notFound();

  const { title, paragraphs } = content[locale === "fr" ? "fr" : "en"];

  return (
    <section className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container max-w-4xl u-stack u-stack--6">
        <h1>{title}</h1>
        <div className="u-prose u-stack u-stack--4 text-md">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="text-sm text-grey-mid-02">Last updated: September 2026</p>
      </div>
    </section>
  );
}
