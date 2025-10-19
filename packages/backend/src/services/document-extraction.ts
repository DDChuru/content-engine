import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFDocument, PDFName, PDFDict, PDFRawStream, PDFArray } from 'pdf-lib';
import type {
  WorkInstructionChemical,
  WorkInstructionColourCode,
  WorkInstructionDocumentMetadata,
  WorkInstructionImage,
  WorkInstructionSection,
  WorkInstructionStepDetail,
  WorkInstructionStepGroup
} from 'shared/types';

interface SectionSummary {
  sectionId: string;
  title: string;
  pageRange: string;
  notes: string[];
  chunkBase64: string;
  pageOffset: number;
  localPageRange: string;
}

interface SummaryResult {
  metadata: WorkInstructionDocumentMetadata;
  sections: SectionSummary[];
}

const SECTION_SUMMARY_PROMPT = `Identify each cleaning section in this document and provide a concise summary.

Output Requirements:
- Return JSON with the document metadata (title, documentId, department, author, revision, effective date, review date, approvals).
- Include an ordered array named "sections" with entries for every major heading (for example WALLS, FLOORS, CHAIRS, etc.).
- Each section entry must include:
  * sectionId (1-based index as string)
  * title (exact heading text)
  * pageRange (e.g. "p1" or "p2-3", empty string if unknown)
  * notes (bullet list of any short descriptors such as AREA, CATEGORY or other quick metadata visible in the header).
- Do not include step details here—only identification information.
- Return only JSON that satisfies the provided schema.`;

const SECTION_SUMMARY_SCHEMA = {
  type: 'object',
  properties: {
    metadata: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        documentId: { type: 'string' },
        department: { type: 'string' },
        author: { type: 'string' },
        revision: { type: 'string' },
        effectiveDate: { type: 'string' },
        reviewDate: { type: 'string' },
        approvals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string' },
              name: { type: 'string' },
              date: { type: 'string' }
            },
            required: ['role', 'name', 'date']
          }
        }
      },
      required: ['title', 'documentId', 'department', 'author', 'revision', 'effectiveDate', 'reviewDate', 'approvals']
    },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sectionId: { type: 'string' },
          title: { type: 'string' },
          pageRange: { type: 'string' },
          notes: { type: 'array', items: { type: 'string' } }
        },
        required: ['sectionId', 'title', 'pageRange', 'notes']
      }
    }
  },
  required: ['metadata', 'sections']
} as const;

const SECTION_DETAIL_PROMPT = (section: SectionSummary) => `Extract a fully structured representation for the section titled "${section.title}" ${section.pageRange ? `(located around ${section.pageRange})` : ''}.

Instructions:
- Focus exclusively on this section; ignore other sections.
- Capture every table entry (area, chemical/use ratio, cleaning record, maintenance assistance, frequency, responsibility, inspected by, key inspection points, colour codes, PPE labels, application equipment, additional notes).
- Convert numbered or bulleted instructions under any sub headings (e.g. DAILY, WEEKLY, DEEP CLEANING) into step groups with individual steps.
- Preserve original wording; tidy whitespace only.
- Include pageRange field (use the provided value if uncertain).
- Use empty strings "" or empty arrays [] when data is missing.
- IMPORTANT: For images, ONLY include images that show cleaning procedures, equipment, or areas. EXCLUDE company logos, headers, footers, and decorative graphics.
- Return only JSON that matches the provided schema.`;

const SECTION_DETAIL_SCHEMA = {
  type: 'object',
  properties: {
    sectionId: { type: 'string' },
    title: { type: 'string' },
    pageRange: { type: 'string' },
    area: { type: 'array', items: { type: 'string' } },
    chemicals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          useRatio: { type: 'string' }
        },
        required: ['name', 'useRatio']
      }
    },
    cleaningRecord: { type: 'string' },
    maintenanceAssistance: { type: 'string' },
    frequency: { type: 'string' },
    responsibility: { type: 'string' },
    inspectedBy: { type: 'string' },
    keyInspectionPoints: { type: 'array', items: { type: 'string' } },
    safetyNotes: { type: 'array', items: { type: 'string' } },
    ppeRequired: { type: 'array', items: { type: 'string' } },
    colourCodes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          colour: { type: 'string' },
          meaning: { type: 'string' }
        },
        required: ['colour', 'meaning']
      }
    },
    applicationEquipment: { type: 'array', items: { type: 'string' } },
    additionalNotes: { type: 'array', items: { type: 'string' } },
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          caption: { type: 'string' },
          pageNumber: { type: 'number' },
          url: { type: 'string' },
          storagePath: { type: 'string' }
        },
        required: ['caption', 'pageNumber']
      }
    },
    stepGroups: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          frequency: { type: 'string' },
          steps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                order: { type: 'number' },
                label: { type: 'string' },
                action: { type: 'string' },
                notes: { type: 'array', items: { type: 'string' } }
              },
              required: ['order', 'label', 'action', 'notes']
            }
          }
        },
        required: ['title', 'description', 'steps']
      }
    }
  },
  required: [
    'sectionId',
    'title',
    'pageRange',
    'area',
    'chemicals',
    'cleaningRecord',
    'maintenanceAssistance',
    'frequency',
    'responsibility',
    'inspectedBy',
    'keyInspectionPoints',
    'safetyNotes',
    'ppeRequired',
    'colourCodes',
    'applicationEquipment',
    'additionalNotes',
    'images',
    'stepGroups'
  ]
} as const;

