'use client';

import { useEffect } from 'react';
import { initToolbar } from '@21st-extension/toolbar';

export default function DevToolbar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      
      try {
        const config = {
          plugins: [],
          debug: true, // Aktiviert Debug-Ausgaben
        };
        
        initToolbar(config);
        
        // Prüfe ob die Extension erreichbar ist
        setTimeout(() => {
          const toolbar = document.querySelector('[data-twentyfirst-toolbar]');
          if (toolbar) {
          } else {
          }
        }, 1000);
        
      } catch (error) {
        console.error('❌ Error initializing toolbar:', error);
      }
    }
  }, []);

  return null;
}