import React, { useState, useEffect, useCallback } from 'react';
import { StoryConfig, StoryStep, StorySession } from './types';
import { resolveVariables } from './variables';
import { StoryStorage } from './storage';

interface USXStoryFormProps {
  storyConfig: StoryConfig;
  sessionId?: string;
  onComplete?: (answers: Record<string, any>) => void;
  onClose?: () => void;
}

export const USXStoryForm: React.FC<USXStoryFormProps> = ({
  storyConfig,
  sessionId,
  onComplete,
  onClose,
}) => {
  const [session, setSession] = useState<StorySession | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [validationError, setValidationError] = useState<string | null>(null);

  const storage = new StoryStorage();

  // Load or create session
  useEffect(() => {
    const init = async () => {
      let activeSession: StorySession | null = null;

      if (sessionId) {
        activeSession = await storage.load(storyConfig.meta.id, sessionId);
      }

      if (!activeSession) {
        activeSession = storage.createSession(storyConfig);
      }

      setSession(activeSession);
      setAnswers(activeSession.answers);

      // Find current step index
      const stepIdx = storyConfig.steps.findIndex(
        (s) => s.id === activeSession!.current_step
      );
      setCurrentStepIndex(stepIdx >= 0 ? stepIdx : 0);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyConfig.meta.id, sessionId]);

  // Auto-save answers
  const autoSave = useCallback(
    async (newAnswers: Record<string, any>, stepId: string) => {
      if (!session || !storyConfig.storage?.auto_save) return;

      const updated: StorySession = {
        ...session,
        answers: newAnswers,
        current_step: stepId,
        last_updated: new Date().toISOString(),
      };
      await storage.save(updated);
    },
    [session, storyConfig.storage?.auto_save, storage]
  );

  const updateAnswer = useCallback(
    (variable: string, value: any) => {
      const newAnswers = { ...answers, [variable]: value };
      setAnswers(newAnswers);
      setValidationError(null);
      autoSave(newAnswers, storyConfig.steps[currentStepIndex]?.id || '');
    },
    [answers, autoSave, currentStepIndex, storyConfig.steps]
  );

  const validateStep = (step: StoryStep): boolean => {
    if (!step.validation || !step.variable) return true;

    const value = answers[step.variable];
    const v = step.validation;

    if (v.required && (value === undefined || value === null || value === '')) {
      setValidationError(v.error_message || 'This field is required');
      return false;
    }

    if (v.min_length && typeof value === 'string' && value.length < v.min_length) {
      setValidationError(v.error_message || `Minimum ${v.min_length} characters`);
      return false;
    }

    if (v.max_length && typeof value === 'string' && value.length > v.max_length) {
      setValidationError(v.error_message || `Maximum ${v.max_length} characters`);
      return false;
    }

    if (v.pattern && typeof value === 'string' && value) {
      const regex = new RegExp(v.pattern);
      if (!regex.test(value)) {
        setValidationError(v.error_message || 'Invalid format');
        return false;
      }
    }

    if (step.type === 'multiselect' && Array.isArray(value)) {
      if (step.min && value.length < step.min) {
        setValidationError(`Select at least ${step.min} option(s)`);
        return false;
      }
      if (step.max && value.length > step.max) {
        setValidationError(`Select at most ${step.max} option(s)`);
        return false;
      }
    }

    return true;
  };

  const handleNext = useCallback(async () => {
    const step = storyConfig.steps[currentStepIndex];
    if (!step) return;

    if (!validateStep(step)) return;

    // Handle branching step
    if (step.type === 'branch' && step.conditions) {
      for (const condition of step.conditions) {
        if (condition.when) {
          const resolved = resolveVariables(condition.when, answers, storyConfig.variables);
          if (resolved === 'true' || resolved === '1') {
            const targetIdx = storyConfig.steps.findIndex((s) => s.id === condition.then);
            if (targetIdx >= 0) {
              setDirection('forward');
              setCurrentStepIndex(targetIdx);
              return;
            }
          }
        }
        if (condition.otherwise) {
          const targetIdx = storyConfig.steps.findIndex((s) => s.id === condition.otherwise);
          if (targetIdx >= 0) {
            setDirection('forward');
            setCurrentStepIndex(targetIdx);
            return;
          }
        }
      }
      return;
    }

    if (currentStepIndex < storyConfig.steps.length - 1) {
      setDirection('forward');
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Complete story
      if (session) {
        const completed: StorySession = {
          ...session,
          status: 'completed',
          completed_at: new Date().toISOString(),
          answers,
          last_updated: new Date().toISOString(),
        };
        await storage.save(completed);
      }
      onComplete?.(answers);
      onClose?.();
    }
  }, [currentStepIndex, storyConfig, answers, session, storage, onComplete, onClose]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setDirection('back');
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const step = storyConfig.steps[currentStepIndex];
  const totalSteps = storyConfig.steps.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const renderStep = () => {
    if (!step) return null;

    const title = resolveVariables(step.title, answers, storyConfig.variables);
    const description = step.description
      ? resolveVariables(step.description, answers, storyConfig.variables)
      : '';
    const content = step.content
      ? resolveVariables(step.content, answers, storyConfig.variables)
      : '';

    switch (step.type) {
      case 'intro':
      case 'message':
        return (
          <div className="story-step story-step--message">
            <h2 className="story-title">{title}</h2>
            {description && (
              <div
                className="story-description"
                dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }}
              />
            )}
            {content && (
              <div
                className="story-content-markdown"
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
              />
            )}
          </div>
        );

      case 'input':
      case 'email':
        return (
          <div className="story-step story-step--input">
            <h3 className="story-question">{title}</h3>
            {description && <p className="story-description">{description}</p>}
            <input
              type={step.type === 'email' ? 'email' : 'text'}
              className="story-input"
              placeholder={step.placeholder || ''}
              value={answers[step.variable || ''] || ''}
              onChange={(e) => updateAnswer(step.variable || '', e.target.value)}
              autoFocus={step.auto_focus}
            />
            {validationError && (
              <p className="story-validation-error">{validationError}</p>
            )}
          </div>
        );

      case 'choice':
        return (
          <div className="story-step story-step--choice">
            <h3 className="story-question">{title}</h3>
            {description && <p className="story-description">{description}</p>}
            <div className="story-options">
              {step.options?.map((opt) => (
                <button
                  key={opt.value}
                  className={`story-option ${answers[step.variable || ''] === opt.value ? 'story-option--selected' : ''}`}
                  onClick={() => updateAnswer(step.variable || '', opt.value)}
                >
                  <span className="story-option-label">{opt.label}</span>
                  {opt.description && (
                    <span className="story-option-description">{opt.description}</span>
                  )}
                </button>
              ))}
            </div>
            {validationError && (
              <p className="story-validation-error">{validationError}</p>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div className="story-step story-step--multiselect">
            <h3 className="story-question">{title}</h3>
            {description && <p className="story-description">{description}</p>}
            <div className="story-options">
              {step.options?.map((opt) => {
                const selected = (answers[step.variable || ''] || []).includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    className={`story-option ${selected ? 'story-option--selected' : ''}`}
                    onClick={() => {
                      const current: string[] = answers[step.variable || ''] || [];
                      const updated = selected
                        ? current.filter((v) => v !== opt.value)
                        : [...current, opt.value];
                      updateAnswer(step.variable || '', updated);
                    }}
                  >
                    <span className="story-option-checkbox">
                      {selected ? '✓' : '○'}
                    </span>
                    <span className="story-option-label">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            {validationError && (
              <p className="story-validation-error">{validationError}</p>
            )}
          </div>
        );

      case 'scale':
        return (
          <div className="story-step story-step--scale">
            <h3 className="story-question">{title}</h3>
            {description && <p className="story-description">{description}</p>}
            <div className="story-scale">
              {Array.from(
                { length: (step.max || 5) - (step.min || 1) + 1 },
                (_, i) => {
                  const value = (step.min || 1) + i;
                  return (
                    <button
                      key={value}
                      className={`story-scale-btn ${answers[step.variable || ''] === value ? 'story-scale-btn--selected' : ''}`}
                      onClick={() => updateAnswer(step.variable || '', value)}
                    >
                      {value}
                    </button>
                  );
                }
              )}
            </div>
            {step.labels && (
              <div className="story-scale-labels">
                <span>{step.labels[String(step.min || 1)]}</span>
                <span>{step.labels[String(step.max || 5)]}</span>
              </div>
            )}
          </div>
        );

      case 'confirm':
        return (
          <div className="story-step story-step--confirm">
            <h2 className="story-title">{title}</h2>
            {description && (
              <div
                className="story-description"
                dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }}
              />
            )}
          </div>
        );

      case 'branch':
        return (
          <div className="story-step story-step--branch">
            <h3 className="story-question">{title}</h3>
            {description && <p className="story-description">{description}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (!step) return null;

  const isLastStep = currentStepIndex === storyConfig.steps.length - 1;
  const isBranchStep = step.type === 'branch';

  return (
    <div className={`story-form story-form--${direction}`}>
      <div className="story-progress">
        <div className="story-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="story-content">{renderStep()}</div>

      <div className="story-navigation">
        {currentStepIndex > 0 && (
          <button onClick={handleBack} className="story-nav-btn story-nav-btn--back">
            ← {step.cancel_label || 'Back'}
          </button>
        )}
        {!isBranchStep && (
          <button
            onClick={handleNext}
            className="story-nav-btn story-nav-btn--next"
          >
            {isLastStep ? step.confirm_label || 'Complete' : step.confirm_label || 'Continue'} →
          </button>
        )}
        {isBranchStep && (
          <button onClick={handleNext} className="story-nav-btn story-nav-btn--next">
            Continue →
          </button>
        )}
      </div>
    </div>
  );
};