const DEFAULT_CHUNK_SIZE = 6;

const adjustPageRange = (range: string, offset: number): string => {
  if (!range) return '';

  const match = range.match(/p?\s*(\d+)(?:\s*[-–]\s*(\d+))?/i);
  if (!match) return range;

  const start = Number.parseInt(match[1], 10);
  if (Number.isNaN(start)) return range;
  const end = match[2] ? Number.parseInt(match[2], 10) : start;
  const adjustedStart = start + offset;
  const adjustedEnd = end + offset;
  return adjustedStart === adjustedEnd ? `p${adjustedStart}` : `p${adjustedStart}-${adjustedEnd}`;
};

const parsePageRange = (range: string): number[] => {
  if (!range) return [];
  const match = range.match(/p?\s*(\d+)(?:\s*[-–]\s*(\d+))?/i);
  if (!match) return [];
  const start = Number.parseInt(match[1], 10);
  const end = match[2] ? Number.parseInt(match[2], 10) : start;
  if (Number.isNaN(start) || Number.isNaN(end)) return [];
  const pages: number[] = [];
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  return pages;
};

const splitPdfIntoChunks = async (
  pdfBase64: string,
  pagesPerChunk: number = DEFAULT_CHUNK_SIZE
): Promise<Array<{ base64: string; pageOffset: number }>> => {
  const pdfBytes = Buffer.from(pdfBase64, 'base64');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();
  const chunks: Array<{ base64: string; pageOffset: number }> = [];

  for (let start = 0; start < totalPages; start += pagesPerChunk) {
    const end = Math.min(start + pagesPerChunk, totalPages);
    const chunkDoc = await PDFDocument.create();
    const copiedPages = await chunkDoc.copyPages(
      pdfDoc,
      Array.from({ length: end - start }, (_, idx) => start + idx)
    );
    copiedPages.forEach((page) => chunkDoc.addPage(page));
    const chunkBytes = await chunkDoc.save();
    chunks.push({
      base64: Buffer.from(chunkBytes).toString('base64'),
      pageOffset: start
    });
  }

  return chunks;
};

const collectImagesByPage = async (
  pdfBase64: string
): Promise<Map<number, Array<{ data: string; mimeType: string }>>> => {
  const imagesByPage = new Map<number, Array<{ data: string; mimeType: string }>>();
  const pdfBytes = Buffer.from(pdfBase64, 'base64');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const context = pdfDoc.context;

  for (let pageIndex = 0; pageIndex < pdfDoc.getPageCount(); pageIndex += 1) {
    const page = pdfDoc.getPage(pageIndex);
    const resourcesDict = page.node.Resources();
    const xObjectDictMaybe = resourcesDict?.lookup(PDFName.of('XObject'));
    const xObjectDict = xObjectDictMaybe instanceof PDFDict ? xObjectDictMaybe : undefined;
    if (!xObjectDict) {
      continue;
    }

    for (const [key, ref] of xObjectDict.entries()) {
      const xObject = context.lookup(ref);
      if (!(xObject instanceof PDFRawStream)) continue;
      const subtype = xObject.dict.get(PDFName.of('Subtype'));
      if (!(subtype instanceof PDFName) || subtype !== PDFName.of('Image')) continue;

      const filter = xObject.dict.get(PDFName.of('Filter'));
      const filters: PDFName[] = [];
      if (filter instanceof PDFName) {
        filters.push(filter);
      } else if (filter instanceof PDFArray) {
        for (let idx = 0; idx < filter.size(); idx += 1) {
          const item = filter.get(idx);
          if (item instanceof PDFName) {
            filters.push(item);
          }
        }
      }

      let mimeType: string | null = null;
      if (filters.some((item) => item === PDFName.of('DCTDecode'))) {
        mimeType = 'image/jpeg';
      } else if (filters.some((item) => item === PDFName.of('JPXDecode'))) {
        mimeType = 'image/jp2';
      }

      if (!mimeType) continue;

      const data = Buffer.from(xObject.contents).toString('base64');
      if (!data) continue;

      const list = imagesByPage.get(pageIndex + 1) ?? [];
      list.push({ data, mimeType });
      imagesByPage.set(pageIndex + 1, list);
    }
  }

  return imagesByPage;
};

