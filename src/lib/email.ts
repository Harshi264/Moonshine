import nodemailer from 'nodemailer';
import { Order, OrderStatus } from '@/types';
import { getDB, saveSentEmailLog } from '@/lib/db';

// Send notification email to Business Owner
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
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${businessName}</h1>
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

          ${order.customerNotes ? `
          <div style="background-color: #fff9e6; border: 1px solid #ffe599; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
            <strong style="color: #996600;">📝 Customer Note:</strong>
            <p style="margin: 4px 0 0 0; color: #444; font-size: 14px;">${order.customerNotes}</p>
          </div>` : ''}

          <div style="text-align: center; margin-top: 30px; padding: 16px; background-color: #f5eee6; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #4a3b32;">Contact customer now to confirm payment & delivery:</p>
            <a href="tel:${order.phone}" style="display: inline-block; background-color: #4a3b32; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; margin-right: 10px;">📞 Call ${order.phone}</a>
            <a href="https://wa.me/91${order.phone.replace(/[^0-9]/g, '')}" target="_blank" style="display: inline-block; background-color: #25D366; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold;">💬 Open WhatsApp</a>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;

  saveSentEmailLog({
    to: toEmail,
    subject: emailSubject,
    orderId: order.id,
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    html: emailHtml,
  });

  return await dispatchEmail(toEmail, emailSubject, emailHtml, settings);
}

