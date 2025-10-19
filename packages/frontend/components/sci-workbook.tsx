'use client';

import { useState } from 'react';
import type { WorkInstructionExtraction } from 'shared/types';
import { StandardCleaningInstructionView } from './standard-cleaning-instruction-view';
import { Download, FileSpreadsheet, ChevronLeft, ChevronRight } from 'lucide-react';

interface SCIWorkbookProps {
  records: WorkInstructionExtraction[];
  onClose?: () => void;
}

export function SCIWorkbook({ records, onClose }: SCIWorkbookProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  if (!records || records.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No sections available to display
        </p>
      </div>
    );
  }

  const activeRecord = records[activeTabIndex];
  const canNavigatePrev = activeTabIndex > 0;
  const canNavigateNext = activeTabIndex < records.length - 1;

  const handlePrevious = () => {
    if (canNavigatePrev) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  const handleNext = () => {
    if (canNavigateNext) {
      setActiveTabIndex(activeTabIndex + 1);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
      {/* Header with Tabs */}
      <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-teal-600 dark:text-cyan-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Standard Cleaning Instructions
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {records.length} section{records.length === 1 ? '' : 's'} imported
                {activeRecord?.siteName && ` from ${activeRecord.siteName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition dark:bg-slate-700 dark:text-slate-400"
              title="Export to Excel (coming soon)"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={!canNavigatePrev}
            className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-700"
            title="Previous section"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Tabs Container */}
          <div className="flex flex-1 gap-2 overflow-x-auto">
            {records.map((record, index) => {
              const isActive = index === activeTabIndex;
              const sectionTitle = record.section?.title || `Section ${index + 1}`;
              const truncatedTitle = sectionTitle.length > 25
                ? `${sectionTitle.substring(0, 25)}...`
                : sectionTitle;

              return (
                <button
                  key={record.id}
                  onClick={() => setActiveTabIndex(index)}
                  className={`flex-shrink-0 rounded-t-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-900 dark:text-cyan-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                  title={sectionTitle}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {index + 1}
                    </span>
                    {truncatedTitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNavigateNext}
            className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-700"
            title="Next section"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeRecord?.section ? (
          <StandardCleaningInstructionView
            section={activeRecord.section}
            siteInfo={{
              siteName: activeRecord.siteName,
              location: activeRecord.section.area?.[0]
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Section data not available
            </p>
          </div>
        )}
      </div>

      {/* Footer with Tab Info */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-2 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div>
            Section {activeTabIndex + 1} of {records.length}
          </div>
          <div className="flex items-center gap-4">
            {activeRecord?.createdAt && (
              <span>
                Imported {new Date(activeRecord.createdAt).toLocaleDateString()}
              </span>
            )}
            {activeRecord?.sourceFile?.name && (
              <span className="truncate max-w-xs" title={activeRecord.sourceFile.name}>
                Source: {activeRecord.sourceFile.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