const asString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const asStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean);
  }
  if (typeof value === 'string') {
    return asString(value)
      .split(/[\n,•;\-]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const asChemicalArray = (value: unknown): WorkInstructionChemical[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const chemical = item as Record<string, unknown>;
      const name = asString(chemical.name);
      const useRatio = asString(chemical.useRatio);
      if (!name && !useRatio) return null;
      return { name, useRatio };
    })
    .filter((item): item is WorkInstructionChemical => Boolean(item));
};

const asColourCodes = (value: unknown): WorkInstructionColourCode[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const entry = item as Record<string, unknown>;
      const colour = asString(entry.colour);
      const meaning = asString(entry.meaning);
      if (!colour && !meaning) return null;
      return { colour, meaning };
    })
    .filter((item): item is WorkInstructionColourCode => Boolean(item));
};

const asStepGroups = (value: unknown): WorkInstructionStepGroup[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const group = item as Record<string, unknown>;
      const title = asString(group.title);
      const description = asString(group.description);
      const frequency = asString(group.frequency);
      const stepsRaw = Array.isArray(group.steps) ? group.steps : [];
      const steps: WorkInstructionStepDetail[] = stepsRaw
        .map((step, index) => {
          if (!step || typeof step !== 'object') return null;
          const detail = step as Record<string, unknown>;
          const label = asString(detail.label) || `Step ${index + 1}`;
          const action = asString(detail.action);
          const notes = asStringArray(detail.notes);
          const orderRaw = detail.order;
          const order = typeof orderRaw === 'number' && Number.isFinite(orderRaw) ? orderRaw : index + 1;
          if (!label && !action) return null;
          return { order, label, action, notes };
        })
        .filter((step): step is WorkInstructionStepDetail => Boolean(step));

      if (!title && steps.length === 0) return null;
      return { title, description, frequency, steps };
    })
    .filter((group): group is WorkInstructionStepGroup => Boolean(group));
};

const normalizeDocumentMetadata = (value: unknown): WorkInstructionDocumentMetadata => {
  const data = (value && typeof value === 'object') ? (value as Record<string, unknown>) : {};
  return {
    title: asString(data.title),
    documentId: asString(data.documentId),
    department: asString(data.department),
    author: asString(data.author),
    revision: asString(data.revision),
    effectiveDate: asString(data.effectiveDate),
    reviewDate: asString(data.reviewDate),
    approvals: Array.isArray(data.approvals)
      ? data.approvals
          .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const approval = item as Record<string, unknown>;
            return {
              role: asString(approval.role),
              name: asString(approval.name),
              date: asString(approval.date)
            };
          })
          .filter((item): item is { role: string; name: string; date: string } => Boolean(item))
      : []
  };
};

const normalizeSummary = (value: any): SummaryResult | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const payload = value as Record<string, unknown>;
  const metadata = normalizeDocumentMetadata(payload.metadata);
  const sections = Array.isArray(payload.sections)
    ? payload.sections
        .map((item, index) => {
          if (!item || typeof item !== 'object') return null;
          const section = item as Record<string, unknown>;
          const title = asString(section.title);
          if (!title) return null;
          const summary: SectionSummary = {
            sectionId: asString(section.sectionId) || String(index + 1),
            title,
            pageRange: asString(section.pageRange),
            notes: asStringArray(section.notes),
            chunkBase64: '',
            pageOffset: 0,
            localPageRange: asString(section.pageRange)
          };
          return summary;
        })
        .filter((item): item is SectionSummary => Boolean(item))
    : [];

  if (!sections.length) {
    return null;
  }

  return { metadata, sections };
};

const normalizeImages = (value: unknown): WorkInstructionImage[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const image = item as Record<string, unknown>;
      const caption = asString(image.caption);
      const pageNumberRaw = image.pageNumber;
      const pageNumber = typeof pageNumberRaw === 'number' && Number.isFinite(pageNumberRaw) ? pageNumberRaw : 0;
      const url = asString(image.url);
      const storagePath = asString(image.storagePath);
      if (!caption && !url) return null;
      return {
        caption,
        pageNumber,
        url: url || undefined,
        storagePath: storagePath || undefined
      } satisfies WorkInstructionImage;
    })
    .filter((item): item is WorkInstructionImage => Boolean(item));
};

