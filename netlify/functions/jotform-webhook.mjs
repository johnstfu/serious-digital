/**
 * Netlify Function — JotForm → Notion CRM
 * =========================================
 * Reçoit le webhook JotForm (Brief Client)
 * Crée une fiche dans le CRM Notion "Clients & Prospects"
 * + une page de détails avec tout le brief
 *
 * URL du webhook à configurer dans JotForm :
 * https://<ton-site>.netlify.app/.netlify/functions/jotform-webhook
 */

import https from 'https'

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DB_ID   = '31035bc5-fcd0-8192-9992-f54e0bcc4be9'

// ── Appel API Notion ─────────────────────────────────────────────────────────
function notionRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : ''
    const options = {
      hostname: 'api.notion.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { resolve(data) }
      })
    })
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

// ── Parser le webhook JotForm ─────────────────────────────────────────────────
function parseJotForm(body) {
  // JotForm envoie soit du URL-encoded, soit du JSON
  let raw = {}
  try {
    const params = new URLSearchParams(body)
    // rawRequest contient tout le brief en JSON
    const rawRequest = params.get('rawRequest')
    if (rawRequest) {
      raw = JSON.parse(decodeURIComponent(rawRequest))
    } else {
      // fallback : lire les params directement
      for (const [k, v] of params.entries()) raw[k] = v
    }
  } catch {
    try { raw = JSON.parse(body) } catch { raw = {} }
  }

  // Extraire les champs clés (numéros de question → valeur)
  const get = (...keys) => {
    for (const k of keys) {
      const val = raw[k] || raw[k + '_'] || ''
      if (val && val !== 'N/A') return String(val).trim()
    }
    return ''
  }

  return {
    // Identité
    company:    get('q3_nomDe', 'q3'),
    sector:     get('q4_secteurD', 'q4'),
    address:    get('q5_adresseCompleta', 'q5'),
    zone:       get('q6_zoneDeC', 'q6'),
    since:      get('q7_depuisQuand', 'q7'),
    pitch:      get('q8_enUne', 'q8'),
    // Projet
    projectType: get('q10_quelEst10', 'q10'),
    currentSite: get('q11_siRefonte', 'q11'),
    whyNow:      get('q12_pourquoiMaintenant', 'q12'),
    goal:        get('q13_quelEst13', 'q13'),
    // Clients
    idealClient:  get('q15_quiEst', 'q15'),
    discovery:    get('q16_commentVos', 'q16'),
    keywords:     get('q17_questCe17', 'q17'),
    // FAQ
    faq1: get('q19_questionFr19', 'q19'),
    faq2: get('q20_questionFr20', 'q20'),
    faq3: get('q21_questionFr21', 'q21'),
    // Services
    service1: get('q25_service', 'q25'),
    service2: get('q26_service26', 'q26'),
    service3: get('q27_service27', 'q27'),
    service4: get('q28_service28', 'q28'),
    // Design
    hasCharte:   get('q34_avezVousU34', 'q34'),
    ambiance:    get('q36_quelleAmbiance', 'q36'),
    site1url:    get('q39_site1', 'q39'),
    site1like:   get('q40_site1Ce40', 'q40'),
    site2url:    get('q42_site2', 'q42'),
    colors:      get('q48_couleursQue', 'q48'),
    noColors:    get('q49_couleursA', 'q49'),
    // Rédaction
    whoWrites:   get('q51_quiSOccupe', 'q51'),
    testimonials: get('q53_avezVousD53', 'q53'),
    // Technique
    hasDomain:   get('q56_avezVousU56', 'q56'),
    domain:      get('q57_siOui57', 'q57'),
    gmb:         get('q63_etesVousI', 'q63'),
    phone:       get('q65_votreNumero', 'q65'),
    // Légal
    legalForm:   get('q68_formeJuridique', 'q68'),
    siret:       get('q69_siret', 'q69'),
    email:       get('q71_emailDe', 'q71'),
  }
}

