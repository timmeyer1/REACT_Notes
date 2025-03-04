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
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const textareaRef = useRef(null);
  const commandsRef = useRef(null);
  const [lastSlashIndex, setLastSlashIndex] = useState(-1);

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
    
    // Vérifier si un '/' est présent dans le texte avant le curseur
    const lastSlashPos = textBeforeSelection.lastIndexOf('/');
    
    if (lastSlashPos !== -1) {
      // Vérifier s'il y a un espace ou un saut de ligne avant le slash, ou si c'est au début du texte
      const charBeforeSlash = lastSlashPos > 0 ? textBeforeSelection.charAt(lastSlashPos - 1) : null;
      
      if (lastSlashPos === 0 || charBeforeSlash === ' ' || charBeforeSlash === '\n') {
        // Vérifier s'il y a un espace après le slash
        const textAfterSlash = textBeforeSelection.substring(lastSlashPos + 1);
        const nextSpace = textAfterSlash.indexOf(' ');
        const searchText = nextSpace === -1 ? textAfterSlash : textAfterSlash.substring(0, nextSpace);
        
        setLastSlashIndex(lastSlashPos);
        setShowCommands(true);
        setSelectedCommandIndex(0);
        setFilteredCommands(
          COMMANDS.filter(cmd => cmd.label.toLowerCase().includes(searchText.toLowerCase()))
        );
        
        // Recalculer la position du curseur
        setTimeout(() => {
          const caretPos = getCaretCoordinates();
          const textareaRect = textareaRef.current.getBoundingClientRect();
          
          setCommandsPosition({
            top: textareaRect.top + caretPos.top + 20, // 20px en dessous du curseur
            left: textareaRect.left + caretPos.left
          });
        }, 0);
        
        return;
      }
    }
    
    setShowCommands(false);
  };

  const insertCommandContent = (command) => {
    if (!textareaRef.current) return;
    
    const selectionStart = textareaRef.current.selectionStart;
    const textBeforeSelection = content.substring(0, selectionStart);
    
    // Identifier le texte de la commande à remplacer
    const lastSlashPos = lastSlashIndex;
    if (lastSlashPos === -1) return;
    
    const beforeCommand = content.substring(0, lastSlashPos);
    const afterCommand = content.substring(selectionStart);
    
    let insertText = '';
    
    switch (command.type) {
      case 'table':
        insertText = '\n| Colonne 1 | Colonne 2 |\n|-----------|-----------|\n| Valeur 1  | Valeur 2  |';
        break;
      case 'callout':
        insertText = '\n🔹 Note: Saisissez votre texte ici...';
        break;
      case 'code':
        insertText = '\n```\nÉcrivez votre code ici\n```';
        break;
      case 'h1':
        insertText = '\n# Titre H1';
        break;
      case 'h2':
        insertText = '\n## Titre H2';
        break;
      case 'h3':
        insertText = '\n### Titre H3';
        break;
      case 'hr':
        insertText = '\n---';
        break;
      default:
        insertText = '';
    }
    
    const newContent = beforeCommand + insertText + afterCommand;
    onContentChange(newContent);
    
    // Calcul de la nouvelle position du curseur après insertion
    const newCursorPosition = lastSlashPos + insertText.length;
    
    // Mettre à jour la position du curseur après le rendu
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleCommandSelect = (command) => {
    insertCommandContent(command);
    setShowCommands(false);
  };

  const handleKeyDown = (e) => {
    if (!showCommands) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedCommandIndex((prevIndex) => 
          prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedCommandIndex((prevIndex) => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands.length > 0) {
          handleCommandSelect(filteredCommands[selectedCommandIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowCommands(false);
        break;
      case 'Tab':
        e.preventDefault();
        if (filteredCommands.length > 0) {
          handleCommandSelect(filteredCommands[selectedCommandIndex]);
        }
        break;
      default:
        break;
    }
  };

  // Faire défiler la liste des commandes pour que l'élément sélectionné soit visible
  useEffect(() => {
    if (showCommands && commandsRef.current) {
      const selectedElement = commandsRef.current.querySelector('.selected-command');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedCommandIndex, showCommands]);

  // Gestionnaire pour les clics en dehors de la popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showCommands && 
          commandsRef.current && 
          !commandsRef.current.contains(e.target) && 
          e.target !== textareaRef.current) {
        setShowCommands(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCommands]);

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
          onKeyDown={handleKeyDown}
          placeholder='Commencez à taper ici ou entrez "/" pour afficher les commandes...'
          className="page-content flex-1 p-4 border-t border-gray-100 outline-none resize-none w-full h-full"
        />
        {showCommands && filteredCommands.length > 0 && (
          <ul
            ref={commandsRef}
            className="commands-popup absolute bg-white shadow-md rounded-md w-48 z-20"
            style={{ 
              top: `${commandsPosition.top}px`, 
              left: `${commandsPosition.left}px`,
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            {filteredCommands.map((cmd, index) => (
              <li
                key={cmd.type}
                className={`p-2 cursor-pointer ${index === selectedCommandIndex ? 'bg-blue-100 selected-command' : 'hover:bg-gray-100'}`}
                onClick={() => handleCommandSelect(cmd)}
                onMouseEnter={() => setSelectedCommandIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <span>{cmd.label}</span>
                  {index === selectedCommandIndex && (
                    <span className="text-xs text-gray-500">⏎</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;