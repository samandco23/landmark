# 🚀 Déploiement Vercel — Guide complet

Ce projet est une application **Next.js 14 (App Router)** avec **Prisma + PostgreSQL**, **NextAuth** (admin) et **next-intl** (fr/en). Ce guide couvre tout le processus, de la mise sur GitHub au domaine personnalisé.

> ⚠️ **Important** : le projet a été migré de SQLite vers **PostgreSQL** — Vercel est serverless et ne peut pas héberger de base de données fichier. La base vit chez un provider managé (Neon recommandé, gratuit).

---

## 1. Prérequis

- Un compte [GitHub](https://github.com) (gratuit)
- Un compte [Vercel](https://vercel.com/signup) (gratuit, plan Hobby suffisant) — *continuer avec GitHub*
- Un compte [Neon](https://neon.tech) (gratuit, 0,5 Go) ou Supabase / Vercel Postgres

---

## 2. Pousser le code sur GitHub

```bash
cd logistics-app
git init
git add .
git commit -m "Initial commit: Landmark Global logistics platform"
```

Puis créez un dépôt **privé** sur github.com (⚠️ privé : le projet contient le logo et le design de Landmark Global), et :

```bash
git branch -M main
git remote add origin git@github.com:samandco23/landmark.git
git push -u origin main
```

> Le `.gitignore` exclut déjà `node_modules`, `.next`, `.env` et les bases de données locales.

---

## 3. Créer la base PostgreSQL (Neon)

1. Sur [neon.tech](https://neon.tech) → **New Project** → nom : `logistics-app`, région la plus proche (ex. *Europe Central (Frankfurt)*).
2. Une fois créé, le dashboard affiche la **connection string** :
   ```
   postgresql://user:password@ep-xxx-123.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Copiez-la — c'est votre `DATABASE_URL` de production.

> Alternatives : Supabase (onglet Database → Connection string → URI), ou Vercel Marketplace → **Storage → Neon** (intégration en 1 clic, la variable est ajoutée automatiquement).

---

## 4. Créer les migrations sur la base de production

La commande `build` exécute automatiquement `prisma migrate deploy` (qui applique le dossier `prisma/migrations/` déjà committé). **Aucune action manuelle n'est requise à chaque déploiement.**

Pour la première mise en place (ou après un changement de schéma), appliquez les migrations depuis votre machine :

```bash
# .env local pointé temporairement vers la base de prod
DATABASE_URL="postgresql://…neon.tech/neondb?sslmode=require" npx prisma migrate deploy
```

---

## 5. Importer le projet dans Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → sélectionnez `logistics-app`.
2. **Framework Preset** : Next.js (détecté automatiquement). Ne touchez pas aux commandes de build — le `package.json` gère tout :
   - Build : `prisma generate && prisma migrate deploy && next build`
   - Install : `npm install` (le `postinstall` exécute `prisma generate`)
3. **Region** : *Frankfurt (fra1)* pour coller à Neon Europe (latence minimale).
4. Avant de cliquer sur **Deploy**, ouvrez **Environment Variables** et ajoutez les 4 variables ci-dessous.

---

## 6. Variables d'environnement (Vercel → Settings → Environment Variables)

| Variable | Valeur | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://…neon.tech/neondb?sslmode=require` | L'URL Neon copiée à l'étape 3 |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Générer une valeur **unique en prod** |
| `NEXTAUTH_URL` | `https://votre-projet.vercel.app` | URL publique du déploiement |
| `ADMIN_EMAIL` | votre@email.com | Utilisé par le seed |
| `ADMIN_PASSWORD_HASH` | *(voir ci-dessous)* | Mot de passe admin en bcrypt |
| `RESEND_API_KEY` | `re_…` *(optionnel)* | Active les e-mails de notification aux destinataires |
| `RESEND_FROM` | `Landmark Global <no-reply@votredomaine.com>` | Expéditeur vérifié chez Resend |

Générer les secrets localement :

```bash
openssl rand -base64 32          # → NEXTAUTH_SECRET
node -e "console.log(require('bcryptjs').hashSync('VOTRE_MOT_DE_PASSE', 10))"   # → ADMIN_PASSWORD_HASH
```

> Le `ADMIN_PASSWORD_HASH` n'est utilisé que par le seed ; vous pouvez aussi le laisser vide et laisser le seed générer un mot de passe aléatoire (affiché une fois dans les logs de la commande seed).

---

## 6b. Activer les e-mails de notification (optionnel)

À chaque changement de statut d'un colis, le destinataire reçoit automatiquement un e-mail (s'il a une adresse renseignée à la création du colis) via [Resend](https://resend.com) :

1. Compte Resend gratuit (3 000 e-mails/mois) → **API Keys → Create API Key** → copiez la clé `re_…`.
2. Vérifiez votre domaine (**Domains → Add Domain**, DNS fourni par Resend) — ou testez avec `RESEND_FROM="Test <onboarding@resend.dev>"`.
3. Ajoutez `RESEND_API_KEY` et `RESEND_FROM` dans Vercel (comme au tableau ci-dessus) puis Redeploy.

> Sans ces variables, l'application fonctionne parfaitement — elle n'envoie simplement pas d'e-mails.

---

## 7. Créer le compte admin sur la base de production

Le seed crée l'admin + 3 colis de démo. Depuis votre machine :

```bash
DATABASE_URL="postgresql://…neon.tech/neondb?sslmode=require" \
ADMIN_EMAIL="votre@email.com" \
ADMIN_PASSWORD_HASH="<hash bcrypt de l'étape 6>" \
npx prisma db seed
```

> ⚠️ Le seed vide les tables `User`, `Parcel` et `TrackingEvent` avant de recréer. À n'exécuter qu'à la mise en place — pas sur une base contenant déjà de vraies données.
>
> Alternative sans seed : créez l'admin via `prisma studio` connecté à la base prod (`DATABASE_URL=… npx prisma studio`).

---

## 8. Déployer

Retournez dans Vercel → **Deploy**. Le build :

1. installe les dépendances (`postinstall` → `prisma generate`) ;
2. applique les migrations (`prisma migrate deploy`) ;
3. compile les 32 pages (statique quand possible).

À la fin, Vercel affiche l'URL `https://votre-projet.vercel.app`.

**Check-list post-déploiement :**

- [ ] `https://votre-projet.vercel.app` → redirige vers `/en`
- [ ] `/fr` et `/en` rendent la home complète (hero, carte mondiale…)
- [ ] `/tracking` + code de démo → timeline visible
- [ ] `/admin/login` → connexion avec `ADMIN_EMAIL` + mot de passe
- [ ] Créer un colis dans l'admin → visible sur `/tracking`

---

## 9. Domaine personnalisé (optionnel)

Vercel → **Settings → Domains → Add** :

1. Entrez `votre-domaine.com` — Vercel détecte le registrar et propose d'ajouter les DNS.
2. Chez votre registrar, ajoutez selon les instructions Vercel :
   - `A` record `@` → `76.76.21.21`
   - ou `CNAME` `www` → `cname.vercel-dns.com`
3. **Mettez à jour `NEXTAUTH_URL`** avec le domaine final (`https://votre-domaine.com`) puis redéployez (*Deployments → Redeploy*).

> ⚠️ Ne configurez pas le domaine sur un contenu identique au vrai site Landmark Global : utilisez un nom distinct (c'est un projet de démonstration technique, pas le site officiel).

---

## 10. Workflow de mises à jour

Chaque `git push` sur `main` déclenche un déploiement automatique ; chaque PR génère un **preview** (URL temporaire avec les mêmes variables).

```bash
git add . && git commit -m "…" && git push        # → production
git checkout -b feat/x && git push -u origin feat/x   # → preview Vercel
```

Après toute modification de `prisma/schema.prisma` :

```bash
npx prisma migrate dev --name ma_migration        # en local (crée le fichier migrations/)
git add prisma/migrations && git commit -m "schema: …" && git push
# prisma migrate deploy s'exécutera automatiquement au build Vercel
```

---

## Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| Build échoue sur `prisma migrate deploy` | `DATABASE_URL` absente/fausse | Vérifier la variable (tous environnements) |
| `P1001: Can't reach database` | Base en pause (Neon free) ou région éloignée | Réactiver la base dans Neon ; choisir la même région |
| Redirection `/api/auth/error` au login | `NEXTAUTH_URL` ≠ URL réelle du site | Corriger la variable + Redeploy |
| `NEXTAUTH_SECRET` manquant | Variable absente | L'ajouter, puis Redeploy |
| Login admin impossible | Compte jamais seedé en prod | Reprendre l'étape 7 |
| Erreur 500 sur `/tracking` | Base injoignable au moment de la requête | Vérifier les logs Vercel → Functions |

---

## Coûts (plan gratuit)

- **Vercel Hobby** : 0 € — usage personnel, domaine custom inclus, bande passante 100 Go/mois.
- **Neon Free** : 0 € — 0,5 Go, suffisant pour des milliers de colis/événements.
- Seule limite : le plan Hobby Vercel est **non commercial** ; passez à Pro (20 $/mois) pour un usage commercial.
