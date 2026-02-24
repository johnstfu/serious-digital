/**
 * Netlify Function — chat.mjs
 * Relaie les messages vers Claude (claude-sonnet-4-6)
 * Détecte le signal <!--BRIEF_READY--> pour déclencher la soumission
 */

const SYSTEM_PROMPT = `Tu es Rayane, fondateur de SeRious — une agence digitale parisienne spécialisée dans la création de sites web "Agentic Friendly" et la stratégie digitale pour PME.

Tu discutes avec un client potentiel qui veut te briefer sur son projet. Ton objectif : collecter les informations clés de façon conversationnelle, chaleureuse et professionnelle.

INFORMATIONS À COLLECTER (dans cet ordre naturel, 1 ou 2 questions maximum à la fois) :

1. Prénom + nom du contact, et nom de l'entreprise
2. Secteur d'activité — ce qu'ils font concrètement
3. Objectif principal du projet (pourquoi ce projet, pourquoi maintenant ?)
4. Type de projet :
   - "Nouveau site" → demander si charte graphique existante, références visuelles
   - "Refonte" → demander l'URL actuelle + ce qui ne fonctionne pas
   - "Autre" (app, outil IA, landing...) → laisser décrire
5. Budget approximatif — propose ces tranches : "moins de 2 000€ / 2 000–5 000€ / 5 000–10 000€ / plus de 10 000€"
6. Deadline ou niveau d'urgence
7. Email de contact + numéro de téléphone (pour la suite des échanges)

TON STYLE :
- Pro mais accessible — comme Rayane qui discute naturellement avec un client
- Reformule les réponses pour montrer que tu as bien compris avant de poser la suivante
- Sois concis : pas de longs paragraphes
- Ne pose JAMAIS toutes les questions d'un coup
- Si le client écrit en anglais → réponds en anglais
- Utilise "tu" ou "vous" selon le registre initié par le client

PROCESSUS DE FIN :
Quand tu as collecté toutes les informations (étapes 1 à 7), récapitule-les de façon claire et demande confirmation : "Est-ce que tout est correct ?"

Après confirmation explicite du client, envoie un message de clôture chaleureux (ex : "Super ! Je reviens vers toi très vite. À bientôt !") puis, sur une nouvelle ligne, ajoute ce bloc JSON invisible :

<!--BRIEF_READY-->
{"nom":"...","societe":"...","email":"...","telephone":"...","activite":"...","type_projet":"nouveau site|refonte|autre","url_actuelle":"","charte_graphique":"","budget":"...","delai":"...","objectif":"...","notes":""}
<!--/BRIEF_READY-->

RÈGLE ABSOLUE : N'inclus le bloc <!--BRIEF_READY--> QUE lorsque le client a explicitement confirmé le récapitulatif. Pas avant.`

export const handler = async (event) => {
  // CORS preflight
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' }
  }

  let messages
  try {
    ;({ messages } = JSON.parse(event.body))
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'messages required' }) }
  }

  // Appel Claude
  let claudeRes
  try {
    claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.Claude_chatbot || process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })
  } catch (err) {
    console.error('Claude fetch error:', err)
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Erreur de connexion à Claude' }),
    }
  }

  if (!claudeRes.ok) {
    const errText = await claudeRes.text()
    console.error('Claude API error:', claudeRes.status, errText)
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Erreur API Claude' }),
    }
  }

  const data = await claudeRes.json()
  const fullReply = data.content?.[0]?.text ?? ''

  // Détecter le signal de fin
  const briefMatch = fullReply.match(/<!--BRIEF_READY-->\s*([\s\S]*?)\s*<!--\/BRIEF_READY-->/)
  let briefData = null
  let reply = fullReply

  if (briefMatch) {
    try {
      briefData = JSON.parse(briefMatch[1].trim())
    } catch (e) {
      console.error('Impossible de parser le JSON du brief:', e)
    }
    // Retirer le bloc JSON du message affiché
    reply = fullReply.replace(/<!--BRIEF_READY-->[\s\S]*?<!--\/BRIEF_READY-->/, '').trim()
  }

  return {
    statusCode: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply, briefData }),
  }
}
