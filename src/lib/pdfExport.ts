import html2pdf from 'html2pdf.js';

export const exportResumeToPDF = async (filename: string = 'resume.pdf'): Promise<void> => {
  const resumeElement = document.getElementById('resume-document');

  if (!resumeElement) {
    throw new Error('Resume element not found. Please make sure your resume is visible.');
  }

  const options = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  };

  try {
    await html2pdf().set(options).from(resumeElement).save();
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
};
