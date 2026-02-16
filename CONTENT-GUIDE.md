# Guide d'ajout de contenu — SeRious

Ce document explique comment ajouter des articles de blog et des questions FAQ au site SeRious.

---

## 📝 Ajouter un article de blog

### Fichier à modifier
`src/pages/blog/index.astro`

### Comment ajouter un article

Dans le fichier, trouvez le tableau `articles` (ligne ~7) et ajoutez un nouvel objet :

```javascript
const articles = [
  {
    title: 'Titre de votre article',
    excerpt: 'Description courte de l\'article (2-3 phrases)',
    tag: 'GEO', // Options: GEO, SEO, IA, Social, Stratégie
    date: '15 fév. 2026', // Date de publication ou "Bientôt"
    color: 'bg-coral/10 text-coral border-coral/20', // Couleur du tag
    // slug: 'mon-article', // Optionnel: pour créer une page dédiée
  },
  // ... autres articles
];
```

### Couleurs disponibles pour les tags

| Tag | Couleur |
|-----|---------|
| GEO | `bg-coral/10 text-coral border-coral/20` |
| SEO | `bg-teal/10 text-teal border-teal/20` |
| IA | `bg-amber/10 text-amber border-amber/20` |
| Social | `bg-navy/10 text-navy border-navy/20` |
| Stratégie | `bg-rose/10 text-rose border-rose/20` |

### Créer une page article complète (optionnel)

1. Créer un fichier dans `src/pages/blog/mon-article.astro`
2. Utiliser le template :

```astro
---
import Layout from '../../layouts/Layout.astro';

const title = 'Titre de l\'article';
const description = 'Description pour le SEO';
---

<Layout title={title} description={description}>
  <section class="section">
    <div class="container-narrow">
      <article class="prose prose-lg max-w-none">
        <h1>Titre de l'article</h1>
        <p class="text-muted text-lg mb-8">Introduction de l'article...</p>

        <h2>Première section</h2>
        <p>Contenu...</p>

        <h2>Deuxième section</h2>
        <p>Contenu...</p>
      </article>
    </div>
  </section>
</Layout>
```

---

## ❓ Ajouter une question FAQ

### Fichier à modifier
`src/pages/faq.astro`

### Comment ajouter une question

Dans le fichier, trouvez le tableau `faqs` (ligne ~7) et ajoutez une question dans la catégorie appropriée :

```javascript
const faqs = [
  {
    category: 'Nos services', // Catégorie existante ou nouvelle
    items: [
      {
        q: 'Votre question ici ?',
        a: 'Votre réponse ici. Soyez clair et concis, mais donnez assez de détails pour être utile.'
      },
      // ... autres questions de cette catégorie
    ],
  },
  // ... autres catégories
];
```

### Catégories existantes

- **Nos services** : Questions sur les offres, les prix, les prestations
- **Fonctionnement** : Questions sur le déroulement d'un projet
- **Technique** : Questions sur les outils, l'hébergement, les aspects techniques

### Créer une nouvelle catégorie

Ajoutez un nouvel objet au tableau `faqs` :

```javascript
{
  category: 'Nouvelle catégorie',
  items: [
    { q: 'Question 1 ?', a: 'Réponse 1.' },
    { q: 'Question 2 ?', a: 'Réponse 2.' },
  ],
}
```

---

## 🎨 Bonnes pratiques

### Pour les articles
- **Titre** : Maximum 60 caractères pour le SEO
- **Extrait** : 150-200 caractères, accrocheur
- **Tag** : Un seul tag par article, le plus pertinent
- **Ton** : Direct, professionnel mais accessible

### Pour les FAQ
- **Question** : Formulez comme un client le ferait
- **Réponse** : 2-4 phrases maximum, soyez concret
- **Évitez** : Le jargon technique non expliqué

---

## 📁 Structure des fichiers

```
src/pages/
├── blog/
│   ├── index.astro          # Liste des articles
│   └── [article-slug].astro # Pages articles individuelles
├── faq.astro                # Page FAQ complète
└── index.astro              # Page d'accueil
```

---

## 🔄 Workflow recommandé

1. **Rédiger** le contenu dans un éditeur de texte
2. **Modifier** le fichier `.astro` approprié
3. **Vérifier** le rendu en local (`npm run dev`)
4. **Commiter** les changements

Pour toute question technique, consultez le README principal du projet.
