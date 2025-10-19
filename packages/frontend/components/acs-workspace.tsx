'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import type { SiteModel, WorkInstructionExtraction } from 'shared/types';
import { SitePicker } from './site-picker';
import { StandardCleaningInstructionView } from './standard-cleaning-instruction-view';

interface AcsWorkspaceProps {
  instructions: WorkInstructionExtraction[];
  selectedInstructionId: string | null;
  onSelectInstruction: (id: string) => void;
  onImportComplete: (records: WorkInstructionExtraction[]) => void;
}

export function AcsWorkspace({
  instructions,
  selectedInstructionId,
  onSelectInstruction,
  onImportComplete
}: AcsWorkspaceProps) {
  const [allSections, setAllSections] = useState<WorkInstructionExtraction[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteModel | null>(null);
  const [isLoadingWorkbooks, setIsLoadingWorkbooks] = useState(false);
  const [hasLoadedWorkbooks, setHasLoadedWorkbooks] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedSection = useMemo(() => {
    return allSections.find((section) => section.id === selectedSectionId) || null;
  }, [allSections, selectedSectionId]);

  // Sync incoming instructions into local list for display
  useEffect(() => {
    const validRecords = instructions.filter((record) => record?.section);
    if (!validRecords.length) {
      return;
    }

    setAllSections((prev) => {
      const merged: WorkInstructionExtraction[] = [];
      const seen = new Set<string>();

      // Prefer newest instructions first
      for (const record of validRecords) {
        if (!seen.has(record.id)) {
          merged.push(record);
          seen.add(record.id);
        }
      }

      for (const record of prev) {
        if (!seen.has(record.id) && record?.section) {
          merged.push(record);
          seen.add(record.id);
        }
      }

      return merged;
    });

    const currentStillValid = selectedSectionId && validRecords.some((item) => item.id === selectedSectionId);
    if (!currentStillValid) {
      const nextId = validRecords[0]?.id;
      if (nextId) {
        setSelectedSectionId(nextId);
        onSelectInstruction(nextId);
      }
    }
  }, [instructions, selectedSectionId, onSelectInstruction]);

  // Respond to parent selection changes
  useEffect(() => {
    if (selectedInstructionId) {
      setSelectedSectionId(selectedInstructionId);
    }
  }, [selectedInstructionId]);

  const fetchExistingSections = async () => {
    try {
      setIsLoadingWorkbooks(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/extraction/work-instruction/acs?limit=1000`);

      if (!response.ok) {
        throw new Error('Failed to fetch existing work instructions');
      }

      const payload = await response.json();
      const records = (payload?.data || []) as WorkInstructionExtraction[];
      const filtered = records.filter((record) => record?.section);
      setAllSections(filtered);

      if (!selectedSectionId && filtered[0]?.id) {
        setSelectedSectionId(filtered[0].id);
        onSelectInstruction(filtered[0].id);
      }
    } catch (error) {
      console.error('❌ [AcsWorkspace] Failed to fetch sections:', error);
    } finally {
      setIsLoadingWorkbooks(false);
      setHasLoadedWorkbooks(true);
    }
  };

  useEffect(() => {
    if (!hasLoadedWorkbooks && !isLoadingWorkbooks) {
      void fetchExistingSections();
    }
  }, [hasLoadedWorkbooks, isLoadingWorkbooks]);

  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setUploadError('Please select a valid PDF file.');
      return;
    }

    if (!selectedSite) {
      setUploadError('Please select a site before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project', 'acs');
      formData.append('siteId', selectedSite.id);
      formData.append('siteName', selectedSite.name);
      if (selectedSite.groupId) formData.append('groupId', selectedSite.groupId);
      if (selectedSite.divisionId) formData.append('divisionId', selectedSite.divisionId);

      const response = await fetch(`${apiUrl}/api/extraction/work-instruction`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Extraction failed');
      }

      const payload = await response.json();
      const records = (payload?.data?.records || []) as WorkInstructionExtraction[];

      if (!records.length) {
        setUploadError('Extraction succeeded but returned no sections.');
        return;
      }

      onImportComplete(records);
      setAllSections((prev) => [...records.filter((record) => record?.section), ...prev]);

      const nextId = records[0]?.id;
      if (nextId) {
        setSelectedSectionId(nextId);
        onSelectInstruction(nextId);
      }

      setUploadSuccess(`Imported ${records.length} section${records.length === 1 ? '' : 's'}.`);
    } catch (error: any) {
      setUploadError(error?.message || 'Failed to import work instruction');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void handleFileUpload(file);
    }
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_-26px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-900 dark:shadow-[0_20px_55px_-32px_rgba(0,0,0,0.8)]">
      {/* Left Sidebar */}
      <div className="flex w-80 flex-shrink-0 flex-col overflow-y-auto border-r border-slate-200/70 bg-white/95 dark:border-white/10 dark:bg-slate-900/70">
        <div className="border-b border-slate-200/70 px-5 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Standard Cleaning Instructions</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {allSections.length} sections imported from {new Set(allSections.map((s) => s.siteName)).size} sites
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <UploadCard
            isUploading={isUploading}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            selectedSite={selectedSite}
            onSiteSelect={setSelectedSite}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />
        </div>
      </div>

      {/* Pills + Detail */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex-shrink-0 border-b border-slate-200/70 bg-white/95 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
          {isLoadingWorkbooks ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading sections...
            </div>
          ) : allSections.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No sections yet. Import a document to get started.</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-1">
              {allSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSectionId(section.id);
                    onSelectInstruction(section.id);
                  }}
                  className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    selectedSectionId === section.id
                      ? 'border-transparent bg-teal-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {section.section?.title || section.section?.documentMetadata?.title || section.sourceFile?.name || 'Untitled'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
          {selectedSection ? (
            <StandardCleaningInstructionView
              section={selectedSection.section}
              siteInfo={{
                siteName: selectedSection.siteName,
                location: selectedSection.section?.area?.[0]
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <FileSpreadsheet className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {allSections.length === 0 ? 'No sections available' : 'Select a section to view details'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {allSections.length === 0 ? 'Import your first work instruction document' : 'Use the buttons above to switch sections'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface UploadCardProps {
  isUploading: boolean;
  uploadError: string | null;
  uploadSuccess: string | null;
  selectedSite: SiteModel | null;
  onSiteSelect: (site: SiteModel) => void;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadCard({
  isUploading,
  uploadError,
  uploadSuccess,
  selectedSite,
  onSiteSelect,
  fileInputRef,
  onFileChange
}: UploadCardProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-300 bg-white/90 p-5 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-900/60">
      <SitePicker selectedSiteId={selectedSite?.id || null} onSiteSelect={onSiteSelect} disabled={isUploading} />

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-center transition-all hover:border-teal-300 hover:bg-teal-50/50 dark:border-slate-600 dark:bg-slate-800/60 dark:hover:border-cyan-400 dark:hover:bg-cyan-900/20">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-cyan-900/50 dark:text-cyan-300">
          {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
        </div>
        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          Drag and drop a PDF here, or click to browse
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500">Supported: PDF · Max size 25 MB</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !selectedSite}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-teal-400 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:from-slate-400 disabled:to-slate-400"
        >
          <FileText className="h-4 w-4" />
          {isUploading ? 'Uploading…' : 'Select PDF'}
        </button>
        {!selectedSite && !isUploading && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">Please select a site first</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          className="hidden"
        />
        {uploadError ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-200">
            <AlertCircle className="h-4 w-4" />
            {uploadError}
          </div>
        ) : null}
        {uploadSuccess ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            {uploadSuccess}
          </div>
        ) : null}
      </div>
    </div>
  );
}
