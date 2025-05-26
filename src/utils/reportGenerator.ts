
import jsPDF from 'jspdf';

interface ReportData {
  title: string;
  period: string;
  userName?: string;
  type: 'periodic' | 'custom' | 'attendance';
  data?: any;
}

export const generatePDF = (reportData: ReportData): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  // Header - Logo et titre de l'entreprise
  doc.setFillColor(59, 130, 246); // Blue color for header
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  // Logo simulé (rectangle bleu avec texte)
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, 8, 40, 14, 'F');
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TL', margin + 18, 18);
  
  // Nom de l'entreprise
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('TransLogica', margin + 65, 18);
  
  // Date et heure de génération
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  doc.setFontSize(10);
  doc.text(`Généré le ${dateStr} à ${timeStr}`, pageWidth - margin - 80, 18);
  
  // Titre du rapport
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(reportData.title, margin, 50);
  
  // Période couverte
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Période: ${reportData.period}`, margin, 65);
  
  // Utilisateur
  if (reportData.userName) {
    doc.text(`Généré par: ${reportData.userName}`, margin, 75);
  }
  
  // Contenu du rapport selon le type
  let yPosition = 95;
  
  if (reportData.type === 'periodic') {
    yPosition = addPeriodicReportContent(doc, margin, yPosition, reportData.title);
  } else if (reportData.type === 'custom') {
    yPosition = addCustomReportContent(doc, margin, yPosition, reportData.title);
  } else if (reportData.type === 'attendance') {
    yPosition = addAttendanceReportContent(doc, margin, yPosition, reportData.period);
  }
  
  // Pied de page
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFillColor(240, 240, 240);
  doc.rect(0, footerY - 5, pageWidth, 25, 'F');
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text('TransLogica - Système de Gestion de Transport', margin, footerY + 5);
  doc.text('Contact: support@translogica.com | Tél: +212 5XX XXX XXX', margin, footerY + 12);
  
  return doc.output('blob');
};

const addPeriodicReportContent = (doc: jsPDF, margin: number, startY: number, title: string): number => {
  let y = startY;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Résumé Exécutif', margin, y);
  y += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (title.includes('mensuel')) {
    const monthlyStats = [
      'Nombre total de livraisons: 245',
      'Taux de ponctualité: 92%',
      'Satisfaction client: 4.7/5',
      'Distance totale parcourue: 15,420 km',
      'Consommation carburant: 2,156 L',
      'Coût opérationnel: 45,230 DH'
    ];
    
    monthlyStats.forEach(stat => {
      doc.text(`• ${stat}`, margin + 5, y);
      y += 8;
    });
    
  } else if (title.includes('trimestriel')) {
    const quarterlyStats = [
      'Nombre total de livraisons: 712',
      'Performance moyenne: 89%',
      'Rentabilité: +12.5%',
      'Nouveaux clients: 23',
      'Taux de rétention: 94%',
      'Économies réalisées: 12,450 DH'
    ];
    
    quarterlyStats.forEach(stat => {
      doc.text(`• ${stat}`, margin + 5, y);
      y += 8;
    });
    
  } else if (title.includes('annuel')) {
    const yearlyStats = [
      'Chiffre d\'affaires: 1,245,000 DH',
      'Croissance: 15%',
      'Nouveaux clients: 87',
      'Livraisons totales: 2,856',
      'Taux de satisfaction: 4.6/5',
      'ROI: 18.5%'
    ];
    
    yearlyStats.forEach(stat => {
      doc.text(`• ${stat}`, margin + 5, y);
      y += 8;
    });
  }
  
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Tendances et Recommandations', margin, y);
  y += 10;
  
  doc.setFont('helvetica', 'normal');
  const recommendations = [
    'Optimisation des itinéraires pour réduire les coûts',
    'Formation continue des chauffeurs',
    'Maintenance préventive des véhicules',
    'Digitalisation des processus de livraison'
  ];
  
  recommendations.forEach(rec => {
    doc.text(`• ${rec}`, margin + 5, y);
    y += 8;
  });
  
  return y;
};

const addCustomReportContent = (doc: jsPDF, margin: number, startY: number, title: string): number => {
  let y = startY;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Analyse Personnalisée', margin, y);
  y += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const customData = [
    'Critères sélectionnés: Performance opérationnelle',
    'Période d\'analyse: Données personnalisées',
    'Méthodologie: Analyse comparative',
    '',
    'Résultats clés:',
    '• Efficacité des routes: 87%',
    '• Temps moyen de livraison: 2.3h',
    '• Taux d\'incidents: 1.2%',
    '• Satisfaction client: 4.5/5'
  ];
  
  customData.forEach(line => {
    if (line === '') {
      y += 5;
    } else {
      doc.text(line, margin + (line.startsWith('•') ? 5 : 0), y);
      y += 8;
    }
  });
  
  return y;
};

const addAttendanceReportContent = (doc: jsPDF, margin: number, startY: number, period: string): number => {
  let y = startY;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Rapport de Présence', margin, y);
  y += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const attendanceData = [
    `Période: ${period}`,
    '',
    'Statistiques globales:',
    '• Taux de présence: 83%',
    '• Taux de ponctualité: 91%',
    '• Jours travaillés: 21',
    '• Absences justifiées: 3',
    '• Absences non justifiées: 1',
    '• Heures supplémentaires: 45h',
    '',
    'Top performers:',
    '• Thomas Durand: 98% présence',
    '• Sophie Lefèvre: 96% présence',
    '• Pierre Martin: 94% présence'
  ];
  
  attendanceData.forEach(line => {
    if (line === '') {
      y += 5;
    } else {
      doc.text(line, margin + (line.startsWith('•') ? 5 : 0), y);
      y += 8;
    }
  });
  
  return y;
};

export const downloadReport = (reportName: string, type: 'periodic' | 'custom' | 'attendance' = 'periodic', period?: string) => {
  const reportData: ReportData = {
    title: reportName,
    period: period || 'Non spécifiée',
    userName: 'Utilisateur actuel', // Could be dynamic based on auth
    type: type
  };
  
  const blob = generatePDF(reportData);
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${reportName.replace(/\s+/g, '_')}.pdf`;
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
