// src\composables\useActiveTab.ts
import { useEffect, useState } from 'react';

export const useActiveTab = () => {
  const [domainKeyword, setDomainKeyword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs?.[0];
        if (!tab?.url) return;

        try {
          const parsedUrl = new URL(tab.url);
          const host = parsedUrl.hostname;

          const parts = host.split('.');
          let rootDomain = '';

          if (parts.length >= 2) {
            rootDomain = parts.slice(-2, -1)[0];
          } else {
            rootDomain = parts[0];
          }

          setDomainKeyword(rootDomain);
        } catch (err) {
          console.warn('[DomainSearch] Could not parse URL:', tab.url);
        }
      });
    } catch (err: any) {
      console.error('[DomainSearch] Error accessing active tab:', err);
      setError('Cannot read browser tab');
    }
  }, []);

  return { domainKeyword, error };
};
