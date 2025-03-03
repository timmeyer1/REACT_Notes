// src/utils/url.js
export const generateSlug = (title) => {
    if (!title) return 'page';
    
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplacer les espaces et caractères spéciaux par des tirets
      .replace(/^-+|-+$/g, '') // Supprimer les tirets au début et à la fin
      || 'page'; // Fallback si le slug est vide
  };