const normalizeSectionDetail = (
  value: any,
  metadata: WorkInstructionDocumentMetadata,
  summary: SectionSummary
): WorkInstructionSection | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const section = value as Record<string, unknown>;
  const title = asString(section.title) || summary.title;
  if (!title) return null;

  const rawRange = asString(section.pageRange) || summary.localPageRange || summary.pageRange;
  const globalRange = adjustPageRange(rawRange, summary.pageOffset);

  return {
    sectionId: asString(section.sectionId) || summary.sectionId,
    title,
    pageRange: globalRange,
    documentMetadata: metadata,
    area: asStringArray(section.area),
    chemicals: asChemicalArray(section.chemicals),
    cleaningRecord: asString(section.cleaningRecord),
    maintenanceAssistance: asString(section.maintenanceAssistance),
    frequency: asString(section.frequency),
    responsibility: asString(section.responsibility),
    inspectedBy: asString(section.inspectedBy),
    keyInspectionPoints: asStringArray(section.keyInspectionPoints),
    safetyNotes: asStringArray(section.safetyNotes),
    ppeRequired: asStringArray(section.ppeRequired),
    colourCodes: asColourCodes(section.colourCodes),
    applicationEquipment: asStringArray(section.applicationEquipment),
    additionalNotes: asStringArray(section.additionalNotes),
    images: normalizeImages(section.images),
    stepGroups: asStepGroups(section.stepGroups)
  };
};

const parseGeminiJson = (responseText: string): any => {
  if (!responseText?.trim()) {
    throw new Error('Gemini returned an empty response');
  }

  const cleaned = responseText.replace(/```json\s*|```/gi, '').trim();

  const tryParse = (input: string) => {
    try {
      return JSON.parse(input);
    } catch {
      return null;
    }
  };

  let parsed = tryParse(cleaned);
  if (parsed) {
    return parsed;
  }

  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  const startIndex = [firstBrace, firstBracket]
    .filter((value) => value !== -1)
    .sort((a, b) => a - b)[0] ?? 0;

  const candidate = cleaned.slice(Math.max(startIndex, 0));
  parsed = tryParse(candidate);
  if (parsed) {
    return parsed;
  }

  const lastBrace = candidate.lastIndexOf('}');
  const lastBracket = candidate.lastIndexOf(']');
  const endIndex = Math.max(lastBrace, lastBracket);
  if (endIndex !== -1) {
    parsed = tryParse(candidate.slice(0, endIndex + 1));
    if (parsed) {
      return parsed;
    }
  }

  let balanced = candidate;
  const braceDelta = (balanced.match(/{/g) || []).length - (balanced.match(/}/g) || []).length;
  const bracketDelta = (balanced.match(/\[/g) || []).length - (balanced.match(/\]/g) || []).length;

  if (braceDelta > 0) {
    balanced += '}'.repeat(braceDelta);
  }

  if (bracketDelta > 0) {
    balanced += ']'.repeat(bracketDelta);
  }

  parsed = tryParse(balanced);
  if (parsed) {
    return parsed;
  }

  console.error('❌ Failed to parse Gemini response. Full response:', cleaned.slice(0, 2000));
  throw new Error('Failed to parse Gemini response as JSON');
};

export class DocumentExtractionService {
  private genAI: GoogleGenerativeAI;

