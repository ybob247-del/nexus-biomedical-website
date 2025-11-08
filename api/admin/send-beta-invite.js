/**
 * API Endpoint: Send Beta Invite
 * 
 * This endpoint is called from the Admin Beta Invites panel.
 * It sends a welcome email to the user and triggers the n8n workflow.
 * 
 * POST /api/admin/send-beta-invite
 * Body: { email: string, days: number }
 * 
 * Flow:
 * 1. Validate email and days
 * 2. Trigger n8n workflow (sends welcome email)
 * 3. n8n creates database record
 * 4. n8n sends SMS notification to you
 * 5. Return success response
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, days } = req.body;

  // Validate input
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!days || days < 1 || days > 365) {
    return res.status(400).json({ error: 'Days must be between 1 and 365' });
  }

  try {
    // TODO: Add authentication check here
    // Only allow admin users to send beta invites
    // For now, we'll skip auth (you can add later)

    // Trigger n8n workflow
    // Replace this URL with your actual n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_BETA_INVITE_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/beta-invite';

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        days,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger n8n workflow');
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: `Beta invite sent to ${email}`,
      email,
      days,
    });
  } catch (error) {
    console.error('Error sending beta invite:', error);
    return res.status(500).json({
      error: 'Failed to send beta invite',
      details: error.message,
    });
  }
}

