import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * A/B Testing Hook
 * Assigns users to test variants and tracks conversion rates
 * 
 * @param {string} testName - Name of the A/B test
 * @param {Array<string>} variants - Array of variant names (e.g., ['control', 'variant_a', 'variant_b'])
 * @returns {Object} - { variant, trackConversion }
 */
export function useABTest(testName, variants = ['control', 'variant_a']) {
  const { user, token } = useAuth();
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      // For non-authenticated users, use localStorage
      const storageKey = `ab_test_${testName}`;
      let assignedVariant = localStorage.getItem(storageKey);

      if (!assignedVariant || !variants.includes(assignedVariant)) {
        // Assign random variant
        assignedVariant = variants[Math.floor(Math.random() * variants.length)];
        localStorage.setItem(storageKey, assignedVariant);
      }

      setVariant(assignedVariant);
      return;
    }

    // For authenticated users, get variant from server
    loadVariant();
  }, [user, token, testName]);

  const loadVariant = async () => {
    try {
      const response = await fetch(`/api/ab-testing/get-variant?test=${testName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setVariant(data.variant);
      } else {
        // Assign new variant if not found
        await assignVariant();
      }
    } catch (error) {
      console.error('Error loading A/B test variant:', error);
      // Fallback to random assignment
      setVariant(variants[Math.floor(Math.random() * variants.length)]);
    }
  };

  const assignVariant = async () => {
    try {
      const response = await fetch('/api/ab-testing/assign-variant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testName,
          variants
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setVariant(data.variant);
      }
    } catch (error) {
      console.error('Error assigning A/B test variant:', error);
    }
  };

  const trackConversion = async (metadata = {}) => {
    if (!variant) return;

    try {
      await fetch('/api/ab-testing/track-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify({
          testName,
          variant,
          metadata
        })
      });
    } catch (error) {
      console.error('Error tracking A/B test conversion:', error);
    }
  };

  return { variant, trackConversion };
}
