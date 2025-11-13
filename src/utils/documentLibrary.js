const STORAGE_KEY = 'adminDocumentLibrary';
export const DOCUMENT_LIBRARY_EVENT = 'document-library-updated';

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const safeParse = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('documentLibrary: failed to parse stored data', error);
    return [];
  }
};

export const readDocumentLibrary = () => {
  if (!isBrowser) return [];
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

export const writeDocumentLibrary = (items) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(DOCUMENT_LIBRARY_EVENT));
  } catch (error) {
    console.error('documentLibrary: failed to write data', error);
  }
};

export const addDocumentLibraryItem = (item) => {
  const current = readDocumentLibrary();
  const withoutDuplicate = current.filter(
    (entry) => entry.id !== item.id && entry.publicId !== item.publicId
  );
  const next = [item, ...withoutDuplicate];
  writeDocumentLibrary(next);
  return next;
};

export const updateDocumentLibraryItem = (id, patch) => {
  const current = readDocumentLibrary();
  const next = current.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry));
  writeDocumentLibrary(next);
  return next;
};

export const removeDocumentLibraryItem = (idOrPredicate) => {
  const current = readDocumentLibrary();
  const next = current.filter((entry) =>
    typeof idOrPredicate === 'function' ? !idOrPredicate(entry) : entry.id !== idOrPredicate
  );
  writeDocumentLibrary(next);
  return next;
};

export const clearDocumentLibrary = () => {
  writeDocumentLibrary([]);
};
