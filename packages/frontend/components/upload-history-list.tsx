'use client';

import { FileText, Eye, Trash2, Calendar, MapPin } from 'lucide-react';

export interface WorkbookEntry {
  id: string;
  siteName: string;
  siteId: string;
  parentDocumentId: string;
  sections: any[];
  uploadedAt: string;
  sourceFileName: string;
  isExisting?: boolean;
}

interface UploadHistoryListProps {
  workbooks: WorkbookEntry[];
  onViewWorkbook: (id: string) => void;
  onDeleteWorkbook?: (id: string) => void;
}

export function UploadHistoryList({
  workbooks,
  onViewWorkbook,
  onDeleteWorkbook
}: UploadHistoryListProps) {
  if (workbooks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
        <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
          No uploads yet
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
          Upload a PDF to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Upload History ({workbooks.length})
      </h3>

      <div className="space-y-2">
        {workbooks.map((workbook) => (
          <div
            key={workbook.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-cyan-600"
          >
            {/* Icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-cyan-900/40">
              <FileText className="h-5 w-5 text-teal-600 dark:text-cyan-400" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {workbook.sourceFileName}
                </h4>
                <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {workbook.sections.length} section{workbook.sections.length === 1 ? '' : 's'}
                </span>
                {workbook.isExisting && (
                  <span className="flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    From Database
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {workbook.siteName}
                </span>
                <span>•</span>
                <span>{workbook.parentDocumentId}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(workbook.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onViewWorkbook(workbook.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
              >
                <Eye className="h-4 w-4" />
                View
              </button>

              {onDeleteWorkbook && (
                <button
                  type="button"
                  onClick={() => onDeleteWorkbook(workbook.id)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  title="Delete workbook"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
