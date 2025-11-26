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
 * Export EndoGuard analysis to PDF
 * @param {Object} analysisData - EndoGuard analysis data
 */
export const exportEndoGuardPDF = async (analysisData) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `EndoGuard_Analysis_${timestamp}`;
  
  return await exportToPDF('endoguard-results', filename, {
    title: 'EndoGuard™ Hormone Health Analysis',
    subject: 'Comprehensive hormone health and EDC exposure assessment',
    keywords: 'hormone health, endocrine disruptors, PCOS, thyroid, menopause'
  });
};
