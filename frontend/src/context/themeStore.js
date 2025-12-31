import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // 'light', 'dark', or 'system'
      theme: 'dark',
      
      // Actual resolved theme (always 'light' or 'dark')
      resolvedTheme: 'dark',
      
      setTheme: (theme) => {
        set({ theme });
        get().applyTheme(theme);
      },
      
      applyTheme: (theme) => {
        let resolved = theme;
        
        if (theme === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        set({ resolvedTheme: resolved });
        
        // Apply to document
        if (resolved === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
      },
      
      // Initialize theme on app load
      initTheme: (defaultTheme = null) => {
        const { theme, applyTheme } = get();
        const themeToApply = defaultTheme || theme;
        applyTheme(themeToApply);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
          if (get().theme === 'system') {
            applyTheme('system');
          }
        });
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export default useThemeStore;