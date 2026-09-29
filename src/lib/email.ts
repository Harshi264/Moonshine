import nodemailer from 'nodemailer';
import { Order } from '@/types';
import { getDB, saveSentEmailLog } from '@/lib/db';

export async function sendOrderNotificationEmail(order: Order): Promise<{ success: boolean; simulated: boolean; message: string }> {
  const db = getDB();
  const settings = db.settings;

  const toEmail = settings.email || 'thecozylittlemoonshine@gmail.com';
  const businessName = settings.businessName || 'The Little Cozy Moonshine';

  const itemsListHtml = order.items
    .map((item, index) => {
      const customNotes = item.customizationDetails
        ? Object.entries(item.customizationDetails)
            .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
            .join(', ')
        : 'None';

      return `
        <tr style="border-bottom: 1px solid #eeeeee;">
          <td style="padding: 10px; color: #333;">
            <strong>${index + 1}. ${item.productName}</strong> ${item.variantName ? `(${item.variantName})` : ''}
            ${item.customizationDetails ? `<br/><small style="color: #666; font-style: italic;">Customization: ${customNotes}</small>` : ''}
          </td>
          <td style="padding: 10px; text-align: center; color: #333;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${settings.currencySymbol}${item.price}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${settings.currencySymbol}${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  const emailSubject = `🚨 NEW ORDER RECEIVED #${order.id} — ${order.customerName} (${settings.currencySymbol}${order.totalAmount})`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order ${order.id}</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f6f0; margin: 0; padding: 20px; color: #2d241e;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2d9cd;">
        
        <!-- Header -->
        <div style="background-color: #4a3b32; color: #f7f3ed; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">${businessName}</h1>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">🛍️ New Order Request Received!</p>
        </div>

        <div style="padding: 24px;">
          <!-- Order Header Banner -->
          <div style="background-color: #f5eee6; border-left: 4px solid #b87333; padding: 14px; border-radius: 6px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 12px; color: #7a6858; text-transform: uppercase; font-weight: bold;">Order ID</span>
                <h2 style="margin: 2px 0 0 0; color: #4a3b32; font-size: 20px;">${order.id}</h2>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 12px; color: #7a6858;">Date & Time</span>
                <p style="margin: 2px 0 0 0; font-weight: bold; color: #333;">${new Date(order.createdAt).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <!-- Customer Contact Card -->
          <h3 style="color: #4a3b32; border-bottom: 2px solid #f0e6da; padding-bottom: 6px; margin-top: 0;">👤 Customer Information</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; width: 35%; color: #666;"><strong>Customer Name:</strong></td>
              <td style="padding: 6px 0; color: #111; font-weight: 600;">${order.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Phone Number:</strong></td>
              <td style="padding: 6px 0; color: #111; font-weight: 600;"><a href="tel:${order.phone}" style="color: #b87333; text-decoration: none;">📞 ${order.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Email Address:</strong></td>
              <td style="padding: 6px 0; color: #111;"><a href="mailto:${order.email}" style="color: #b87333;">${order.email}</a></td>
            </tr>
            ${order.instagramUsername ? `
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Instagram Handle:</strong></td>
              <td style="padding: 6px 0; color: #b87333; font-weight: 600;">${order.instagramUsername}</td>
            </tr>` : ''}
            ${order.preferredContact ? `
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Preferred Contact:</strong></td>
              <td style="padding: 6px 0; color: #111;">${order.preferredContact}</td>
            </tr>` : ''}
          </table>

          <!-- Delivery Address -->
          <h3 style="color: #4a3b32; border-bottom: 2px solid #f0e6da; padding-bottom: 6px;">📍 Delivery Address</h3>
          <div style="background: #faf7f2; padding: 12px 16px; border-radius: 8px; border: 1px dashed #d6c8b8; margin-bottom: 24px; font-size: 14px; color: #333;">
            <p style="margin: 0; line-height: 1.5;">${order.deliveryAddress}</p>
            <p style="margin: 4px 0 0 0; font-weight: 600;">${order.city}, ${order.state} - ${order.pincode}</p>
          </div>

          <!-- Order Items Table -->
          <h3 style="color: #4a3b32; border-bottom: 2px solid #f0e6da; padding-bottom: 6px;">📦 Ordered Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <thead>
              <tr style="background-color: #f5eee6; color: #4a3b32;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Unit Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <!-- Order Totals -->
          <div style="width: 250px; margin-left: auto; text-align: right; font-size: 14px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #666;">
              <span>Subtotal:</span>
              <span>${settings.currencySymbol}${order.subtotal}</span>
            </div>
            ${order.discountTotal > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #2e7d32;">
              <span>Discount Saved:</span>
              <span>-${settings.currencySymbol}${order.discountTotal}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #666;">
              <span>Shipping Fee:</span>
              <span>${order.shippingFee === 0 ? 'FREE' : settings.currencySymbol + order.shippingFee}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 18px; font-weight: bold; color: #4a3b32; border-top: 2px solid #4a3b32; margin-top: 6px;">
              <span>Final Total:</span>
              <span>${settings.currencySymbol}${order.totalAmount}</span>
            </div>
          </div>

          <!-- Customer Special Notes / Gift Message -->
          ${order.customerNotes ? `
          <div style="background-color: #fff9e6; border: 1px solid #ffe599; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
            <strong style="color: #996600;">📝 Customer Note / Customization Request:</strong>
            <p style="margin: 4px 0 0 0; color: #444; font-size: 14px;">${order.customerNotes}</p>
          </div>` : ''}

          ${order.giftMessage ? `
          <div style="background-color: #fce4ec; border: 1px solid #f8bbd0; padding: 12px; border-radius: 8px; margin-bottom: 24px;">
            <strong style="color: #c2185b;">🎁 Gift Card Message:</strong>
            <p style="margin: 4px 0 0 0; color: #444; font-size: 14px; font-style: italic;">"${order.giftMessage}"</p>
          </div>` : ''}

          <!-- Direct Call/WhatsApp CTA -->
          <div style="text-align: center; margin-top: 30px; padding: 16px; background-color: #f5eee6; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #4a3b32;">Contact customer now to confirm payment & delivery:</p>
            <a href="tel:${order.phone}" style="display: inline-block; background-color: #4a3b32; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; margin-right: 10px;">📞 Call ${order.phone}</a>
            <a href="https://wa.me/91${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${order.customerName}, thank you for ordering from ${businessName}! Order ID: ${order.id}. We are getting your order ready.`)}" target="_blank" style="display: inline-block; background-color: #25D366; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold;">💬 Open WhatsApp</a>
          </div>

        </div>

        <div style="background: #e2d9cd; text-align: center; padding: 14px; font-size: 12px; color: #555;">
          ${businessName} Admin Notification System
        </div>
      </div>
    </body>
    </html>
  `;

  // Always save structured email to log for admin dashboard visibility
  saveSentEmailLog({
    to: toEmail,
    subject: emailSubject,
    orderId: order.id,
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    html: emailHtml,
  });

  // Check if live SMTP configured
  const smtpHost = process.env.SMTP_HOST || settings.smtpHost;
  const smtpUser = process.env.SMTP_USER || settings.smtpEmail;
  const smtpPass = process.env.SMTP_PASS || settings.smtpPassword;
  const smtpPort = Number(process.env.SMTP_PORT || settings.smtpPort || 587);

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"${businessName}" <${smtpUser}>`,
        to: toEmail,
        subject: emailSubject,
        html: emailHtml,
      });

      return { success: true, simulated: false, message: `Email sent directly to ${toEmail}` };
    } catch (err: any) {
      console.error('SMTP sending error, fallback to simulated log:', err);
      return { success: true, simulated: true, message: `Order recorded & email notification logged to admin panel.` };
    }
  }

  // If no SMTP, returns success (simulated email logged cleanly)
  return { success: true, simulated: true, message: `Order logged! Email notification ready in admin email logs.` };
}
