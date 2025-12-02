import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

/**
 * OnboardingTour Component
 * 
 * Provides interactive guided tours for different pages using driver.js
 * Tours are shown only once per user (tracked in localStorage)
 * 
 * @param {string} tourId - Unique identifier for this tour (e.g., 'endoguard-assessment')
 * @param {Array} steps - Array of tour steps with element, popover config
 * @param {boolean} autoStart - Whether to start tour automatically (default: true)
 * @param {function} onComplete - Callback when tour is completed
 */
export function OnboardingTour({ tourId, steps, autoStart = true, onComplete }) {
  useEffect(() => {
    // Check if user has already seen this tour
    const tourCompleted = localStorage.getItem(`tour-completed-${tourId}`);
    
    if (tourCompleted || !autoStart) {
      return;
    }

    // Small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        steps: steps.map(step => ({
          element: step.element,
          popover: {
            title: step.title,
            description: step.description,
            side: step.side || 'bottom',
            align: step.align || 'start',
            ...step.popover
          }
        })),
        onDestroyStarted: () => {
          // Mark tour as completed when user closes it
          localStorage.setItem(`tour-completed-${tourId}`, 'true');
          if (onComplete) {
            onComplete();
          }
          driverObj.destroy();
        },
        // Custom styling to match Nexus Biomedical theme
        popoverClass: 'nexus-tour-popover',
      });

      driverObj.drive();
    }, 500);

    return () => clearTimeout(timer);
  }, [tourId, steps, autoStart, onComplete]);

  return null; // This component doesn't render anything
}

/**
 * Reset a specific tour so it shows again
 */
export function resetTour(tourId) {
  localStorage.removeItem(`tour-completed-${tourId}`);
}

/**
 * Reset all tours
 */
export function resetAllTours() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('tour-completed-')) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Check if a tour has been completed
 */
export function isTourCompleted(tourId) {
  return localStorage.getItem(`tour-completed-${tourId}`) === 'true';
}

/**
 * Manually trigger a tour (useful for "Show Tour Again" buttons)
 */
export function startTour(tourId, steps, onComplete) {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    steps: steps.map(step => ({
      element: step.element,
      popover: {
        title: step.title,
        description: step.description,
        side: step.side || 'bottom',
        align: step.align || 'start',
        ...step.popover
      }
    })),
    onDestroyStarted: () => {
      localStorage.setItem(`tour-completed-${tourId}`, 'true');
      if (onComplete) {
        onComplete();
      }
      driverObj.destroy();
    },
    popoverClass: 'nexus-tour-popover',
  });

  driverObj.drive();
}

export default OnboardingTour;
