'use client';

import type { WorkInstructionSection } from 'shared/types';
import { FileText, MapPin, Clock, User, ShieldCheck, Droplet, ClipboardList } from 'lucide-react';

interface StandardCleaningInstructionViewProps {
  section: WorkInstructionSection;
  siteInfo?: {
    siteName?: string;
    location?: string;
  };
}

export function StandardCleaningInstructionView({
  section,
  siteInfo
}: StandardCleaningInstructionViewProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 dark:border-slate-700 dark:from-teal-950/30 dark:to-cyan-950/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {section.documentMetadata.title} — {section.documentMetadata.documentId}
            </p>
            {siteInfo?.siteName && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4" />
                <span>{siteInfo.siteName}</span>
                {siteInfo.location && <span className="text-slate-400">• {siteInfo.location}</span>}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Page Range
            </div>
            <div className="text-sm text-slate-900 dark:text-white">{section.pageRange || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Document Metadata Table */}
      <TableSection title="Document Information" icon={<FileText className="h-4 w-4" />}>
        <DataTable
          rows={[
            { label: 'Department', value: section.documentMetadata.department },
            { label: 'Author', value: section.documentMetadata.author },
            { label: 'Revision', value: section.documentMetadata.revision },
            { label: 'Effective Date', value: section.documentMetadata.effectiveDate },
            { label: 'Review Date', value: section.documentMetadata.reviewDate },
          ]}
        />

        {section.documentMetadata.approvals.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Approvals
            </h4>
            <DataTable
              headers={['Role', 'Name', 'Date']}
              rows={section.documentMetadata.approvals.map(approval => ({
                cells: [approval.role, approval.name, approval.date]
              }))}
            />
          </div>
        )}
      </TableSection>

      {/* Area & Responsibilities Table */}
      <TableSection title="Area & Responsibilities" icon={<ClipboardList className="h-4 w-4" />}>
        <DataTable
          rows={[
            { label: 'Area(s)', value: section.area.join(', ') || '—' },
            { label: 'Frequency', value: section.frequency || '—' },
            { label: 'Responsibility', value: section.responsibility || '—' },
            { label: 'Inspected By', value: section.inspectedBy || '—' },
            { label: 'Cleaning Record', value: section.cleaningRecord || '—' },
            { label: 'Maintenance Assistance', value: section.maintenanceAssistance || '—' },
          ]}
        />
      </TableSection>

      {/* Chemicals Table */}
      {section.chemicals.length > 0 && (
        <TableSection title="Chemicals" icon={<Droplet className="h-4 w-4" />}>
          <DataTable
            headers={['Chemical Name', 'Use Ratio']}
            rows={section.chemicals.map(chemical => ({
              cells: [chemical.name, chemical.useRatio]
            }))}
          />
        </TableSection>
      )}

      {/* PPE & Safety Table */}
      {(section.ppeRequired.length > 0 || section.safetyNotes.length > 0) && (
        <TableSection title="PPE & Safety Requirements" icon={<ShieldCheck className="h-4 w-4" />}>
          {section.ppeRequired.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                PPE Required
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {section.ppeRequired.map((ppe, index) => (
                  <li key={index}>{ppe}</li>
                ))}
              </ul>
            </div>
          )}
          {section.safetyNotes.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Safety Notes
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {section.safetyNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </TableSection>
      )}

      {/* Colour Codes Table */}
      {section.colourCodes.length > 0 && (
        <TableSection title="Colour Codes">
          <DataTable
            headers={['Colour', 'Meaning']}
            rows={section.colourCodes.map(code => ({
              cells: [code.colour, code.meaning]
            }))}
          />
        </TableSection>
      )}

      {/* Application Equipment */}
      {section.applicationEquipment.length > 0 && (
        <TableSection title="Application Equipment">
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {section.applicationEquipment.map((equipment, index) => (
              <li key={index}>{equipment}</li>
            ))}
          </ul>
        </TableSection>
      )}

      {/* Key Inspection Points */}
      {section.keyInspectionPoints.length > 0 && (
        <TableSection title="Key Inspection Points">
          <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {section.keyInspectionPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ol>
        </TableSection>
      )}

      {/* Cleaning Steps */}
      {section.stepGroups.length > 0 && (
        <TableSection title="Cleaning Procedure Steps" icon={<Clock className="h-4 w-4" />}>
          {section.stepGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6 last:mb-0">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                  {group.title}
                </h4>
                {group.frequency && (
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                    {group.frequency}
                  </span>
                )}
              </div>
              {group.description && (
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                  {group.description}
                </p>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50">
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                        Step
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                        Label
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                        Action
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.steps.map((step, stepIndex) => (
                      <tr
                        key={stepIndex}
                        className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/30"
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-teal-600 dark:text-cyan-400">
                          {step.order}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {step.label}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                          {step.action}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {step.notes.length > 0 ? (
                            <ul className="list-inside list-disc space-y-1">
                              {step.notes.map((note, noteIndex) => (
                                <li key={noteIndex}>{note}</li>
                              ))}
                            </ul>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </TableSection>
      )}

      {/* Additional Notes */}
      {section.additionalNotes.length > 0 && (
        <TableSection title="Additional Notes">
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {section.additionalNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </TableSection>
      )}

      {/* Images Section */}
      {section.images.length > 0 && (
        <TableSection title="Reference Images">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {section.images.map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
              >
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <FileText className="h-12 w-12 text-slate-400" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {image.caption || 'No caption'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Page {image.pageNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TableSection>
      )}
    </div>
  );
}

// Helper Components

interface TableSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function TableSection({ title, icon, children }: TableSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

interface DataTableRow {
  label?: string;
  value?: string;
  cells?: string[];
}

interface DataTableProps {
  headers?: string[];
  rows: DataTableRow[];
}

function DataTable({ headers, rows }: DataTableProps) {
  if (headers) {
    // Table with headers (multi-column)
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-600 dark:text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/30"
              >
                {row.cells?.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    {cell || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Key-value table (two-column)
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/30"
            >
              <td className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                {row.label}
              </td>
              <td className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300">
                {row.value || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