// ── Construire les blocs Notion pour le brief complet ────────────────────────
function buildNotionBlocks(f) {
  const section = (title) => ({
    object: 'block', type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content: title } }] }
  })
  const bullet = (text) => text ? {
    object: 'block', type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content: text } }] }
  } : null
  const para = (text) => text ? {
    object: 'block', type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content: text } }] }
  } : null

  const blocks = [
    section('🏢 Activité'),
    bullet(`Secteur : ${f.sector}`),
    bullet(`Zone : ${f.zone}`),
    bullet(`Depuis : ${f.since}`),
    para(f.pitch),

    section('🎯 Projet'),
    bullet(`Type : ${f.projectType}`),
    f.currentSite && bullet(`Site actuel : ${f.currentSite}`),
    bullet(`Pourquoi maintenant : ${f.whyNow}`),
    bullet(`Objectif : ${f.goal}`),

    section('👥 Clients cibles'),
    para(f.idealClient),
    bullet(`Découverte : ${f.discovery}`),
    bullet(`Mots-clés : ${f.keywords}`),

    section('❓ FAQ client'),
    f.faq1 && bullet(f.faq1),
    f.faq2 && bullet(f.faq2),
    f.faq3 && bullet(f.faq3),

    section('📋 Services'),
    f.service1 && para(f.service1),
    f.service2 && para(f.service2),
    f.service3 && para(f.service3),
    f.service4 && para(f.service4),

    section('🎨 Design'),
    bullet(`Charte graphique : ${f.hasCharte}`),
    bullet(`Ambiance souhaitée : ${f.ambiance}`),
    bullet(`Couleurs aimées : ${f.colors}`),
    bullet(`Couleurs à éviter : ${f.noColors}`),
    f.site1url && bullet(`Référence 1 : ${f.site1url} — aime : ${f.site1like}`),
    f.site2url && bullet(`Référence 2 : ${f.site2url}`),

    section('✍️ Contenu'),
    bullet(`Qui rédige : ${f.whoWrites}`),
    bullet(`Témoignages : ${f.testimonials}`),

    section('⚙️ Technique'),
    bullet(`Domaine : ${f.hasDomain} ${f.domain ? '→ ' + f.domain : ''}`),
    bullet(`GMB : ${f.gmb}`),
    bullet(`Téléphone : ${f.phone}`),

    section('📄 Légal'),
    bullet(`Forme : ${f.legalForm}`),
    bullet(`SIRET : ${f.siret}`),
    bullet(`Email site : ${f.email}`),
  ].filter(Boolean)

  return blocks
}

// ── Handler principal ─────────────────────────────────────────────────────────
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (!NOTION_API_KEY) {
    console.error('NOTION_API_KEY manquante')
    return { statusCode: 500, body: 'Config error' }
  }

  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf-8')
      : event.body

    const f = parseJotForm(rawBody)

    const companyName = f.company || 'Client JotForm'

    // ── Créer la fiche Notion ──────────────────────────────────────────────
    const notionPage = {
      parent: { database_id: NOTION_DB_ID },
      properties: {
        'Nom':    { title: [{ text: { content: companyName } }] },
        'Société':{ rich_text: [{ text: { content: companyName } }] },
        'Source': { select: { name: 'JotForm' } },
        'Statut': { select: { name: '🤝 Deal' } },
        'Tags':   { multi_select: [{ name: 'Chaud 🔥' }] },
        'Prochaine action': { rich_text: [{ text: { content: 'Démarrer la production' } }] },
      },
      children: buildNotionBlocks(f),
    }

    // Ajouter email si présent
    if (f.email) notionPage.properties['Email'] = { email: f.email }

    // Ajouter téléphone si présent
    if (f.phone) notionPage.properties['Téléphone'] = { phone_number: f.phone }

    const result = await notionRequest('POST', '/v1/pages', notionPage)

    if (result.object === 'error') {
      console.error('Notion error:', result)
      return { statusCode: 500, body: JSON.stringify(result) }
    }

    console.log(`✅ Notion créé pour : ${companyName} | ID: ${result.id}`)
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, notion_id: result.id }),
    }

  } catch (err) {
    console.error('Erreur webhook:', err)
    return { statusCode: 500, body: err.message }
  }
}
