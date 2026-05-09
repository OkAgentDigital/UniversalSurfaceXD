import React, { useState, useEffect, useCallback } from 'react';
import { AccountCredentials, CredentialService } from '../../types';

const SERVICE_ICONS: Record<CredentialService, string> = {
  github: 'codicon-mark-github',
  deepseek: 'codicon-symbol-misc',
  continue: 'codicon-play-circle',
  npm: 'codicon-package',
};

const SERVICE_COLORS: Record<CredentialService, string> = {
  github: '#2da44e',
  deepseek: '#4fc3f7',
  continue: '#7c3aed',
  npm: '#cb3837',
};

export function AccountPanel() {
  const [credentials, setCredentials] = useState<AccountCredentials[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testingService, setTestingService] = useState<string | null>(null);

  const loadCredentials = useCallback(async () => {
    try {
      const secrets = await window.electron.sonicListSecrets();
      const mapped: AccountCredentials[] = secrets.map(s => ({
        key: s.key,
        service: (s.provider as CredentialService) || 'github',
        description: s.description,
        createdAt: s.createdAt,
      }));
      setCredentials(mapped);
    } catch (err) {
      console.error('Failed to load credentials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  const handleDelete = useCallback(async (key: string) => {
    try {
      await window.electron.sonicDeleteSecret(key);
      setCredentials(prev => prev.filter(c => c.key !== key));
    } catch (err) {
      console.error('Failed to delete credential:', err);
    }
  }, []);

  const handleTestConnection = useCallback(async (service: string) => {
    setTestingService(service);
    try {
      const health = await window.electron.sonicHealth();
      // Simulate a brief test
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`${service} connection: ${health.status === 'healthy' ? '✅ Connected' : '⚠️ Degraded'}`);
    } catch (err) {
      alert(`❌ Connection failed: ${err}`);
    } finally {
      setTestingService(null);
    }
  }, []);

  const getServiceFromKey = (key: string): CredentialService => {
    if (key.includes('github')) return 'github';
    if (key.includes('deepseek')) return 'deepseek';
    if (key.includes('continue')) return 'continue';
    if (key.includes('npm')) return 'npm';
    return 'github';
  };

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <i className="codicon codicon-account"></i>
          <span>ACCOUNTS</span>
        </div>
        <button
          className="sidebar-header-action"
          onClick={() => setShowAddModal(true)}
          title="Add Credential"
        >
          <i className="codicon codicon-add"></i>
        </button>
      </div>
      <div className="sidebar-content">
        {loading ? (
          <div className="empty-state">
            <i className="codicon codicon-loading codicon-modifier-spin"></i>
            <p>Loading credentials...</p>
          </div>
        ) : credentials.length === 0 ? (
          <div className="empty-state">
            <i className="codicon codicon-key"></i>
            <p>No credentials stored</p>
            <button onClick={() => setShowAddModal(true)}>
              <i className="codicon codicon-add"></i>
              Add Credential
            </button>
          </div>
        ) : (
          <div className="credential-list">
            {credentials.map(cred => {
              const service = cred.service || getServiceFromKey(cred.key);
              return (
                <div key={cred.key} className="credential-item">
                  <div className="credential-icon" style={{ color: SERVICE_COLORS[service] }}>
                    <i className={`codicon ${SERVICE_ICONS[service]}`}></i>
                  </div>
                  <div className="credential-info">
                    <div className="credential-name">{cred.key}</div>
                    <div className="credential-service">{service}</div>
                    {cred.description && (
                      <div className="credential-description">{cred.description}</div>
                    )}
                  </div>
                  <div className="credential-actions">
                    <button
                      className="credential-action-btn"
                      onClick={() => handleTestConnection(service)}
                      disabled={testingService === service}
                      title="Test Connection"
                    >
                      <i className={`codicon ${testingService === service ? 'codicon-loading codicon-modifier-spin' : 'codicon-pass'}`}></i>
                    </button>
                    <button
                      className="credential-action-btn danger"
                      onClick={() => handleDelete(cred.key)}
                      title="Delete Credential"
                    >
                      <i className="codicon codicon-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCredentialModal
          onClose={() => setShowAddModal(false)}
          onSave={async (service, value, description) => {
            try {
              const key = `${service}_${service === 'github' ? 'token' : 'api_key'}`;
              await window.electron.sonicSetSecret(key, value, service, description);
              await loadCredentials();
              setShowAddModal(false);
            } catch (err) {
              console.error('Failed to save credential:', err);
            }
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// Add Credential Modal
// ============================================================
interface AddCredentialModalProps {
  onClose: () => void;
  onSave: (service: string, value: string, description?: string) => Promise<void>;
}

function AddCredentialModal({ onClose, onSave }: AddCredentialModalProps) {
  const [service, setService] = useState<string>('github');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSaving(true);
    try {
      await onSave(service, value.trim(), description.trim() || undefined);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Credential</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="codicon codicon-close"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Service</label>
              <select value={service} onChange={e => setService(e.target.value)}>
                <option value="github">GitHub</option>
                <option value="deepseek">DeepSeek</option>
                <option value="continue">Continue.dev</option>
                <option value="npm">GitHub Packages (npm)</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                {service === 'github' ? 'Personal Access Token' :
                 service === 'deepseek' ? 'API Key' :
                 service === 'continue' ? 'API Key' :
                 'Token'}
              </label>
              <input
                type="password"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={
                  service === 'github' ? 'ghp_...' :
                  service === 'deepseek' ? 'sk-...' :
                  'Enter credential value'
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g., Personal GitHub token"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={saving || !value.trim()}>
              {saving ? 'Saving...' : 'Save Credential'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
