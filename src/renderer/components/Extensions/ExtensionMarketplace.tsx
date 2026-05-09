import React, { useState, useEffect, useCallback } from 'react';
import { ExtensionManifest, ExtensionPublisher } from '../../types';

const PUBLISHER_COLORS: Record<ExtensionPublisher, string> = {
  devstudio: '#007acc',
  udosgo: '#4ec9b0',
  okagentdigital: '#ce9178',
};

const CATEGORY_ICONS: Record<string, string> = {
  'AI/ML': 'codicon-symbol-misc',
  'Git/GitHub': 'codicon-mark-github',
  'Workflows': 'codicon-play-circle',
  'Skills': 'codicon-mortar-board',
  'Gaming': 'codicon-game',
  'Enterprise': 'codicon-shield',
  'Security': 'codicon-lock',
  'Collaboration': 'codicon-organization',
};

export function ExtensionMarketplace() {
  const [extensions, setExtensions] = useState<ExtensionManifest[]>([]);
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState<string | null>(null);

  const loadExtensions = useCallback(async () => {
    try {
      const [allExts, installedExts] = await Promise.all([
        window.electron.extensionMarketplaceSearch(searchQuery || undefined),
        window.electron.extensionMarketplaceListInstalled(),
      ]);
      setExtensions(allExts);
      setInstalled(new Set(installedExts.map(e => e.name)));
    } catch (err) {
      console.error('Failed to load extensions:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadExtensions();
  }, [loadExtensions]);

  const handleInstall = useCallback(async (pkgName: string) => {
    setInstalling(pkgName);
    try {
      const result = await window.electron.extensionMarketplaceInstall(pkgName);
      if (result.success) {
        setInstalled(prev => new Set(prev).add(pkgName));
      } else {
        alert(`Failed to install: ${result.error}`);
      }
    } catch (err) {
      console.error('Install failed:', err);
    } finally {
      setInstalling(null);
    }
  }, []);

  const handleUninstall = useCallback(async (pkgName: string) => {
    if (!confirm(`Uninstall ${pkgName}?`)) return;
    try {
      const result = await window.electron.extensionMarketplaceUninstall(pkgName);
      if (result.success) {
        setInstalled(prev => {
          const next = new Set(prev);
          next.delete(pkgName);
          return next;
        });
      } else {
        alert(`Failed to uninstall: ${result.error}`);
      }
    } catch (err) {
      console.error('Uninstall failed:', err);
    }
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(extensions.flatMap(e => e.categories))];

  const filtered = extensions.filter(ext => {
    if (selectedCategory !== 'All' && !ext.categories.includes(selectedCategory)) return false;
    return true;
  });

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-extensions"></i>
          <span>EXTENSIONS</span>
        </div>
      </div>
      <div className="sidebar-content">
        {/* Search */}
        <div className="marketplace-search">
          <i className="codicon codicon-search"></i>
          <input
            type="text"
            placeholder="Search extensions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="marketplace-search-input"
          />
        </div>

        {/* Categories */}
        <div className="marketplace-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Extension List */}
        {loading ? (
          <div className="empty-state">
            <i className="codicon codicon-loading codicon-modifier-spin"></i>
            <p>Loading marketplace...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <i className="codicon codicon-extensions"></i>
            <p>No extensions found</p>
          </div>
        ) : (
          <div className="extension-list">
            {filtered.map(ext => (
              <div key={ext.name} className="extension-card">
                <div className="extension-header">
                  <div className="extension-icon" style={{ backgroundColor: PUBLISHER_COLORS[ext.publisher] }}>
                    <i className={`codicon ${CATEGORY_ICONS[ext.categories[0]] || 'codicon-extensions'}`}></i>
                  </div>
                  <div className="extension-meta">
                    <div className="extension-name">{ext.name.split('/')[1]}</div>
                    <div className="extension-publisher" style={{ color: PUBLISHER_COLORS[ext.publisher] }}>
                      {ext.publisher}
                    </div>
                  </div>
                  <div className="extension-version">v{ext.version}</div>
                </div>
                <div className="extension-description">{ext.description}</div>
                <div className="extension-footer">
                  <div className="extension-stats">
                    <span className="extension-stat" title="Downloads">
                      <i className="codicon codicon-cloud-download"></i>
                      {ext.downloads}
                    </span>
                    {ext.rating && (
                      <span className="extension-stat" title="Rating">
                        <i className="codicon codicon-star-full"></i>
                        {ext.rating}
                      </span>
                    )}
                  </div>
                  <div className="extension-categories">
                    {ext.categories.slice(0, 2).map(cat => (
                      <span key={cat} className="extension-category-tag">{cat}</span>
                    ))}
                  </div>
                  <div className="extension-actions">
                    {installed.has(ext.name) ? (
                      <button
                        className="button-secondary button-small"
                        onClick={() => handleUninstall(ext.name)}
                      >
                        Uninstall
                      </button>
                    ) : (
                      <button
                        className="button-primary button-small"
                        onClick={() => handleInstall(ext.name)}
                        disabled={installing === ext.name}
                      >
                        {installing === ext.name ? '...' : 'Install'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
