// src/components/Page/Page.js
import React from 'react';
import './Page.css';

const Page = ({ title, content, onTitleChange, onContentChange }) => {
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.querySelector('.page-content').focus();
    }
  };

  return (
    <div className="page">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={handleTitleKeyDown}
        placeholder="Titre de la page"
        className="page-title"
      />
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Commencez à taper ici..."
        className="page-content"
        autoFocus={!content}
      />
    </div>
  );
};

export default Page;