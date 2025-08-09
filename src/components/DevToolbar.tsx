'use client';

import { useEffect } from 'react';
import { initToolbar } from '@21st-extension/toolbar';

export default function DevToolbar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('🔧 Initializing 21st.dev Toolbar...');
      
      try {
        const config = {
          plugins: [],
          debug: true, // Aktiviert Debug-Ausgaben
        };
        
        initToolbar(config);
        console.log('✅ 21st.dev Toolbar initialized successfully');
        
        // Prüfe ob die Extension erreichbar ist
        setTimeout(() => {
          const toolbar = document.querySelector('[data-twentyfirst-toolbar]');
          if (toolbar) {
            console.log('✅ Toolbar DOM element found');
          } else {
            console.warn('⚠️ Toolbar DOM element not found - check if VS Code extension is running');
          }
        }, 1000);
        
      } catch (error) {
        console.error('❌ Error initializing toolbar:', error);
      }
    }
  }, []);

  return null;
}