  constructor(private apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async extractSections(pdfBase64: string): Promise<WorkInstructionSection[]> {
    const chunks = await splitPdfIntoChunks(pdfBase64);
    const imagesByPage = await collectImagesByPage(pdfBase64);
    let documentMetadata: WorkInstructionDocumentMetadata | null = null;
    const aggregatedSummaries: SectionSummary[] = [];
    let sectionCounter = 1;

    for (const chunk of chunks) {
      try {
        const summary = await this.extractSummaryChunkWithFallback(chunk.base64);
        if (!documentMetadata) {
          documentMetadata = summary.metadata;
        }

        summary.sections.forEach((section) => {
          const localRange = section.pageRange;
          aggregatedSummaries.push({
            sectionId: String(sectionCounter++),
            title: section.title,
            pageRange: adjustPageRange(localRange, chunk.pageOffset),
            notes: section.notes,
            chunkBase64: chunk.base64,
            pageOffset: chunk.pageOffset,
            localPageRange: localRange
          });
        });
      } catch (error) {
        console.error('⚠️ Failed to summarize chunk starting at page', chunk.pageOffset + 1, error);
      }
    }

    if (!documentMetadata) {
      throw new Error('Failed to extract document metadata');
    }

    const sections: WorkInstructionSection[] = [];

    for (const summary of aggregatedSummaries) {
      try {
        const detail = await this.extractSectionDetail(summary.chunkBase64, documentMetadata, summary);
        if (detail) {
          let pageNumbers = parsePageRange(detail.pageRange || summary.pageRange);
          if (!pageNumbers.length) {
            pageNumbers = [summary.pageOffset + 1];
          }
          const extractedImages = pageNumbers.flatMap((pageNumber) => {
            const items = imagesByPage.get(pageNumber) ?? [];
            return items.map((image) => ({ ...image, pageNumber }));
          });

          const existingImages = detail.images ?? [];

          if (extractedImages.length) {
            const mergedImages = extractedImages.map((image, index) => {
              const existing = existingImages[index];
              return {
                caption: existing?.caption || '',
                pageNumber: image.pageNumber,
                data: image.data,
                mimeType: image.mimeType
              };
            });

            if (existingImages.length > extractedImages.length) {
              for (let i = extractedImages.length; i < existingImages.length; i += 1) {
                mergedImages.push(existingImages[i]);
              }
            }

            detail.images = mergedImages;
          } else if (existingImages.length) {
            detail.images = existingImages;
          }

          sections.push(detail);
        }
      } catch (error) {
        console.error(`⚠️ Failed to extract section ${summary.title}:`, error);
      }
    }

    if (!sections.length) {
      throw new Error('No sections extracted from document');
    }

    return sections;
  }

  private async extractSummaryChunkWithFallback(pdfBase64: string): Promise<SummaryResult> {
    try {
      return await this.extractSummary(pdfBase64);
    } catch (error) {
      console.warn('⚠️ Summary extraction failed for chunk, retrying with compact schema:', (error as Error)?.message);
      return await this.extractSummaryCompact(pdfBase64);
    }
  }

  private async extractSummary(pdfBase64: string): Promise<SummaryResult> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
        responseSchema: SECTION_SUMMARY_SCHEMA
      }
    });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: SECTION_SUMMARY_PROMPT },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: pdfBase64
              }
            }
          ]
        }
      ]
    });

    if (!result?.response) {
      throw new Error('No response from Gemini API during summary extraction');
    }

    const parsed = parseGeminiJson(result.response.text());
    const summary = normalizeSummary(parsed);
    if (!summary) {
      throw new Error('Failed to extract section summaries');
    }

    return summary;
  }

  private async extractSummaryCompact(pdfBase64: string): Promise<SummaryResult> {
    const COMPACT_PROMPT = `${SECTION_SUMMARY_PROMPT}

Additional constraint: keep JSON concise. For each section only return sectionId, title, pageRange and omit notes.`;

    const COMPACT_SCHEMA = {
      type: 'object',
      properties: {
        metadata: SECTION_SUMMARY_SCHEMA.properties.metadata,
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sectionId: { type: 'string' },
              title: { type: 'string' },
              pageRange: { type: 'string' }
            },
            required: ['sectionId', 'title', 'pageRange']
          }
        }
      },
      required: ['metadata', 'sections']
    } as const;

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
        responseSchema: COMPACT_SCHEMA
      }
    });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: COMPACT_PROMPT },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: pdfBase64
              }
            }
          ]
        }
      ]
    });

    if (!result?.response) {
      throw new Error('No response from Gemini API during compact summary extraction');
    }

    const parsed = parseGeminiJson(result.response.text());
    const summary = normalizeSummary(parsed);
    if (!summary) {
      throw new Error('Failed to extract section summaries (compact)');
    }

    // ensure notes exist even if omitted
    summary.sections = summary.sections.map((section) => ({
      ...section,
      notes: section.notes ?? []
    }));

    return summary;
  }

  private async extractSectionDetail(
    pdfBase64: string,
    metadata: WorkInstructionDocumentMetadata,
    sectionSummary: SectionSummary
  ): Promise<WorkInstructionSection | null> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 3072,
        responseMimeType: 'application/json',
        responseSchema: SECTION_DETAIL_SCHEMA
      }
    });

    const promptSection = {
      ...sectionSummary,
      pageRange: sectionSummary.localPageRange || sectionSummary.pageRange
    };

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: SECTION_DETAIL_PROMPT(promptSection) },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: pdfBase64
              }
            }
          ]
        }
      ]
    });

    if (!result?.response) {
      throw new Error(`No response from Gemini API while extracting section ${sectionSummary.title}`);
    }

    const parsed = parseGeminiJson(result.response.text());
    return normalizeSectionDetail(parsed, metadata, sectionSummary);
  }
}
