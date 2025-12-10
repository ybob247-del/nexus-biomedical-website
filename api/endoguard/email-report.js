import { Resend } from 'resend';
import { jsPDF } from 'jspdf';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate PDF buffer from assessment results
function generatePDFBuffer(results, recipientName, senderName) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Helper function to add text with word wrap
  const addText = (text, fontSize = 12, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    
    lines.forEach(line => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 5;
  };

  // Header
  doc.setFillColor(217, 70, 239);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('EndoGuard Assessment Report', pageWidth / 2, 25, { align: 'center' });
  
  yPos = 60;
  doc.setTextColor(0, 0, 0);

  // Recipient info
  addText(`Prepared for: ${recipientName}`, 12, true);
  addText(`Shared by: ${senderName}`, 10);
  addText(`Date: ${new Date().toLocaleDateString()}`, 10);
  yPos += 10;

  // Overall Risk Score
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 30, 'F');
  yPos += 10;
  addText(`Overall Risk Level: ${results.overallRisk.level}`, 16, true);
  addText(`Risk Score: ${results.overallRisk.score}/100`, 14, true);
  yPos += 10;

  // EDC Exposure
  addText('EDC Exposure Analysis', 16, true);
  addText(`Exposure Risk Score: ${results.edcExposure.riskScore}/100`, 12);
  addText(`Risk Level: ${results.edcExposure.riskLevel}`, 12);
  
  if (results.edcExposure.riskFactors && results.edcExposure.riskFactors.length > 0) {
    yPos += 5;
    addText('Key Risk Factors:', 12, true);
    results.edcExposure.riskFactors.forEach((factor, index) => {
      addText(`${index + 1}. ${factor.factor}`, 11, true);
      addText(`   Impact: ${factor.impact}`, 10);
      addText(`   Action: ${factor.recommendation}`, 10);
    });
  }

  // Hormone Health
  yPos += 10;
  addText('Hormone Health Assessment', 16, true);
  addText(`Hormone Disruption Score: ${results.hormoneHealth.disruptionScore}/100`, 12);
  addText(`Risk Level: ${results.hormoneHealth.riskLevel}`, 12);

  if (results.hormoneHealth.affectedSystems && results.hormoneHealth.affectedSystems.length > 0) {
    yPos += 5;
    addText('Affected Hormone Systems:', 12, true);
    results.hormoneHealth.affectedSystems.forEach(system => {
      addText(`• ${system}`, 11);
    });
  }

  // Recommendations
  if (results.recommendations && results.recommendations.length > 0) {
    yPos += 10;
    addText('Personalized Recommendations', 16, true);
    results.recommendations.slice(0, 5).forEach((rec, index) => {
      addText(`${index + 1}. [${rec.category}] ${rec.text}`, 11);
      if (rec.rationale) {
        addText(`   Why: ${rec.rationale}`, 10);
      }
    });
  }

  // Medical Disclaimer
  doc.addPage();
  yPos = margin;
  addText('Medical Disclaimer', 14, true);
  addText('This assessment is for informational purposes only and does not constitute medical advice. The results are based on self-reported data and should not replace professional medical consultation. Please consult with a qualified healthcare provider before making any health-related decisions.', 10);
  
  yPos += 10;
  addText('About Nexus Biomedical Intelligence', 12, true);
  addText('Nexus Biomedical Intelligence provides AI-powered health assessment tools to help individuals understand their exposure to endocrine-disrupting chemicals and hormone health risks.', 10);
  addText('Visit us at: https://nexus-biomedical.manus.space', 10);

  // Generate buffer
  return Buffer.from(doc.output('arraybuffer'));
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { recipientEmail, recipientName, message, results, senderName } = req.body;

    // Validate required fields
    if (!recipientEmail || !results) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: recipientEmail and results are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address format' 
      });
    }

    // Generate PDF
    const pdfBuffer = generatePDFBuffer(
      results, 
      recipientName || 'Recipient', 
      senderName || 'Nexus User'
    );

    // Prepare email content
    const emailSubject = `Your EndoGuard Assessment Report from ${senderName || 'Nexus Biomedical'}`;
    
    let emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #D946EF 0%, #C026D3 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">EndoGuard Assessment Report</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Hello ${recipientName || 'there'},
          </p>
          
          ${message ? `
            <div style="background: white; padding: 20px; border-left: 4px solid #D946EF; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0; color: #6b7280; font-style: italic;">"${message}"</p>
              <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 14px;">— ${senderName || 'Nexus User'}</p>
            </div>
          ` : ''}
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            ${senderName || 'A Nexus user'} has shared their EndoGuard assessment report with you. 
            This comprehensive report includes:
          </p>
          
          <ul style="color: #374151; line-height: 1.8;">
            <li>Overall hormone disruption risk score</li>
            <li>EDC (Endocrine-Disrupting Chemical) exposure analysis</li>
            <li>Hormone health assessment</li>
            <li>Personalized recommendations</li>
            <li>Laboratory test suggestions</li>
          </ul>
          
          <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>⚠️ Medical Disclaimer:</strong> This assessment is for informational purposes only 
              and does not constitute medical advice. Please consult with a qualified healthcare provider 
              before making any health-related decisions.
            </p>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            The full report is attached as a PDF document.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nexus-biomedical.manus.space" 
               style="display: inline-block; background: linear-gradient(135deg, #D946EF 0%, #C026D3 100%); 
                      color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; 
                      font-weight: bold; font-size: 16px;">
              Take Your Own Assessment
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #9ca3af; text-align: center;">
            Nexus Biomedical Intelligence<br>
            AI-Powered Health Assessment Platform<br>
            <a href="https://nexus-biomedical.manus.space" style="color: #D946EF;">nexus-biomedical.manus.space</a>
          </p>
        </div>
      </div>
    `;

    // Send email with Resend
    const emailResponse = await resend.emails.send({
      from: 'Nexus Biomedical <noreply@manus.space>',
      to: recipientEmail,
      subject: emailSubject,
      html: emailBody,
      attachments: [
        {
          filename: 'EndoGuard_Assessment_Report.pdf',
          content: pdfBuffer,
        },
      ],
    });

    console.log('Email sent successfully:', emailResponse);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      emailId: emailResponse.id 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    });
  }
}
