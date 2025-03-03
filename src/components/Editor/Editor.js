// src/components/Editor/Editor.js
import React, { useState } from 'react';
import Page from '../Page/Page';
import './Editor.css';

const Editor = ({ pages, pageId, onUpdatePage, onTitleChange }) => {
  const [isExporting, setIsExporting] = useState(false);
  const page = pages.find((p) => p.id === pageId);

  const handleExport = async (format) => {
    if (!page) return;
    
    setIsExporting(true);
    try {
      const content = `Titre: ${page.title}\n\n${page.content}`;

      if (format === 'doc') {
        const blob = new Blob([content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${page.title || 'page'}.doc`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        
        // Configurer la police et la taille
        doc.setFont('helvetica');
        doc.setFontSize(12);
        
        // Ajouter le titre en gras
        doc.setFontSize(16);
        doc.text(page.title, 20, 20);
        
        // Ajouter le contenu
        doc.setFontSize(12);
        
        // Gérer le saut de ligne et la pagination
        const splitText = doc.splitTextToSize(page.content, 170);
        doc.text(splitText, 20, 30);
        
        doc.save(`${page.title || 'page'}.pdf`);
      }
    } catch (error) {
      console.error("Erreur d'exportation:", error);
      alert("Une erreur s'est produite lors de l'exportation");
    } finally {
      setIsExporting(false);
    }
  };

  const handleTitleChange = (newTitle) => {
    onTitleChange(pageId, newTitle);
  };

  if (!page) {
    return <div className="editor">Page non trouvée</div>;
  }

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button 
          onClick={() => handleExport('doc')} 
          disabled={isExporting}
          className="export-button"
        >
          {isExporting ? 'Exportation...' : 'Exporter en DOC'}
        </button>
        <button 
          onClick={() => handleExport('pdf')} 
          disabled={isExporting}
          className="export-button"
        >
          {isExporting ? 'Exportation...' : 'Exporter en PDF'}
        </button>
      </div>
      <Page
        title={page.title}
        content={page.content}
        onTitleChange={handleTitleChange}
        onContentChange={(newContent) =>
          onUpdatePage(pageId, { content: newContent })
        }
      />
    </div>
  );
};

export default Editor;