// Send Order Confirmation Email directly to Customer
export async function sendCustomerOrderReceiptEmail(order: Order): Promise<{ success: boolean; simulated: boolean; message: string }> {
  const db = getDB();
  const settings = db.settings;
  const businessName = settings.businessName || 'The Little Cozy Moonshine';

  const itemsListHtml = order.items
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #f0e6da;">
          <td style="padding: 10px; color: #333;">
            <strong>${item.productName}</strong> ${item.variantName ? `(${item.variantName})` : ''}
          </td>
          <td style="padding: 10px; text-align: center; color: #333;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${settings.currencySymbol}${item.price * item.quantity}</td>
        </tr>
      `
    )
    .join('');

  const emailSubject = `🌸 Order Received #${order.id} — ${businessName}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation ${order.id}</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f6f0; margin: 0; padding: 20px; color: #2d241e;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2d9cd; shadow: 0 4px 15px rgba(0,0,0,0.05);">
        
        <div style="background-color: #4a3b32; color: #f7f3ed; padding: 28px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-serif;">${businessName}</h1>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Thank you for your order, ${order.customerName}! 🕯️</p>
        </div>

        <div style="padding: 24px;">
          <div style="background-color: #f5eee6; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 12px; color: #7a6858; uppercase font-weight: bold;">Order ID</span>
            <h2 style="margin: 2px 0 0 0; color: #b87333; font-size: 22px;">${order.id}</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #555;">We have received your order request and will contact you on <strong>${order.phone}</strong> (${order.preferredContact || 'WhatsApp'}) shortly to confirm payment & delivery!</p>
          </div>

          <h3 style="color: #4a3b32; border-bottom: 2px solid #f0e6da; padding-bottom: 6px;">📦 Summary of Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <thead>
              <tr style="background-color: #f5eee6; color: #4a3b32;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <div style="text-align: right; font-size: 16px; font-weight: bold; color: #4a3b32; padding: 10px 0; border-top: 2px solid #4a3b32; margin-bottom: 20px;">
            Total Amount: ${settings.currencySymbol}${order.totalAmount}
          </div>

          <h3 style="color: #4a3b32; border-bottom: 2px solid #f0e6da; padding-bottom: 6px;">📍 Shipping Address</h3>
          <p style="font-size: 14px; color: #444; margin: 0 0 20px 0;">
            ${order.deliveryAddress}<br/>
            ${order.city}, ${order.state} - ${order.pincode}
          </p>

          <div style="text-align: center; margin-top: 30px; padding: 16px; background-color: #faf7f2; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">Need to add custom notes or ask a question?</p>
            <a href="https://wa.me/918341790329?text=Hi!%20I%20have%20a%20question%20regarding%20my%20Order%20${order.id}" target="_blank" style="display: inline-block; background-color: #25D366; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 13px;">💬 Chat with Studio on WhatsApp (8341790329)</a>
          </div>
        </div>

        <div style="background: #e2d9cd; text-align: center; padding: 12px; font-size: 12px; color: #555;">
          ${businessName} • Handmade Soy Candles & Resin Crafts
        </div>
      </div>
    </body>
    </html>
  `;

  saveSentEmailLog({
    to: order.email,
    subject: emailSubject,
    orderId: order.id,
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    html: emailHtml,
  });

  return await dispatchEmail(order.email, emailSubject, emailHtml, settings);
}

// Send Status Update Email to Customer (e.g. when order is Confirmed, Shipped, Delivered)
export async function sendCustomerStatusUpdateEmail(
  order: Order,
  newStatus: OrderStatus,
  note?: string
): Promise<{ success: boolean; simulated: boolean; message: string }> {
  const db = getDB();
  const settings = db.settings;
  const businessName = settings.businessName || 'The Little Cozy Moonshine';

  const emailSubject = `🔔 Update on your Order #${order.id} — Status: ${newStatus}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Status Update</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f6f0; margin: 0; padding: 20px; color: #2d241e;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2d9cd;">
        
        <div style="background-color: #4a3b32; color: #f7f3ed; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">${businessName}</h1>
          <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Order Status Update Notification</p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 15px; color: #333;">Hi <strong>${order.customerName}</strong>,</p>
          <p style="font-size: 14px; color: #555; leading-relaxed;">
            Great news! Your order request <strong>#${order.id}</strong> status has been updated to:
          </p>

          <div style="background-color: #f5eee6; border-left: 4px solid #b87333; padding: 16px; border-radius: 6px; margin: 20px 0; text-align: center;">
            <span style="font-size: 12px; color: #7a6858; uppercase font-weight: bold;">Current Order Status</span>
            <h2 style="margin: 4px 0 0 0; color: #3b2d24; font-size: 24px;">✨ ${newStatus}</h2>
            ${note ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #666; font-style: italic;">"${note}"</p>` : ''}
          </div>

          ${newStatus === 'Delivered' ? `
          <div style="background-color: #e8f5e9; border: 1px solid #c8e6c9; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <strong style="color: #2e7d32; font-size: 15px;">Enjoy your handmade creations? 🌸</strong>
            <p style="margin: 6px 0 12px 0; font-size: 13px; color: #444;">We'd love to hear your feedback! Click below to write a review & upload a picture of your candles/resin decor:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/review?orderId=${order.id}" target="_blank" style="display: inline-block; background-color: #4a3b32; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 13px;">Write a Product Review</a>
          </div>` : ''}

          <p style="font-size: 13px; color: #666; text-align: center;">
            If you have any questions, feel free to reply to this email or contact us on WhatsApp at <strong>8341790329</strong>.
          </p>
        </div>

        <div style="background: #e2d9cd; text-align: center; padding: 12px; font-size: 12px; color: #555;">
          ${businessName} • Studio Notification
        </div>
      </div>
    </body>
    </html>
  `;

  saveSentEmailLog({
    to: order.email,
    subject: emailSubject,
    orderId: order.id,
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    html: emailHtml,
  });

  return await dispatchEmail(order.email, emailSubject, emailHtml, settings);
}

// Helper transport function
async function dispatchEmail(toEmail: string, subject: string, html: string, settings: any) {
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
        from: `"${settings.businessName || 'The Little Cozy Moonshine'}" <${smtpUser}>`,
        to: toEmail,
        subject,
        html,
      });

      return { success: true, simulated: false, message: `Email dispatched to ${toEmail}` };
    } catch (err: any) {
      console.error('SMTP sending error:', err);
      return { success: true, simulated: true, message: `Email logged to admin panel.` };
    }
  }

  return { success: true, simulated: true, message: `Email logged to admin panel.` };
}
