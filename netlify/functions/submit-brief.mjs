/**
 * Netlify Function — submit-brief.mjs
 * Reçoit les données du brief collecté par le chatbot
 * Actions : 1) Créer une entrée Notion  2) Envoyer un email récap (via Resend)
 */

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

// ── 1. Créer l'entrée dans Notion ─────────────────────────────────────────────
async function createNotionEntry(brief) {
  const notionToken = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN
  const dbId = process.env.NOTION_DB_ID

  if (!notionToken || !dbId) {
    console.warn('Notion env vars manquantes — entrée non créée')
    return null
  }

  const properties = {
    // Nom (title)
    Nom: {
      title: [{ text: { content: brief.nom || 'Inconnu' } }],
    },
    // Email
    Email: {
      email: brief.email || null,
    },
    // Téléphone
    Téléphone: {
      phone_number: brief.telephone || null,
    },
    // Société
    Société: {
      rich_text: [{ text: { content: brief.societe || '' } }],
    },
    // Statut
    Statut: {
      select: { name: '🔍 Prospection' },
    },
    // Source
    Source: {
      select: { name: 'Manuel' },
    },
    // Tags — type de projet
    Tags: {
      multi_select: brief.type_projet
        ? [{ name: brief.type_projet.charAt(0).toUpperCase() + brief.type_projet.slice(1) }]
        : [],
    },
    // Prochaine action
    'Prochaine action': {
      rich_text: [{ text: { content: 'Répondre au brief reçu via chatbot' } }],
    },
  }

  const res = await fetch(`${NOTION_API}/pages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Notion error:', res.status, err)
    return null
  }

  return await res.json()
}

// ── 2. Envoyer l'email récap via Resend ───────────────────────────────────────
async function sendEmail(brief) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('RESEND_API_KEY manquant — email non envoyé')
    return null
  }

  const budgetLabel = brief.budget || 'Non renseigné'
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
      <div style="background: #FF6B4A; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: white; font-size: 20px;">📋 Nouveau brief client</h1>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Reçu via le chatbot SeRious</p>
      </div>
      <div style="background: #fff; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 140px;">Nom</td><td style="padding: 8px 0; font-weight: 600;">${brief.nom || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Société</td><td style="padding: 8px 0;">${brief.societe || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${brief.email}" style="color: #FF6B4A;">${brief.email || '—'}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Téléphone</td><td style="padding: 8px 0;">${brief.telephone || '—'}</td></tr>
          <tr style="border-top: 1px solid #f1f5f9;"><td style="padding: 12px 0 8px; color: #64748b; font-size: 13px;">Activité</td><td style="padding: 12px 0 8px;">${brief.activite || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Type de projet</td><td style="padding: 8px 0;">${brief.type_projet || '—'}</td></tr>
          ${brief.url_actuelle ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">URL actuelle</td><td style="padding: 8px 0;"><a href="${brief.url_actuelle}" style="color: #FF6B4A;">${brief.url_actuelle}</a></td></tr>` : ''}
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Objectif</td><td style="padding: 8px 0;">${brief.objectif || '—'}</td></tr>
          <tr style="border-top: 1px solid #f1f5f9;"><td style="padding: 12px 0 8px; color: #64748b; font-size: 13px;">Budget</td><td style="padding: 12px 0 8px; font-weight: 600; color: #FF6B4A;">${budgetLabel}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Délai</td><td style="padding: 8px 0;">${brief.delai || '—'}</td></tr>
          ${brief.notes ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Notes</td><td style="padding: 8px 0; font-style: italic;">${brief.notes}</td></tr>` : ''}
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 13px; color: #64748b;">
          ✅ Entrée ajoutée automatiquement dans le Notion CRM
        </div>
      </div>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SeRious Chatbot <noreply@serious-digital.fr>',
      to: ['contact@serious-digital.fr'],
      subject: `📋 Nouveau brief — ${brief.societe || brief.nom || 'Client'}`,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', res.status, err)
    return null
  }

  return await res.json()
}

// ── Handler principal ─────────────────────────────────────────────────────────
export const handler = async (event) => {
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

  let brief
  try {
    brief = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const results = await Promise.allSettled([createNotionEntry(brief), sendEmail(brief)])

  const notionOk = results[0].status === 'fulfilled' && results[0].value !== null
  const emailOk = results[1].status === 'fulfilled' && results[1].value !== null

  console.log(`Brief soumis — Notion: ${notionOk ? '✅' : '❌'} / Email: ${emailOk ? '✅' : '⚠️ (clé manquante)'}`)

  return {
    statusCode: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, notion: notionOk, email: emailOk }),
  }
}
