# SeRious — Site vitrine offre commerciale

> Agence de création de sites **Agentic Friendly** et stratégie digitale pour PME.

## Stack

- **Framework** : Astro 4.x (SSG)
- **Styling** : Tailwind CSS 3.4+
- **Hébergement** : Netlify (statique, CDN, HTTPS)

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Hero + proposition de valeur + 3 offres + stats + CTA |
| Offres | `/offres` | Détail des 3 offres (création, stratégie, package complet) |
| Méthode | `/methode` | Process, GEO expliqué, justification 6 mois |
| À propos | `/a-propos` | Équipe, mission, valeurs, crédibilité E-E-A-T |
| Contact | `/contact` | Formulaire demande d'audit + coordonnées |

## SEO & GEO

- Meta tags par page (title, description, canonical, OG, Twitter Cards)
- JSON-LD : Organization, BreadcrumbList, FAQPage, Service
- Sitemap XML automatique (@astrojs/sitemap)
- robots.txt configuré
- FAQ structurées (GEO-optimisées)

## Commandes

```bash
npm install       # Installer les dépendances
npm run dev       # Serveur dev (localhost:4321)
npm run build     # Build production (dist/)
npm run preview   # Prévisualiser le build
```

## Déploiement

Push sur GitHub → Netlify auto-deploy.

---

**Projet** : SeRious (site vitrine offre commerciale)  
**Framework** : NikMacron v1.3.0  
**Pre-Flight Checklist** : ✅ Suivi complet (premier projet)
