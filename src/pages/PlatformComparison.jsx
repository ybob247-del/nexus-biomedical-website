import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/platform-comparison.css';

const PlatformComparison = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const platforms = [
    {
      name: 'RxGuard™',
      category: 'medication',
      tagline: 'Medication Interaction Predictor',
      price: '$39/month',
      trialDays: 14,
      bestFor: 'Healthcare providers, pharmacists, patients with multiple medications',
      keyFeatures: [
        'Real-time drug interaction analysis',
        'AI-powered risk scoring',
        'Alternative medication suggestions',
        'Clinical mitigation strategies',
        '10,000+ medication database'
      ],
      url: '/rxguard'
    },
    {
      name: 'EndoGuard™',
      category: 'procedures',
      tagline: 'Hormone Health Intelligence',
      price: '$49-$199/month',
      trialDays: 30,
      bestFor: 'Individuals concerned about hormone health, healthcare providers, wellness practitioners',
      keyFeatures: [
        'Comprehensive EDC exposure assessment',
        'Personalized hormone health roadmap',
        'AI predictive modeling',
        'Evidence-based recommendations',
        'Lab test guidance and interpretation'
      ],
      url: '/endoguard'
    },
    {
      name: 'ElderWatch™',
      category: 'monitoring',
      tagline: 'Senior Health Monitoring',
      price: '$49-$199/month',
      trialDays: 14,
      bestFor: 'Caregivers, families, senior living facilities',
      keyFeatures: [
        'Fall risk prediction',
        'Medication reminder system',
        'Vital signs monitoring',
        'Emergency alert system',
        'Family portal for updates'
      ],
      url: '/elderwatch'
    },
    {
      name: 'PediCalc Pro™',
      category: 'medication',
      tagline: 'Pediatric Dosing Calculator',
      price: '$14.99-$19.99/month',
      trialDays: 7,
      bestFor: 'Pediatricians, parents, pediatric nurses',
      keyFeatures: [
        'Weight-based dosing calculator',
        'Age-appropriate medication safety',
        'Growth chart tracking',
        'Vaccination schedule',
        'Parent education library'
      ],
      url: '/pedicalc'
    },
    {
      name: 'ClinicalIQ™',
      category: 'research',
      tagline: 'Clinical Trial Optimization',
      price: '$299-$699/month',
      trialDays: 14,
      bestFor: 'Pharmaceutical companies, CROs, research institutions',
      keyFeatures: [
        'Protocol success prediction',
        'Patient recruitment forecasting',
        'Site selection intelligence',
        'Competitive trial tracking',
        'Endpoint optimization'
      ],
      url: '/clinicaliq'
    },
    {
      name: 'ReguReady™',
      category: 'regulatory',
      tagline: 'FDA Regulatory Guidance',
      price: '$199-$399/month',
      trialDays: 7,
      bestFor: 'Medical device companies, startups, regulatory consultants',
      keyFeatures: [
        'Regulatory pathway recommendation',
        'Predicate device intelligence',
        'Gap analysis & compliance checking',
        'Document generation',
        'International regulatory guidance'
      ],
      url: '/reguready'
    },
    {
      name: 'SkinScan Pro™',
      category: 'diagnostics',
      tagline: 'Skin Cancer Detection',
      price: '$49-$59/month',
      trialDays: 14,
      bestFor: 'Dermatologists, primary care physicians, patients',
      keyFeatures: [
        'AI skin condition detection',
        'ABCDE criteria analysis',
        'Melanoma risk scoring',
        'Lesion tracking over time',
        'Dermatologist referral system'
      ],
      url: '/skinscan'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Platforms' },
    { id: 'medication', label: 'Medication Safety' },
    { id: 'procedures', label: 'Procedures & Quality' },
    { id: 'monitoring', label: 'Health Monitoring' },
    { id: 'research', label: 'Research & Trials' },
    { id: 'regulatory', label: 'Regulatory Compliance' },
    { id: 'diagnostics', label: 'Diagnostics & Screening' }
  ];

  const filteredPlatforms = selectedCategory === 'all' 
    ? platforms 
    : platforms.filter(p => p.category === selectedCategory);

  const handleSelectPlatform = (url) => {
    navigate(url);
  };

  return (
    <>
      <Header />
      <div className="comparison-page">
        <div className="comparison-hero">
          <h1>Compare Our Platforms</h1>
          <p>Find the perfect AI-powered healthcare solution for your needs</p>
        </div>

        <div className="comparison-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="comparison-grid">
          {filteredPlatforms.map((platform, index) => (
            <div key={index} className="comparison-card">
              <div className="card-header">
                <h2>{platform.name}</h2>
                <p className="tagline">{platform.tagline}</p>
              </div>

              <div className="card-pricing">
                <div className="price">{platform.price}</div>
                <div className="trial">{platform.trialDays}-day free trial</div>
              </div>

              <div className="card-best-for">
                <h3>Best For:</h3>
                <p>{platform.bestFor}</p>
              </div>

              <div className="card-features">
                <h3>Key Features:</h3>
                <ul>
                  {platform.keyFeatures.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <button 
                className="select-btn"
                onClick={() => handleSelectPlatform(platform.url)}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>

        <div className="comparison-help">
          <h2>Need Help Choosing?</h2>
          <p>Not sure which platform is right for you? Our team can help you find the perfect solution.</p>
          <button className="contact-btn" onClick={() => navigate('/contact')}>
            Contact Sales
          </button>
        </div>

        <div className="comparison-faq">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-item">
            <h3>Can I use multiple platforms?</h3>
            <p>Yes! Many customers use multiple platforms. Contact us for bundle pricing and multi-platform discounts.</p>
          </div>

          <div className="faq-item">
            <h3>What's included in the free trial?</h3>
            <p>All free trials include full access to Professional tier features with no credit card required. Trial lengths vary by platform (7-30 days).</p>
          </div>

          <div className="faq-item">
            <h3>Can I switch platforms after signing up?</h3>
            <p>Yes, you can switch or add platforms at any time. Contact support for assistance with platform changes.</p>
          </div>

          <div className="faq-item">
            <h3>Do you offer enterprise pricing?</h3>
            <p>Yes, we offer custom enterprise pricing for organizations with multiple users or specific requirements. Contact sales for a quote.</p>
          </div>

          <div className="faq-item">
            <h3>Are the platforms HIPAA compliant?</h3>
            <p>All platforms are HIPAA-ready with enterprise-grade security including AES-256 encryption and comprehensive audit logging. As pseudonymous platforms that do not collect PHI in standard use, they do not require Business Associate Agreements.</p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PlatformComparison;
