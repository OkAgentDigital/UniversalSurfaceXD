import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  EditorContainer,
  Toolbar,
  TitleInput,
  LanguageSelect,
  ToolbarButton,
  PrimaryButton,
  BackButton,
  SaveIndicator,
  MonacoWrapper,
} from './styles';
import { Document } from '../../types';
import { DEFAULT_LANGUAGES } from '../../../shared/constants';

export function DocumentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('markdown');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load document on mount
  useEffect(() => {
    if (id) {
      window.electron.getDocument(id).then(doc => {
        if (doc) {
          setTitle(doc.title);
          setContent(doc.content);
          setLanguage(doc.language);
        } else {
          // Document doesn't exist yet, create a new one
          setTitle('Untitled Document');
          setContent('');
        }
        setIsLoaded(true);
      }).catch(err => {
        console.error('Error loading document:', err);
        setIsLoaded(true);
      });
    } else {
      // New document
      setTitle('Untitled Document');
      setContent('');
      setIsLoaded(true);
    }
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!id) return;

    setIsSaving(true);
    try {
      const doc: Document = {
        id,
        title: title || 'Untitled Document',
        content,
        language,
        created_at: Date.now(),
        updated_at: Date.now(),
        metadata: '{}',
      };
      await window.electron.saveDocument(doc);
      setLastSaved(new Date());
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving document:', err);
    } finally {
      setIsSaving(false);
    }
  }, [id, title, content, language]);

  // Auto-save with debounce
  useEffect(() => {
    if (!id || !isLoaded) return;
    if (!hasChanges) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [content, title, language, id, isLoaded, hasChanges, handleSave]);

  const handleContentChange = (value: string | undefined) => {
    setContent(value || '');
    setHasChanges(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    setHasChanges(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S to save manually
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    // Escape to go back
    if (e.key === 'Escape') {
      navigate('/');
    }
  };

  const getSaveStatusText = () => {
    if (isSaving) return 'Saving...';
    if (hasChanges) return 'Unsaved changes';
    if (lastSaved) {
      return `Saved ${lastSaved.toLocaleTimeString()}`;
    }
    return '';
  };

  if (!isLoaded) {
    return (
      <EditorContainer>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
          Loading...
        </div>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer onKeyDown={handleKeyDown} tabIndex={0}>
      <Toolbar>
        <BackButton onClick={() => navigate('/')}>←</BackButton>
        <TitleInput
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Document title"
        />
        <LanguageSelect value={language} onChange={handleLanguageChange}>
          {DEFAULT_LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </LanguageSelect>
        <PrimaryButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </PrimaryButton>
        <SaveIndicator $saving={isSaving}>
          {getSaveStatusText()}
        </SaveIndicator>
      </Toolbar>
      <MonacoWrapper>
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={handleContentChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: 'Monaco, Menlo, "Courier New", monospace',
            automaticLayout: true,
            minimap: { enabled: true },
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2,
          }}
        />
      </MonacoWrapper>
    </EditorContainer>
  );
}
