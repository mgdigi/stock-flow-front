import type { Sale } from "../types";
import { API_BASE_URL } from "../config/api";
import { Notifications } from "../utils/notifications";

export async function generateInvoicePDF(sale: Sale): Promise<void> {
  const userInfo = localStorage.getItem("userInfo");
  const COMPANY_INFO = JSON.parse(userInfo || "{}");
  
  console.log('COMPANY_INFO pour facture:', COMPANY_INFO);
  console.log('Logo path:', COMPANY_INFO.logo);

  // Récupérer les détails des produits
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des produits");
  }

  const products = await response.json();

  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();

  // Palette de couleurs simple : bleu et blanc uniquement
  const primaryBlue: [number, number, number] = [59, 130, 246]; // Bleu moderne
  const lightBlue: [number, number, number] = [147, 197, 253]; // Bleu clair
  const darkBlue: [number, number, number] = [29, 78, 216]; // Bleu foncé
  const white: [number, number, number] = [255, 255, 255];
  const lightGray: [number, number, number] = [248, 250, 252];
  const darkGray: [number, number, number] = [51, 65, 85];

  // === HEADER AVEC DESIGN BLEU ET BLANC ===
  
  // Fond principal bleu
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 0, 210, 55, "F");
  
  // Effet de dégradé avec superposition bleu clair
  doc.setFillColor(...lightBlue);
  doc.setGState(doc.GState({ opacity: 0.3 }));
  doc.rect(0, 0, 210, 55, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  // Ligne accent en bleu foncé
  doc.setFillColor(...darkBlue);
  doc.rect(0, 50, 210, 3, "F");
  
  // Formes géométriques décoratives blanches
  doc.setFillColor(...white);
  doc.setGState(doc.GState({ opacity: 0.1 }));
  doc.circle(200, 15, 25, "F");
  doc.circle(20, 45, 15, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  // === LOGO ET INFORMATIONS ENTREPRISE ===
  
  // Container blanc pour le logo
  doc.setFillColor(...white);
  doc.setDrawColor(...white);
  doc.setLineWidth(0);
  doc.roundedRect(150, 10, 50, 35, 8, 8, "F");
  
  // Ombre subtile
  doc.setFillColor(0, 0, 0);
  doc.setGState(doc.GState({ opacity: 0.1 }));
  doc.roundedRect(152, 12, 50, 35, 8, 8, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  if (COMPANY_INFO.logo) {
  try {
    // Si c'est une URL (Cloudinary), on peut directement l'utiliser
    doc.addImage(COMPANY_INFO.logo, "PNG", 155, 15, 40, 25);
  } catch (error) {
    console.warn("Erreur lors de l'ajout du logo:", error);

    // Logo de fallback en bleu
    doc.setFillColor(...primaryBlue);
    doc.circle(175, 27.5, 15, "F");

    doc.setFillColor(...white);
    doc.setGState(doc.GState({ opacity: 0.2 }));
    doc.circle(175, 27.5, 12, "F");
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setTextColor(...white);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const initials = COMPANY_INFO.entreprise?.substring(0, 2).toUpperCase() || "CO";
    doc.text(initials, 175, 31, { align: "center" });
  }
} else {
  // Logo de fallback en bleu
  doc.setFillColor(...primaryBlue);
  doc.circle(175, 27.5, 15, "F");

  doc.setTextColor(...white);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const initials = COMPANY_INFO.entreprise?.substring(0, 2).toUpperCase() || "CO";
  doc.text(initials, 175, 31, { align: "center" });
}


  // Nom de l'entreprise en blanc
  doc.setTextColor(...white);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(String(COMPANY_INFO.entreprise || "VOTRE ENTREPRISE"), 15, 25);

  // Informations de contact en blanc
  doc.setFontSize(9);
  doc.setTextColor(240, 240, 240);
  doc.setFont("helvetica", "normal");

  doc.text(String(COMPANY_INFO.adress || "Adresse"), 15, 32);
  doc.text(`Dakar, SENEGAL  |  Tel: ${COMPANY_INFO.telephone || "N/A"}`, 15, 37);

  if (COMPANY_INFO.email) {
    doc.text(`Email: ${String(COMPANY_INFO.email)}`, 15, 42);
  }

  // === SECTION FACTURE ===
  
  // Container principal blanc avec bordure bleue
  doc.setFillColor(0, 0, 0);
  doc.setGState(doc.GState({ opacity: 0.05 }));
  doc.roundedRect(117, 63, 80, 35, 6, 6, "F");
  doc.setGState(doc.GState({ opacity: 1 }));
  
  doc.setFillColor(...white);
  doc.setDrawColor(...lightBlue);
  doc.setLineWidth(0.5);
  doc.roundedRect(115, 61, 80, 35, 6, 6, "FD");

  // Badge "FACTURE" en bleu
  doc.setFillColor(...primaryBlue);
  doc.roundedRect(125, 68, 60, 12, 6, 6, "F");
  
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE", 155, 76, { align: "center" });

  // Numéro de facture
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  const invoiceNumber = sale._id?.slice(-8).toUpperCase() || "INV-" + Date.now().toString().slice(-6);
  doc.text(`No ${invoiceNumber}`, 155, 85, { align: "center" });

  // Date
  const formattedDate = new Date(sale.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.text(`${formattedDate}`, 155, 91, { align: "center" });

  // === LIGNE SÉPARATRICE ===
  
  doc.setDrawColor(...primaryBlue);
  doc.setLineWidth(2);
  doc.line(15, 105, 195, 105);
  
  // Points décoratifs en bleu
  doc.setFillColor(...primaryBlue);
  const dotPositions = [25, 55, 85, 115, 145, 175];
  dotPositions.forEach(x => {
    doc.circle(x, 105, 2, "F");
  });

  // === SECTION CLIENT ===
  
  // Container avec ombre
  doc.setFillColor(0, 0, 0);
  doc.setGState(doc.GState({ opacity: 0.03 }));
  doc.roundedRect(15, 115, 180, 40, 8, 8, "F");
  doc.setGState(doc.GState({ opacity: 1 }));
  
  doc.setFillColor(...white);
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(1);
  doc.roundedRect(15, 115, 180, 40, 8, 8, "FD");

  // Barre latérale bleue
  doc.setFillColor(...primaryBlue);
  doc.roundedRect(15, 115, 6, 40, 3, 3, "F");

  // Label "FACTURE A" en bleu
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE A", 28, 126);

  // Informations client
  doc.setTextColor(...darkGray);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const clientName = sale.client?.name || sale.clientInfo?.name || "Client inconnu";
  doc.text(String(clientName), 28, 135);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const clientPhone = sale.client?.phone || sale.clientInfo?.phone || "N/A";
  doc.text(`Tel: ${String(clientPhone)}`, 28, 142);

  const clientEmail = sale.client?.email || sale.clientInfo?.email;
  if (clientEmail) {
    doc.text(`Email: ${String(clientEmail)}`, 28, 148);
  }

  // Timestamp
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(`Genere le ${new Date().toLocaleString("fr-FR")}`, 130, 150);

  // === TABLEAU PRODUITS ===
  
  let yPos = 165;

  // Header du tableau en bleu
  doc.setFillColor(...primaryBlue);
  doc.roundedRect(15, yPos, 180, 15, 6, 6, "F");

  // Headers
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PRODUIT", 22, yPos + 10);
  doc.text("QTE", 90, yPos + 10);
  doc.text("PRIX UNIT.", 115, yPos + 10);
  doc.text("TOTAL", 160, yPos + 10);

  yPos += 15;

  // Lignes de produits
  doc.setTextColor(...darkGray);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  let calculatedTotal = 0;

  sale.products.forEach((item, index) => {
    // Alternance de couleur
    if (index % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.roundedRect(15, yPos, 180, 12, 3, 3, "F");
    }

    // Trouver les détails du produit
     

    const product = products.find((p: any) => {  
       p._id === item.product._id
       }
  
  );
    const productName = product ? product.name : "Produit non trouve";
    const unitPrice = item.unitPrice || product?.price || 0;
    const lineTotal = unitPrice * item.quantity;

    calculatedTotal += lineTotal;

    // Affichage sans caractères spéciaux
    doc.text(String(productName), 22, yPos + 8);
    doc.text(String(item.quantity), 90, yPos + 8);
    doc.text(`${unitPrice} FCFA`, 115, yPos + 8);
    
    doc.setFont("helvetica", "bold");
    doc.text(`${lineTotal} FCFA`, 160, yPos + 8);
    doc.setFont("helvetica", "normal");

    yPos += 12;
  });

  // === SECTION TOTAUX ===
  
  yPos += 15;
  
  // Container pour les totaux
  doc.setFillColor(...lightGray);
  doc.roundedRect(110, yPos, 85, 35, 6, 6, "F");
  
  // Bordure bleue
  doc.setDrawColor(...lightBlue);
  doc.setLineWidth(0.5);
  doc.roundedRect(110, yPos, 85, 35, 6, 6, "D");

  yPos += 12;
  
  // Sous-total
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Sous-total:", 115, yPos);
  const finalTotal = sale.total || sale.totalAmount || calculatedTotal;
  doc.text(`${finalTotal} FCFA`, 150, yPos);

  yPos += 8;
  
  // Ligne séparatrice bleue
  doc.setDrawColor(...primaryBlue);
  doc.setLineWidth(1);
  doc.line(115, yPos, 190, yPos);

  yPos += 12;
  
  // Total final avec fond bleu
  doc.setFillColor(...primaryBlue);
  doc.roundedRect(111, yPos - 5, 85, 12, 4, 4, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...white);
  doc.text("TOTAL A PAYER:", 116, yPos + 2);
  doc.setFontSize(14);
  doc.text(`${finalTotal} FCFA`, 185, yPos + 2, { align: "right" });

  // === FOOTER ===
  
  yPos = 260;
  
  // Message de remerciement avec fond bleu clair
  doc.setFillColor(...lightBlue);
  doc.setGState(doc.GState({ opacity: 0.2 }));
  doc.roundedRect(15, yPos, 180, 25, 6, 6, "F");
  doc.setGState(doc.GState({ opacity: 1 }));
  
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Merci pour votre confiance !", 105, yPos + 8, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkGray);
  doc.text(
    `${String(COMPANY_INFO.username || COMPANY_INFO.entreprise)} | ${String(COMPANY_INFO.adress)}`,
    105,
    yPos + 15,
    { align: "center" }
  );
  
  doc.text(
    `facturé le ${new Date().toLocaleDateString("fr-FR")}`,
    105,
    yPos + 20,
    { align: "center" }
  );

  // === TÉLÉCHARGEMENT ===
  
  try {
    const clientNameForFile = sale.client?.name || sale.clientInfo?.name || "Client";
    const filename = `Facture_${sale._id?.slice(-8) || "N/A"}_${String(clientNameForFile).replace(/\s+/g, "_")}.pdf`;

    setTimeout(() => {
      try {
        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setTimeout(() => URL.revokeObjectURL(url), 1000);

        console.log("Facture telechargee avec succes:", filename);
        Notifications.success("Succes", "Facture generee et telechargee avec succes !");
      } catch (blobError) {
        console.error("Erreur telechargement blob:", blobError);

        const pdfDataUri = doc.output("datauristring");
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <div style="padding: 20px; font-family: Arial, sans-serif;">
              <h2>Votre Facture</h2>
              <iframe width='100%' height='600px' src='${pdfDataUri}' style="border: 1px solid #ccc; border-radius: 8px;"></iframe>
              <p style="margin-top: 10px; color: #666;">Astuce: Clic droit sur le PDF > Enregistrer sous...</p>
            </div>
          `);
        } else {
          Notifications.warning(
            "Attention",
            "Veuillez autoriser les pop-ups pour telecharger la facture"
          );
        }
      }
    }, 500);
  } catch (saveError) {
    console.error("Erreur lors de la sauvegarde:", saveError);

    const result = await Notifications.confirm(
      "Telechargement echoue",
      "Le telechargement automatique a echoue. Voulez-vous ouvrir la facture dans un nouvel onglet ?"
    );

    if (result.isConfirmed) {
      const pdfDataUri = doc.output("datauristring");
      window.open(pdfDataUri, "_blank");
    }
  }
}

// === EXTENSIONS ET UTILITAIRES ===

declare module "jspdf" {
  interface jsPDF {
    roundedRect(
      x: number,
      y: number,
      width: number,
      height: number,
      rx: number,
      ry: number,
      style?: string
    ): jsPDF;
  }
}

// Extension pour les rectangles arrondis
if (typeof (window as any).jsPDF !== "undefined") {
  (window as any).jsPDF.API.roundedRect = function (
    x: number,
    y: number,
    width: number,
    height: number,
    rx: number,
    ry: number,
    style: string = "S"
  ) {
    const k = this.internal.scaleFactor;
    const hp = this.internal.pageSize.height || this.internal.pageSize.getHeight();
    
    x *= k;
    y = (hp - y) * k;
    width *= k;
    height *= k;
    rx *= k;
    ry *= k;
    
    this.internal.write([
      (x + rx).toFixed(2), (y).toFixed(2), 'm',
      (x + width - rx).toFixed(2), (y).toFixed(2), 'l',
      (x + width).toFixed(2), (y).toFixed(2), (x + width).toFixed(2), (y - ry).toFixed(2), 'c',
      (x + width).toFixed(2), (y - height + ry).toFixed(2), 'l',
      (x + width).toFixed(2), (y - height).toFixed(2), (x + width - rx).toFixed(2), (y - height).toFixed(2), 'c',
      (x + rx).toFixed(2), (y - height).toFixed(2), 'l',
      (x).toFixed(2), (y - height).toFixed(2), (x).toFixed(2), (y - height + ry).toFixed(2), 'c',
      (x).toFixed(2), (y - ry).toFixed(2), 'l',
      (x).toFixed(2), (y).toFixed(2), (x + rx).toFixed(2), (y).toFixed(2), 'c'
    ].join(' '));
    
    if (style === 'F') {
      this.internal.write('f');
    } else if (style === 'FD' || style === 'DF') {
      this.internal.write('B');
    } else {
      this.internal.write('S');
    }
    
    return this;
  };
}



