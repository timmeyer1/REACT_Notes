// src/components/Page/Page.js
import React from 'react';
import './Page.css';

const Page = ({ title, content, onTitleChange, onContentChange }) => {
  return (
    <div className="page">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Titre de la page"
        className="page-title"
      />
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Commencez à taper ici..."
        className="page-content"
      />
    </div>
  );
};

export default Page;