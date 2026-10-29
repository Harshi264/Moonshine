import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { ContactMessage } from '@/types';
import { sendContactNotificationEmail, sendContactAutoReplyEmail } from '@/lib/email';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { sanitizeString } from '@/lib/validators';

/**
 * GET /api/contact
 * Admin retrieval of messages. Supports status and search filters.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const subject = searchParams.get('subject');

    const db = getDB();
    let messages = db.messages || [];

    if (status && status !== 'all') {
      messages = messages.filter((m) => m.status === status);
    }

    if (subject && subject !== 'all') {
      messages = messages.filter((m) => m.subject.toLowerCase() === subject.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      messages = messages.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = (db.messages || []).filter((m) => m.status === 'unread').length;

    return NextResponse.json({
      success: true,
      messages,
      unreadCount,
      total: messages.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * POST /api/contact
 * Handles contact and custom order inquiry submissions from customers.
 * Rate limited to 5 submissions per 10 minutes per IP.
 * Includes honeypot spam protection.
 */
export async function POST(request: Request) {
  // Rate limiting to prevent abuse
  const ip = getClientIp(request);
  const { limited, retryAfterMs } = rateLimit(`contact_form_${ip}`, 5, 10 * 60_000);
  if (limited) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many submissions. Please wait ${Math.ceil((retryAfterMs ?? 600000) / 1000)} seconds before sending another message.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Honeypot spam check (bots fill hidden field)
    if (body.company_website || body.honeypot) {
      // Silently return success to confuse bots
      return NextResponse.json({
        success: true,
        message: 'Thank you! We will reply within 24 hours.',
      });
    }

    const { name, phone, email, subject, message, imageUrl } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter your name.' }, { status: 400 });
    }
    if (!phone || !phone.trim() || phone.trim().length < 8) {
      return NextResponse.json({ success: false, error: 'Please enter a valid phone or WhatsApp number.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!message || message.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Please write a message with at least 5 characters.' }, { status: 400 });
    }

    const db = getDB();
    if (!db.messages) db.messages = [];

    const id = `MSG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMessage: ContactMessage = {
      id,
      name: sanitizeString(name, 100),
      phone: sanitizeString(phone, 20),
      email: String(email).trim().toLowerCase(),
      subject: sanitizeString(subject || 'General Inquiry', 150),
      message: sanitizeString(message, 3000),
      imageUrl: imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http') ? imageUrl : undefined,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    db.messages.unshift(newMessage);
    saveDB(db);

    // Fire email notifications asynchronously (non-blocking)
    Promise.allSettled([
      sendContactNotificationEmail(newMessage),
      sendContactAutoReplyEmail(newMessage),
    ]).catch((err) => console.error('[POST /api/contact] Email notification error:', err));

    return NextResponse.json(
      {
        success: true,
        contactMessage: newMessage,
        message: 'Thank you for reaching out! We have received your message and will reply within 24 hours.',
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('[POST /api/contact] Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
