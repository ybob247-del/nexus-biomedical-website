import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TrialGate from '../components/TrialGate';
import FDADisclaimer from '../components/FDADisclaimer';
import '../styles/rxguard-dashboard.css';

const API_BASE = 'http://localhost:3007/api/rxguard';

export default function RxGuardDashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [medications, setMedications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!user || !token) {
      navigate('/login?redirect=/rxguard/dashboard');
    }
  }, [user, token, navigate]);

  // Load saved medication lists on mount
  useEffect(() => {
    if (user && token) {
      loadSavedMedications();
    }
  }, [user, token]);

  // Load user's saved medications
  const loadSavedMedications = async () => {
    try {
      const response = await fetch(`${API_BASE}/my-medications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && data.medications) {
        setMedications(data.medications);
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  // Save medications to database
  const saveMedications = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/save-medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ medications })
      });
      const data = await response.json();
      if (data.success) {
        alert('Medication list saved successfully!');
      }
    } catch (error) {
      console.error('Error saving medications:', error);
      alert('Failed to save medication list.');
    } finally {
      setIsSaving(false);
    }
  };

  // Search for drugs
  const searchDrugs = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE}/search-drugs?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Add medication to list
  const addMedication = async (drug) => {
    // Check if already added
    if (medications.find(med => med.rxcui === drug.rxcui)) {
      alert('This medication is already in your list');
      return;
    }

    // Get detailed drug info
    try {
      const response = await fetch(`${API_BASE}/drug-info?rxcui=${drug.rxcui}`);
      const data = await response.json();
      
      if (data.success) {
        setMedications([...medications, {
          rxcui: drug.rxcui,
          name: drug.name,
          details: data.data
        }]);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error adding medication:', error);
      alert('Failed to add medication. Please try again.');
    }
  };

  // Remove medication
  const removeMedication = (rxcui) => {
    setMedications(medications.filter(med => med.rxcui !== rxcui));
    setAnalysis(null); // Clear analysis when medications change
  };

  // Check interactions
  const checkInteractions = async () => {
    if (medications.length < 2) {
      alert('Please add at least 2 medications to check for interactions');
      return;
    }

    setIsAnalyzing(true);
    try {
      const rxcuis = medications.map(med => med.rxcui);
      
      const response = await fetch(`${API_BASE}/check-interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rxcuis })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze interactions. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchDrugs(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <TrialGate platform="RxGuard">
      <div className="rxguard-dashboard">
      <div className="dashboard-header">
        <h1>RxGuard™ Drug Interaction Checker</h1>
        <p>Add your medications to check for potential interactions</p>
        <FDADisclaimer />
      </div>

      {/* Drug Search */}
      <div className="drug-search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for medications (e.g., Lipitor, Aspirin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="drug-search-input"
          />
          {isSearching && <div className="search-spinner">Searching...</div>}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((drug) => (
              <div
                key={drug.rxcui}
                className="search-result-item"
                onClick={() => addMedication(drug)}
              >
                <div className="drug-name">{drug.name}</div>
                <div className="drug-rxcui">RxCUI: {drug.rxcui}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medication List */}
      <div className="medication-list-section">
        <h2>Your Medications ({medications.length})</h2>
        
        {medications.length === 0 ? (
          <div className="empty-state">
            <p>No medications added yet. Search and add medications above.</p>
          </div>
        ) : (
          <div className="medication-list">
            {medications.map((med) => (
              <div key={med.rxcui} className="medication-card">
                <div className="med-header">
                  <h3>{med.name}</h3>
                  <button
                    onClick={() => removeMedication(med.rxcui)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
                <div className="med-details">
                  <p><strong>Generic Name:</strong> {med.details?.genericName || 'N/A'}</p>
                  <p><strong>Brand Name:</strong> {med.details?.brandName || 'N/A'}</p>
                  <p><strong>Manufacturer:</strong> {med.details?.manufacturer || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {medications.length >= 1 && (
          <div className="action-buttons">
            <button
              onClick={saveMedications}
              disabled={isSaving}
              className="save-btn"
            >
              {isSaving ? 'Saving...' : '💾 Save Medication List'}
            </button>
            {medications.length >= 2 && (
              <button
                onClick={checkInteractions}
                disabled={isAnalyzing}
                className="check-interactions-btn"
              >
                {isAnalyzing ? 'Analyzing...' : '🔍 Check for Interactions'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="analysis-section">
          <h2>Interaction Analysis Results</h2>
          
          {/* Risk Assessment */}
          <div className={`risk-card risk-${analysis.riskAssessment.riskLevel.toLowerCase()}`}>
            <div className="risk-header">
              <h3>Overall Risk Level: {analysis.riskAssessment.riskLevel}</h3>
              <div className="risk-score">
                Risk Score: {analysis.riskAssessment.overallScore}/100
              </div>
            </div>
          </div>

          {/* Interaction Summary */}
          <div className="interaction-summary">
            <h3>Interactions Found</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-number">{analysis.interactionsSummary.total}</div>
                <div className="summary-label">Total</div>
              </div>
              <div className="summary-item major">
                <div className="summary-number">{analysis.interactionsSummary.major}</div>
                <div className="summary-label">Major</div>
              </div>
              <div className="summary-item moderate">
                <div className="summary-number">{analysis.interactionsSummary.moderate}</div>
                <div className="summary-label">Moderate</div>
              </div>
              <div className="summary-item minor">
                <div className="summary-number">{analysis.interactionsSummary.minor}</div>
                <div className="summary-label">Minor</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="recommendations-section">
            <h3>Recommendations</h3>
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card priority-${rec.priority.toLowerCase()}`}>
                <div className="rec-priority">{rec.priority}</div>
                <div className="rec-message">{rec.message}</div>
                <div className="rec-action">{rec.action}</div>
              </div>
            ))}
          </div>

          {/* Major Interactions Details */}
          {analysis.interactions.major.length > 0 && (
            <div className="interactions-detail">
              <h3>Major Interactions</h3>
              {analysis.interactions.major.map((interaction, index) => (
                <div key={index} className="interaction-card major">
                  <h4>{interaction.drug1.name} + {interaction.drug2.name}</h4>
                  <p className="severity">Severity: {interaction.severity}</p>
                  <p className="description">{interaction.description}</p>
                  <p className="source">Source: {interaction.source}</p>
                </div>
              ))}
            </div>
          )}

          {/* Moderate Interactions Details */}
          {analysis.interactions.moderate.length > 0 && (
            <div className="interactions-detail">
              <h3>Moderate Interactions</h3>
              {analysis.interactions.moderate.map((interaction, index) => (
                <div key={index} className="interaction-card moderate">
                  <h4>{interaction.drug1.name} + {interaction.drug2.name}</h4>
                  <p className="severity">Severity: {interaction.severity}</p>
                  <p className="description">{interaction.description}</p>
                  <p className="source">Source: {interaction.source}</p>
                </div>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="disclaimer">
            <p><strong>Important:</strong> This analysis is for informational purposes only and does not constitute medical advice. Always consult your healthcare provider before making any changes to your medications.</p>
          </div>
        </div>
      )}
      </div>
    </TrialGate>
  );
}
