import React from 'react';
import { Link } from 'react-router-dom';

export default function EarlyAdopterBanner() {
  return (
    <div className="early-adopter-banner">
      <div className="banner-content">
        <div className="banner-icon">🎉</div>
        <div className="banner-text">
          <div className="banner-title">Early Adopter Special</div>
          <div className="banner-subtitle">
            Save 20% on EndoGuard Premium - <span className="highlight-price">$39/month</span> (reg. $49) for life!
          </div>
        </div>
        <Link to="/platforms" className="banner-cta">
          Claim Your Discount →
        </Link>
      </div>

      <style jsx>{`
        .early-adopter-banner {
          background: linear-gradient(135deg, #00CED1 0%, #00B4D8 100%);
          padding: 1.5rem 2rem;
          margin: 2rem 0;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 206, 209, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .banner-icon {
          font-size: 2.5rem;
          animation: bounce 1s ease-in-out infinite;
        }

        .banner-text {
          flex: 1;
          min-width: 250px;
        }

        .banner-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.25rem;
        }

        .banner-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.95);
        }

        .highlight-price {
          font-weight: bold;
          font-size: 1.25rem;
          color: #FFD700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .banner-cta {
          background: white;
          color: #00CED1;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .banner-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          background: #f0f0f0;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 206, 209, 0.3);
          }
          50% {
            box-shadow: 0 4px 30px rgba(0, 206, 209, 0.5);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @media (max-width: 768px) {
          .early-adopter-banner {
            padding: 1rem;
          }

          .banner-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .banner-icon {
            font-size: 2rem;
          }

          .banner-title {
            font-size: 1.25rem;
          }

          .banner-subtitle {
            font-size: 0.9rem;
          }

          .banner-cta {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
