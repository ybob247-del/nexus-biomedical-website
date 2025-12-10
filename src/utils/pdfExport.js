import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export analysis results to PDF
 * @param {string} elementId - ID of the HTML element to convert to PDF
 * @param {string} filename - Name of the PDF file (without .pdf extension)
 * @param {Object} options - Additional options for PDF generation
 */
export const exportToPDF = async (elementId, filename, options = {}) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'pdf-loading';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 2rem 3rem;
      border-radius: 12px;
      z-index: 10000;
      font-size: 1.2rem;
      text-align: center;
    `;
    loadingDiv.innerHTML = '📄 Generating PDF Report...<br><small style="opacity: 0.7;">This may take a few seconds</small>';
    document.body.appendChild(loadingDiv);

    // Capture element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: options.backgroundColor || '#0a1628',
      ...options.html2canvasOptions
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      heightLeft -= pageHeight;
    }

    // Add metadata
    pdf.setProperties({
      title: options.title || filename,
      subject: options.subject || 'Clinical Analysis Report',
      author: 'Nexus Biomedical Intelligence',
      creator: 'Nexus Biomedical Intelligence',
      keywords: options.keywords || 'healthcare, analysis, clinical'
    });

    // Save PDF
    pdf.save(`${filename}.pdf`);

    // Remove loading indicator
    document.body.removeChild(loadingDiv);

    return { success: true, message: 'PDF generated successfully' };
  } catch (error) {
    console.error('PDF generation error:', error);
    
    // Remove loading indicator if it exists
    const loadingDiv = document.getElementById('pdf-loading');
    if (loadingDiv) {
      document.body.removeChild(loadingDiv);
    }

    // Show error message
    alert('Failed to generate PDF. Please try again or contact support.');
    
    return { success: false, error: error.message };
  }
};

/**
 * Export RxGuard analysis to PDF
 * @param {Object} analysisData - RxGuard analysis data
 */
export const exportRxGuardPDF = async (analysisData) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `RxGuard_Analysis_${timestamp}`;
  
  return await exportToPDF('rxguard-results', filename, {
    title: 'RxGuard™ Drug Interaction Analysis',
    subject: 'Comprehensive drug interaction safety analysis',
    keywords: 'drug interactions, medication safety, pharmacy, clinical decision support'
  });
};

/**
 * Export EndoGuard analysis to PDF with professional formatting
 * @param {Object} results - EndoGuard assessment results
 * @param {Object} user - User information
 */
export const exportEndoGuardPDF = async (results, user) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text, fontSize = 10, fontStyle = 'normal', color = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach(line => {
      checkPageBreak();
      pdf.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 3;
  };

  // ===== PAGE 1: HEADER & OVERVIEW =====
  
  // Nexus Biomedical Intelligence Header
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(56, 189, 248); // cyan-400
  pdf.text('Nexus Biomedical Intelligence', margin, 15);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text('EndoGuard™ Hormone Disruption Assessment Report', margin, 25);
  
  pdf.setFontSize(9);
  pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, 33);

  yPosition = 50;

  // Patient Information
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Patient Information', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  if (user) {
    addText(`Name: ${user.name || 'N/A'}`);
    addText(`Email: ${user.email || 'N/A'}`);
  }
  if (results.demographics) {
    addText(`Age: ${results.demographics.age || 'N/A'}`);
    addText(`Biological Sex: ${results.demographics.biologicalSex || 'N/A'}`);
    if (results.demographics.height && results.demographics.weight) {
      addText(`Height: ${results.demographics.height} cm | Weight: ${results.demographics.weight} kg`);
      if (results.demographics.bmi) {
        addText(`BMI: ${results.demographics.bmi} (${results.demographics.bmiCategory?.category || 'N/A'})`);
      }
    }
  }
  addText(`Assessment Date: ${results.completedAt ? new Date(results.completedAt).toLocaleDateString() : 'N/A'}`);
  
  yPosition += 5;

  // Overall Risk Assessment
  checkPageBreak(40);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Risk Assessment', margin, yPosition);
  yPosition += 10;

  // Risk level box
  const riskColors = {
    'LOW': [34, 197, 94],      // green-500
    'MODERATE': [251, 146, 60], // orange-400
    'HIGH': [239, 68, 68],      // red-500
    'VERY HIGH': [220, 38, 38]  // red-600
  };
  
  const riskLevel = results.overallRisk?.level || 'UNKNOWN';
  const riskScore = results.overallRisk?.score || 0;
  const riskColor = riskColors[riskLevel] || [100, 100, 100];

  pdf.setFillColor(...riskColor);
  pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text(`Risk Level: ${riskLevel}`, margin + 5, yPosition + 10);
  
  pdf.setFontSize(16);
  pdf.text(`Score: ${riskScore}/100`, margin + 5, yPosition + 20);
  
  yPosition += 30;

  // Risk description
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const riskDescriptions = {
    'HIGH': 'Your assessment indicates significant hormone disruption risk. Immediate action recommended.',
    'MODERATE': 'Your assessment shows moderate risk factors. Lifestyle changes can make a significant difference.',
    'LOW': 'Your assessment shows relatively low risk. Continue healthy habits and stay informed.'
  };
  addText(riskDescriptions[riskLevel] || 'Assessment completed.');

  // ===== EDC EXPOSURE =====
  
  checkPageBreak(50);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EDC Exposure Assessment', margin, yPosition);
  yPosition += 10;

  if (results.edcExposure) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    addText(`Exposure Risk Score: ${results.edcExposure.riskScore}/100 (${results.edcExposure.riskLevel} RISK)`);
    
    if (results.edcExposure.riskFactors && results.edcExposure.riskFactors.length > 0) {
      yPosition += 5;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Risk Factors:', margin, yPosition);
      yPosition += 7;
      
      results.edcExposure.riskFactors.forEach((factor, index) => {
        checkPageBreak(25);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${factor.factor}`, margin + 5, yPosition);
        yPosition += 5;
        
        pdf.setFont('helvetica', 'normal');
        addText(`   Impact: ${factor.impact}`, 9);
        addText(`   Action: ${factor.recommendation}`, 9);
        yPosition += 3;
      });
    }
  }

  // ===== HORMONE HEALTH =====
  
  checkPageBreak(50);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hormone Health Analysis', margin, yPosition);
  yPosition += 10;

  if (results.hormoneHealth) {
    pdf.setFontSize(11);
    addText(`Symptoms Reported: ${results.hormoneHealth.symptomCount || 0}`);
    addText(`Symptom Severity: ${results.hormoneHealth.symptomSeverity || 0}/10`);
    addText(`Systems Affected: ${results.hormoneHealth.systemsAffected?.length || 0}`);
    
    if (results.hormoneHealth.systemsAffected && results.hormoneHealth.systemsAffected.length > 0) {
      yPosition += 5;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Affected Hormone Systems:', margin, yPosition);
      yPosition += 7;
      
      results.hormoneHealth.systemsAffected.forEach(system => {
        checkPageBreak();
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`• ${system}`, margin + 5, yPosition);
        yPosition += 5;
      });
    }
  }

  // ===== AI INSIGHTS =====
  
  if (results.aiInsights?.symptomPattern && !results.aiInsights.symptomPattern.aiError) {
    checkPageBreak(50);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(102, 126, 234); // purple
    pdf.text('AI-Powered Analysis (GPT-4)', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    addText(`Primary Pattern: ${results.aiInsights.symptomPattern.primaryPattern}`);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    addText(results.aiInsights.symptomPattern.clinicalReasoning);
    
    if (results.aiInsights.symptomPattern.confidence) {
      addText(`Analysis Confidence: ${Math.round(results.aiInsights.symptomPattern.confidence * 100)}%`);
    }
  }

  // ===== RECOMMENDATIONS =====
  
  checkPageBreak(50);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Personalized Recommendations', margin, yPosition);
  yPosition += 10;

  if (results.recommendations && results.recommendations.length > 0) {
    results.recommendations.forEach((rec, index) => {
      checkPageBreak(20);
      
      // Priority badge
      const priorityColors = {
        'urgent': [220, 38, 38],
        'high': [239, 68, 68],
        'medium': [251, 146, 60],
        'low': [34, 197, 94]
      };
      const priorityColor = priorityColors[rec.priority] || [100, 100, 100];
      
      pdf.setFillColor(...priorityColor);
      pdf.roundedRect(margin, yPosition - 3, 20, 6, 1, 1, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text(rec.priority.toUpperCase(), margin + 2, yPosition + 1);
      
      // Category
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(rec.category.toUpperCase(), margin + 25, yPosition + 1);
      yPosition += 7;
      
      // Recommendation text
      pdf.setFont('helvetica', 'normal');
      addText(rec.text, 10);
      
      if (rec.rationale) {
        pdf.setFont('helvetica', 'italic');
        addText(`Why: ${rec.rationale}`, 9, 'italic', [75, 85, 99]);
      }
      
      yPosition += 3;
    });
  }

  // ===== TEST RECOMMENDATIONS =====
  
  if (results.testRecommendations && results.testRecommendations.length > 0) {
    checkPageBreak(50);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommended Laboratory Tests', margin, yPosition);
    yPosition += 10;
    
    results.testRecommendations.forEach((test, index) => {
      checkPageBreak(15);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${test.test}`, margin, yPosition);
      yPosition += 6;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      addText(`   ${test.rationale}`, 9);
    });
  }

  // ===== FOOTER ON LAST PAGE =====
  
  checkPageBreak(40);
  yPosition = pageHeight - 40;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Medical Disclaimer', margin, yPosition);
  yPosition += 6;
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  const disclaimer = 'This assessment is for educational and informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. The information provided should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.';
  const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth);
  disclaimerLines.forEach(line => {
    pdf.text(line, margin, yPosition);
    yPosition += 3;
  });

  // Page numbers
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
    pdf.text('© Nexus Biomedical Intelligence', margin, pageHeight - 10);
  }

  // Save PDF
  const fileName = `EndoGuard_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
  
  return { success: true, message: 'PDF generated successfully', fileName };
};
