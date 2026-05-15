import React, { useState } from 'react';

export interface StoryStep {
  id: string;
  type: 'intro' | 'question' | 'choice' | 'scale' | 'rating' | 'confirmation';
  title: string;
  description?: string;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  required?: boolean;
}

export interface StoryConfig {
  title: string;
  steps: StoryStep[];
  onComplete?: (answers: Record<string, any>) => void;
}

interface StoryFormProps {
  config: StoryConfig;
  onComplete: () => void;
}

export const StoryForm: React.FC<StoryFormProps> = ({ config, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const step = config.steps[currentStep];
  const totalSteps = config.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection('forward');
      setCurrentStep(prev => prev + 1);
    } else {
      config.onComplete?.(answers);
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection('back');
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
  };

  const renderStep = () => {
    switch (step.type) {
      case 'intro':
        return (
          <div className="story-step story-step--intro">
            <h2 className="story-title">{step.title}</h2>
            {step.description && <p className="story-description">{step.description}</p>}
          </div>
        );

      case 'question':
        return (
          <div className="story-step story-step--question">
            <h3 className="story-question">{step.title}</h3>
            <input
              type="text"
              className="story-input"
              placeholder="Type your answer..."
              value={answers[step.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              autoFocus
            />
          </div>
        );

      case 'choice':
        return (
          <div className="story-step story-step--choice">
            <h3 className="story-question">{step.title}</h3>
            <div className="story-options">
              {step.options?.map((option, idx) => (
                <button
                  key={idx}
                  className={`story-option ${answers[step.id] === option ? 'story-option--selected' : ''}`}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'scale':
        return (
          <div className="story-step story-step--scale">
            <h3 className="story-question">{step.title}</h3>
            <div className="story-scale">
              {Array.from(
                { length: (step.scaleMax || 5) - (step.scaleMin || 1) + 1 },
                (_, i) => {
                  const value = (step.scaleMin || 1) + i;
                  return (
                    <button
                      key={value}
                      className={`story-scale-btn ${answers[step.id] === value ? 'story-scale-btn--selected' : ''}`}
                      onClick={() => handleAnswer(value)}
                    >
                      {value}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="story-step story-step--rating">
            <h3 className="story-question">{step.title}</h3>
            <div className="story-rating">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  className={`story-rating-star ${answers[step.id] >= value ? 'story-rating-star--active' : ''}`}
                  onClick={() => handleAnswer(value)}
                  onMouseEnter={(e) => {
                    const stars = e.currentTarget.parentElement?.children;
                    if (stars) {
                      for (let i = 0; i < value; i++) {
                        stars[i]?.classList.add('story-rating-star--hover');
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    const stars = e.currentTarget.parentElement?.children;
                    if (stars) {
                      for (let i = 0; i < 5; i++) {
                        stars[i]?.classList.remove('story-rating-star--hover');
                      }
                    }
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="story-step story-step--confirmation">
            <h2 className="story-title">✓ {step.title}</h2>
            {step.description && <p className="story-description">{step.description}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (step.required && !answers[step.id]) return true;
    return false;
  };

  return (
    <div className={`story-form story-form--${direction}`}>
      <div className="story-progress">
        <div className="story-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="story-content">
        {renderStep()}
      </div>

      <div className="story-navigation">
        {currentStep > 0 && (
          <button onClick={handleBack} className="story-nav-btn story-nav-btn--back">
            ← Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className={`story-nav-btn story-nav-btn--next ${isNextDisabled() ? 'story-nav-btn--disabled' : ''}`}
        >
          {currentStep === totalSteps - 1 ? 'Submit' : 'Continue'} →
        </button>
      </div>
    </div>
  );
};
