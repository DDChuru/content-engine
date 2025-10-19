'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, MapPin, CheckCircle2 } from 'lucide-react';
import type { SiteModel } from 'shared/types';

interface SitePickerProps {
  selectedSiteId: string | null;
  onSiteSelect: (site: SiteModel) => void;
  disabled?: boolean;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SitePicker({ selectedSiteId, onSiteSelect, disabled }: SitePickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sites, setSites] = useState<SiteModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteModel | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch sites based on search term
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        let url: string;
        if (debouncedSearch && debouncedSearch.length >= 2) {
          url = `${apiUrl}/api/extraction/sites/search?q=${encodeURIComponent(debouncedSearch)}`;
          console.log('🔍 [SitePicker] Searching sites:', { searchTerm: debouncedSearch, url });
        } else {
          url = `${apiUrl}/api/extraction/sites`;
          console.log('🏢 [SitePicker] Fetching all sites:', { url });
        }

        console.log('📡 [SitePicker] Making request to:', url);
        const response = await fetch(url);

        console.log('📡 [SitePicker] Response status:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [SitePicker] Response not OK:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error('Failed to fetch sites');
        }

        const payload = await response.json();
        console.log('✅ [SitePicker] Response received:', {
          success: payload.success,
          dataLength: payload?.data?.length || 0,
          firstSite: payload?.data?.[0] ? { id: payload.data[0].id, name: payload.data[0].name } : null
        });

        const fetchedSites = (payload?.data || []) as SiteModel[];
        setSites(fetchedSites);

        console.log('📊 [SitePicker] Sites state updated:', {
          count: fetchedSites.length,
          siteNames: fetchedSites.slice(0, 5).map(s => s.name)
        });
      } catch (error) {
        console.error('❌ [SitePicker] Failed to fetch sites:', error);
        setSites([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSites();
  }, [debouncedSearch]);

  const handleSiteClick = useCallback((site: SiteModel) => {
    setSelectedSite(site);
    setSearchTerm(site.name);
    setIsDropdownOpen(false);
    onSiteSelect(site);
  }, [onSiteSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsDropdownOpen(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  }, []);

  return (
    <div className="relative w-full">
      <label
        htmlFor="site-picker"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Select Site
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-slate-400" />
        </div>

        <input
          id="site-picker"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search sites by name or location..."
          disabled={disabled}
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/40"
        />

        {selectedSite && selectedSite.id === selectedSiteId && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isDropdownOpen && !disabled && (
        <div className="absolute z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {isLoading && (
            <div className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">
              Searching...
            </div>
          )}

          {!isLoading && sites.length === 0 && (
            <div className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">
              {searchTerm.length >= 2
                ? 'No sites found'
                : 'Type to search sites'}
            </div>
          )}

          {!isLoading && sites.length > 0 && (
            <ul className="py-1">
              {sites.map((site) => (
                <li key={site.id}>
                  <button
                    type="button"
                    onClick={() => handleSiteClick(site)}
                    className={`flex w-full items-start gap-3 px-4 py-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      site.id === selectedSiteId
                        ? 'bg-teal-50 dark:bg-cyan-900/20'
                        : ''
                    }`}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {site.name}
                      </div>
                      {site.location && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {site.location}
                        </div>
                      )}
                      {site.fullAddress && (
                        <div className="truncate text-xs text-slate-400 dark:text-slate-500">
                          {site.fullAddress}
                        </div>
                      )}
                    </div>
                    {site.id === selectedSiteId && (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedSite && (
        <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
          <span className="font-semibold">Selected:</span> {selectedSite.name}
          {selectedSite.location && ` — ${selectedSite.location}`}
        </div>
      )}
    </div>
  );
}
