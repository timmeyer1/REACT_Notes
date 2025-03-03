// src/components/Editor/Editor.js
import React from 'react';
import Page from '../Page/Page';
import './Editor.css';

const Editor = ({ selectedPage, pages, onUpdatePage }) => {
  const page = pages.find((p) => p.id === selectedPage);

  const handleExport = (format) => {
    if (!page) return;

    const content = `Titre: ${page.title}\n\n${page.content}`;

    if (format === 'doc') {
      const blob = new Blob([content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${page.title || 'page'}.doc`;
      link.click();
    } else if (format === 'pdf') {
      import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF();
        doc.text(content, 10, 10);
        doc.save(`${page.title || 'page'}.pdf`);
      });
    }
  };

  if (!page) {
    return <div className="editor">Sélectionnez une page</div>;
  }

  return (
    <div className="editor">
      <div className="export-buttons">
        <button onClick={() => handleExport('doc')}>Exporter en DOC</button>
        <button onClick={() => handleExport('pdf')}>Exporter en PDF</button>
      </div>
      <Page
        title={page.title}
        content={page.content}
        onTitleChange={(newTitle) => onUpdatePage(page.id, { title: newTitle })}
        onContentChange={(newContent) =>
          onUpdatePage(page.id, { content: newContent })
        }
      />
    </div>
  );
};

export default Editor;