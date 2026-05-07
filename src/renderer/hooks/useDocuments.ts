import { useState, useEffect, useCallback } from 'react';
import { Document } from '../types';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const docs = await window.electron.listDocuments();
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const getDocument = useCallback(async (id: string): Promise<Document | undefined> => {
    try {
      return await window.electron.getDocument(id);
    } catch (err) {
      console.error('Error getting document:', err);
      return undefined;
    }
  }, []);

  const saveDocument = useCallback(async (doc: Document): Promise<boolean> => {
    try {
      await window.electron.saveDocument(doc);
      setDocuments(prev => {
        const idx = prev.findIndex(d => d.id === doc.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = doc;
          return updated;
        }
        return [...prev, doc];
      });
      return true;
    } catch (err) {
      console.error('Error saving document:', err);
      return false;
    }
  }, []);

  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    try {
      await window.electron.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      return false;
    }
  }, []);

  return {
    documents,
    loading,
    error,
    getDocument,
    saveDocument,
    deleteDocument,
    refresh: fetchDocuments,
  };
}
