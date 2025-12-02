import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { trackTourEvent } from '../utils/tourAnalytics';

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

    // Track tour start
    trackTourEvent(tourId, 'started', {
      total_steps: steps.length,
      auto_start: autoStart
    });

    // Small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      let currentStepIndex = 0;
      
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
        onNextClick: () => {
          currentStepIndex++;
          trackTourEvent(tourId, 'step_viewed', {
            step_index: currentStepIndex,
            step_title: steps[currentStepIndex]?.title,
            total_steps: steps.length,
            progress_percentage: ((currentStepIndex + 1) / steps.length * 100).toFixed(1)
          });
          driverObj.moveNext();
        },
        onPrevClick: () => {
          currentStepIndex--;
          trackTourEvent(tourId, 'step_back', {
            step_index: currentStepIndex,
            step_title: steps[currentStepIndex]?.title
          });
          driverObj.movePrevious();
        },
        onCloseClick: () => {
          const wasCompleted = currentStepIndex >= steps.length - 1;
          
          trackTourEvent(tourId, wasCompleted ? 'completed' : 'skipped', {
            last_step_index: currentStepIndex,
            total_steps: steps.length,
            completion_percentage: ((currentStepIndex + 1) / steps.length * 100).toFixed(1)
          });
          
          localStorage.setItem(`tour-completed-${tourId}`, 'true');
          if (onComplete) {
            onComplete();
          }
          driverObj.destroy();
        },
        onDestroyStarted: () => {
          // Prevent default destroy behavior - we handle it in onCloseClick
          if (!driverObj.isDestroyed) {
            const wasCompleted = currentStepIndex >= steps.length - 1;
            
            trackTourEvent(tourId, wasCompleted ? 'completed' : 'skipped', {
              last_step_index: currentStepIndex,
              total_steps: steps.length,
              completion_percentage: ((currentStepIndex + 1) / steps.length * 100).toFixed(1)
            });
            
            localStorage.setItem(`tour-completed-${tourId}`, 'true');
            if (onComplete) {
              onComplete();
            }
          }
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
  // Track manual tour start
  trackTourEvent(tourId, 'manual_start', {
    total_steps: steps.length
  });
  
  let currentStepIndex = 0;
  
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
    onNextClick: () => {
      currentStepIndex++;
      trackTourEvent(tourId, 'step_viewed', {
        step_index: currentStepIndex,
        step_title: steps[currentStepIndex]?.title,
        total_steps: steps.length,
        progress_percentage: ((currentStepIndex + 1) / steps.length * 100).toFixed(1)
      });
      driverObj.moveNext();
    },
    onPrevClick: () => {
      currentStepIndex--;
      trackTourEvent(tourId, 'step_back', {
        step_index: currentStepIndex,
        step_title: steps[currentStepIndex]?.title
      });
      driverObj.movePrevious();
    },
    onCloseClick: () => {
      const wasCompleted = currentStepIndex >= steps.length - 1;
      
      trackTourEvent(tourId, wasCompleted ? 'completed' : 'skipped', {
        last_step_index: currentStepIndex,
        total_steps: steps.length,
        completion_percentage: ((currentStepIndex + 1) / steps.length * 100).toFixed(1)
      });
      
      localStorage.setItem(`tour-completed-${tourId}`, 'true');
      if (onComplete) {
        onComplete();
      }
      driverObj.destroy();
    },
    onDestroyStarted: () => {
      if (!driverObj.isDestroyed) {
        const wasCompleted = currentStepIndex >= steps.length - 1;
        
        trackTourEvent(tourId, wasCompleted ? 'completed' : 'skipped', {
          last_step_index: currentStepIndex,
          total_steps: steps.length,
          completion_percentage: ((currentStepIndex + 1) / steps.length * 100).toFixed(1)
        });
        
        localStorage.setItem(`tour-completed-${tourId}`, 'true');
        if (onComplete) {
          onComplete();
        }
      }
    },
    popoverClass: 'nexus-tour-popover',
  });

  driverObj.drive();
}

export default OnboardingTour;
