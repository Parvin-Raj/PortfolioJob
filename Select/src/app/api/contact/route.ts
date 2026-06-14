import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const DEFAULT_TO = 'parvinraj0607@gmail.com'

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const rawPass = process.env.SMTP_PASS?.trim()
  const port = Number(process.env.SMTP_PORT || 587)

  if (!host || !user || !rawPass) {
    return null
  }

  // Gmail app passwords are often copied with spaces — strip them for auth
  const pass = rawPass.replace(/\s+/g, '')

  return { host, user, pass, port }
}

type ContactPayload = {
  name: string
  email: string
  message: string
}

async function sendViaSmtp(toEmail: string, { name, email, message }: ContactPayload) {
  const smtp = getSmtpConfig()
  if (!smtp) {
    throw new Error('SMTP_NOT_CONFIGURED')
  }

  const fromEmail = process.env.SMTP_FROM?.trim() || smtp.user
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    requireTLS: smtp.port === 587,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  })

  const subject = `Portfolio contact from ${name}`
  const text = [`Name: ${name}`, `Email: ${email}`, '', 'Message:', message].join('\n')
  const html = `
    <h2>New portfolio message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `

  await transporter.sendMail({
    from: `"Portfolio Contact" <${fromEmail}>`,
    to: toEmail,
    replyTo: email,
    subject,
    text,
    html,
  })
}

async function sendViaWeb3Forms({ name, email, message }: ContactPayload) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim()
  if (!accessKey) {
    throw new Error('WEB3FORMS_NOT_CONFIGURED')
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      name,
      email,
      message,
      subject: `Portfolio contact from ${name}`,
    }),
  })

  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || 'Web3Forms delivery failed')
  }
}

export async function POST(req: NextRequest) {
  console.log('[contact API] Received request')
  const body = await req.json().catch(() => null)
  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.email !== 'string' ||
    typeof body.message !== 'string'
  ) {
    console.log('[contact API] Invalid form data')
    return NextResponse.json({ ok: false, error: 'Invalid form data.' }, { status: 400 })
  }

  const payload: ContactPayload = {
    name: body.name.trim(),
    email: body.email.trim(),
    message: body.message.trim(),
  }

  if (payload.name.length < 2 || !payload.email.includes('@') || payload.message.length < 10) {
    console.log('[contact API] Validation failed')
    return NextResponse.json({ ok: false, error: 'Please fill all fields correctly.' }, { status: 400 })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO
  const errors: string[] = []

  console.log('[contact API] Checking Web3Forms config')
  if (process.env.WEB3FORMS_ACCESS_KEY?.trim()) {
    try {
      await sendViaWeb3Forms(payload)
      console.log('[contact API] Web3Forms success')
      return NextResponse.json({ ok: true })
    } catch (err) {
      console.error('[contact] Web3Forms failed:', err)
      errors.push('Web3Forms')
    }
  } else {
    console.log('[contact API] Web3Forms not configured')
  }

  console.log('[contact API] Checking SMTP config')
  const smtpConfig = getSmtpConfig()
  if (smtpConfig) {
    try {
      await sendViaSmtp(toEmail, payload)
      console.log('[contact API] SMTP success')
      return NextResponse.json({ ok: true })
    } catch (err) {
      console.error('[contact] SMTP failed:', err)
      errors.push('SMTP')
    }
  } else {
    console.log('[contact API] SMTP not configured')
  }

  console.log('[contact API] All delivery methods failed, errors:', errors)
  const smtpConfigured = !!smtpConfig
  const error =
    smtpConfigured && errors.includes('SMTP')
      ? 'SMTP delivery failed. The form will retry via backup delivery.'
      : 'Could not send email. Please try again or contact me directly at parvinraj0607@gmail.com.'

  return NextResponse.json({ ok: false, error }, { status: 502 })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
