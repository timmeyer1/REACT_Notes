// src/components/Editor/Editor.js
import React, { useState } from 'react';
import Page from '../Page/Page';

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
        
        doc.setFont('helvetica');
        doc.setFontSize(16);
        doc.text(page.title, 20, 20);
        
        doc.setFontSize(12);
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
    return <div className="flex-1 flex items-center justify-center text-gray-500">Page non trouvée</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="bg-white p-3 border-b border-gray-200 shadow-sm flex space-x-2">
        <button 
          onClick={() => handleExport('doc')} 
          disabled={isExporting}
          className="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium disabled:opacity-50"
        >
          {isExporting ? 'Exportation...' : 'Exporter en DOC'}
        </button>
        <button 
          onClick={() => handleExport('pdf')} 
          disabled={isExporting}
          className="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium disabled:opacity-50"
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