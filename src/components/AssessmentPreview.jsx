import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/assessment-preview.css';

const PREVIEW_QUESTIONS = [
  {
    id: 'fatigue',
    question: 'Do you experience persistent fatigue or low energy?',
    options: ['Never', 'Occasionally', 'Frequently', 'Always']
  },
  {
    id: 'weight',
    question: 'Have you noticed unexplained weight changes?',
    options: ['No', 'Slight changes', 'Moderate changes', 'Significant changes']
  },
  {
    id: 'mood',
    question: 'Do you experience mood swings or irritability?',
    options: ['Never', 'Rarely', 'Often', 'Very often']
  }
];

export default function AssessmentPreview() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer) => {
    const newAnswers = {
      ...answers,
      [PREVIEW_QUESTIONS[currentQuestion].id]: answer
    };
    setAnswers(newAnswers);

    if (currentQuestion < PREVIEW_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateRiskScore = () => {
    let score = 0;
    Object.values(answers).forEach(answer => {
      if (answer === 'Always' || answer === 'Very often' || answer === 'Significant changes') {
        score += 3;
      } else if (answer === 'Frequently' || answer === 'Often' || answer === 'Moderate changes') {
        score += 2;
      } else if (answer === 'Occasionally' || answer === 'Rarely' || answer === 'Slight changes') {
        score += 1;
      }
    });
    return Math.round((score / 9) * 100);
  };

  const getRiskLevel = (score) => {
    if (score >= 60) return { level: 'High', color: '#ef4444', message: 'Your responses suggest significant hormone disruption risk.' };
    if (score >= 30) return { level: 'Moderate', color: '#f59e0b', message: 'Your responses indicate moderate risk factors.' };
    return { level: 'Low', color: '#10b981', message: 'Your responses show relatively low risk.' };
  };

  const resetPreview = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    const riskScore = calculateRiskScore();
    const risk = getRiskLevel(riskScore);

    return (
      <div className="assessment-preview">
        <div className="preview-container">
          <div className="preview-result">
            <h3>Your Quick Assessment Result</h3>
            <div className="preview-score" style={{ borderColor: risk.color }}>
              <div className="score-value" style={{ color: risk.color }}>{riskScore}</div>
              <div className="score-label">{risk.level} Risk</div>
            </div>
            <p className="risk-message">{risk.message}</p>
            
            <div className="preview-cta">
              <p className="cta-text">
                This is just a quick preview based on 3 questions. 
                Get your complete hormone health assessment with personalized recommendations!
              </p>
              <button 
                className="cta-button primary"
                onClick={() => navigate('/endoguard/assessment')}
              >
                Take Full Assessment (FREE)
              </button>
              <button 
                className="cta-button secondary"
                onClick={resetPreview}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = PREVIEW_QUESTIONS[currentQuestion];

  return (
    <div className="assessment-preview">
      <div className="preview-container">
        <div className="preview-header">
          <h3>Quick Hormone Health Check</h3>
          <p>Answer 3 quick questions to get an instant insight</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / PREVIEW_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <div className="progress-text">
            Question {currentQuestion + 1} of {PREVIEW_QUESTIONS.length}
          </div>
        </div>

        <div className="preview-question">
          <h4>{question.question}</h4>
          <div className="preview-options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
