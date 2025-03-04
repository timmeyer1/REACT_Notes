// src/components/Page/Page.js
import React from 'react';

const Page = ({ title, content, onTitleChange, onContentChange }) => {
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.querySelector('.page-content').focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white m-4 rounded-lg shadow-sm overflow-hidden">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={handleTitleKeyDown}
        placeholder="Titre de la page"
        className="p-4 text-xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-200 transition"
      />
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Commencez à taper ici..."
        className="page-content flex-1 p-4 border-t border-gray-100 outline-none resize-none"
        autoFocus={!content}
      />
    </div>
  );
};

export default Page;