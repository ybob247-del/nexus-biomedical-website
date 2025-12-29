import mysql from 'mysql2/promise';
import { sendEmail } from '../../../utils/emailService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, language = 'en' } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    // Check if email already exists
    const [existing] = await connection.execute(
      'SELECT id FROM newsletter_subscribers WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      // Update status if previously unsubscribed
      await connection.execute(
        'UPDATE newsletter_subscribers SET status = "active", unsubscribed_at = NULL WHERE email = ?',
        [email]
      );
    } else {
      // Insert new subscriber
      await connection.execute(
        'INSERT INTO newsletter_subscribers (email, name, language, status) VALUES (?, ?, ?, "active")',
        [email, name || '', language]
      );
    }

    // Send confirmation email
    try {
      const confirmationLink = `${process.env.VITE_APP_URL || 'https://nexusbiomedical.ai'}/newsletter/confirm?email=${encodeURIComponent(email)}`;
      
      const emailContent = language === 'es'
        ? `
          <h2>Confirma tu suscripción</h2>
          <p>¡Gracias por suscribirte a nuestro boletín!</p>
          <p><a href="${confirmationLink}">Confirma tu suscripción aquí</a></p>
        `
        : `
          <h2>Confirm Your Subscription</h2>
          <p>Thank you for subscribing to our newsletter!</p>
          <p><a href="${confirmationLink}">Confirm your subscription here</a></p>
        `;

      await sendEmail({
        to: email,
        subject: language === 'es' ? 'Confirma tu suscripción' : 'Confirm Your Subscription',
        html: emailContent,
      });
    } catch (emailError) {
      console.warn('Failed to send confirmation email:', emailError);
      // Don't fail the subscription if email fails
    }

    return res.status(200).json({ message: 'Subscription successful. Check your email to confirm.' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await connection.end();
  }
}
