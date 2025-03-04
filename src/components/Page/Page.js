import React, { useState, useRef, useEffect } from 'react';

const COMMANDS = [
  { label: 'Tableau', type: 'table' },
  { label: 'Encadré', type: 'callout' },
  { label: 'Code', type: 'code' },
  { label: 'Titre H1', type: 'h1' },
  { label: 'Titre H2', type: 'h2' },
  { label: 'Titre H3', type: 'h3' },
  { label: 'Séparateur', type: 'hr' }
];

const Page = ({ title, content, onTitleChange, onContentChange }) => {
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(COMMANDS);
  const [commandsPosition, setCommandsPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null);

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textareaRef.current.focus();
    }
  };

  // Fonction pour calculer la position du curseur
  const getCaretCoordinates = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { top: 0, left: 0 };

    const selectionStart = textarea.selectionStart;
    const textBeforeCaret = content.substring(0, selectionStart);
    
    // Créer un élément temporaire pour mesurer les dimensions du texte
    const mirror = document.createElement('div');
    mirror.style.position = 'absolute';
    mirror.style.top = '0';
    mirror.style.left = '0';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';
    mirror.style.padding = window.getComputedStyle(textarea).padding;
    mirror.style.width = window.getComputedStyle(textarea).width;
    mirror.style.font = window.getComputedStyle(textarea).font;
    mirror.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
    
    // Ajouter un span pour marquer la position du curseur
    mirror.innerHTML = textBeforeCaret.replace(/\n/g, '<br>') + '<span id="caret"></span>';
    document.body.appendChild(mirror);
    
    const caret = mirror.querySelector('#caret');
    const rect = caret.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();
    
    document.body.removeChild(mirror);
    
    return {
      top: rect.top - textareaRect.top + textarea.scrollTop,
      left: rect.left - textareaRect.left + textarea.scrollLeft
    };
  };

  const handleInput = (e) => {
    const value = e.target.value;
    onContentChange(value);
    
    const selectionStart = e.target.selectionStart;
    const textBeforeSelection = value.substring(0, selectionStart);
    const words = textBeforeSelection.split(/\s+/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('/')) {
      setShowCommands(true);
      setFilteredCommands(COMMANDS.filter(cmd => 
        cmd.label.toLowerCase().includes(lastWord.substring(1).toLowerCase())
      ));
      
      // Recalculer la position du curseur
      setTimeout(() => {
        const caretPos = getCaretCoordinates();
        const textareaRect = textareaRef.current.getBoundingClientRect();
        
        setCommandsPosition({
          top: textareaRect.top + caretPos.top + 20, // 20px en dessous du curseur
          left: textareaRect.left + caretPos.left
        });
      }, 0);
    } else {
      setShowCommands(false);
    }
  };

  const handleCommandSelect = (command) => {
    let newContent = content;
    
    // Trouver la position du dernier '/'
    const selectionStart = textareaRef.current.selectionStart;
    const textBeforeSelection = content.substring(0, selectionStart);
    const lastSlashIndex = textBeforeSelection.lastIndexOf('/');
    
    // Remplacer la commande par le contenu approprié
    const beforeCommand = content.substring(0, lastSlashIndex);
    const afterCommand = content.substring(selectionStart);
    
    if (command.type === 'table') {
      newContent = beforeCommand + '\n| Colonne 1 | Colonne 2 |\n|-----------|-----------|\n| Valeur 1  | Valeur 2  |' + afterCommand;
    } else if (command.type === 'callout') {
      newContent = beforeCommand + '\n🔹 Note: Saisissez votre texte ici...' + afterCommand;
    } else if (command.type === 'code') {
      newContent = beforeCommand + '\n```\nÉcrivez votre code ici\n```' + afterCommand;
    } else if (command.type === 'h1') {
      newContent = beforeCommand + '\n# Titre H1' + afterCommand;
    } else if (command.type === 'h2') {
      newContent = beforeCommand + '\n## Titre H2' + afterCommand;
    } else if (command.type === 'h3') {
      newContent = beforeCommand + '\n### Titre H3' + afterCommand;
    } else if (command.type === 'hr') {
      newContent = beforeCommand + '\n---' + afterCommand;
    }
    
    onContentChange(newContent);
    setShowCommands(false);
    
    // Remettre le focus sur le textarea après l'insertion
    setTimeout(() => {
      textareaRef.current.focus();
    }, 0);
  };

  // Suivre les changements de position du curseur
  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Gestionnaire pour les clics en dehors de la popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showCommands && !e.target.closest('.commands-popup')) {
        setShowCommands(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCommands]);

  // Ajouter des écouteurs pour suivre la position du curseur
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('mouseup', handleSelectionChange);
      textarea.addEventListener('keyup', handleSelectionChange);
      return () => {
        textarea.removeEventListener('mouseup', handleSelectionChange);
        textarea.removeEventListener('keyup', handleSelectionChange);
      };
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white m-4 rounded-lg shadow-sm overflow-hidden h-screen">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={handleTitleKeyDown}
        placeholder="Titre de la page"
        className="p-4 text-xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-200 transition"
      />
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={(e) => {
            // Naviguer dans la liste avec les flèches et sélectionner avec Entrée
            if (showCommands && filteredCommands.length > 0) {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === 'Escape') {
                e.preventDefault();
                if (e.key === 'Escape') {
                  setShowCommands(false);
                }
              }
            }
          }}
          placeholder='Commencez à taper ici ou entrez "/" pour afficher les commandes...'
          className="page-content flex-1 p-4 border-t border-gray-100 outline-none resize-none w-full h-full"
        />
        {showCommands && (
          <ul
            className="commands-popup absolute bg-white shadow-md rounded-md w-48 z-20"
            style={{ 
              top: `${commandsPosition.top}px`, 
              left: `${commandsPosition.left}px`,
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd) => (
                <li
                  key={cmd.type}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCommandSelect(cmd)}
                >
                  {cmd.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">Aucune commande trouvée</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;