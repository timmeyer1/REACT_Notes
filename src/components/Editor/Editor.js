// src/components/Editor/Editor.js
import React from 'react';
import Page from '../Page/Page';
import './Editor.css';

const Editor = ({ selectedPage, pages, onUpdatePage }) => {
  const page = pages.find((p) => p.id === selectedPage);

  if (!page) {
    return <div className="editor">Sélectionnez une page</div>;
  }

  return (
    <div className="editor">
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