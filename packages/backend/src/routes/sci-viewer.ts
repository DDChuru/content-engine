import { Router, Request, Response } from 'express';
import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';
import {
  getCSCCollectionPath,
  getICleanSites,
  queryFirestore,
  deleteFromFirestore,
  updateInFirestore,
} from '../services/firebase.js';

const ACS_COMPANY_ID = 'AnmdYRpshMosqbsZ6l15';

const router = Router();

/**
 * GET /api/sci-viewer/sites
 * Get all iClean-enabled sites for the site selector
 */
router.get('/sites', async (req: Request, res: Response) => {
  try {
    const project = (req.query.project || 'iclean') as string;
    const companyId = ACS_COMPANY_ID;
    const limit = Number.parseInt(req.query.limit as string, 10) || 500;

    const sites = await getICleanSites(project, companyId, limit);

    // Sort alphabetically by name
    sites.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    res.json({
      success: true,
      data: sites.map(site => ({
        id: site.id,
        name: site.name,
        address: site.address,
        groupId: site.groupId,
        divisionId: site.divisionId,
      }))
    });
  } catch (error: any) {
    console.error('[GET /sci-viewer/sites] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch sites'
    });
  }
});

/**
 * GET /api/sci-viewer/scis
 * Get SCIs, optionally filtered by siteId
 */
router.get('/scis', async (req: Request, res: Response) => {
  try {
    const project = (req.query.project || 'iclean') as string;
    const siteId = req.query.siteId as string | undefined;
    const companyId = ACS_COMPANY_ID;
    const limit = Number.parseInt(req.query.limit as string, 10) || 100;

    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

    // Build filters
    const filters: Array<{ field: string; operator: any; value: any }> = [];
    if (siteId) {
      filters.push({ field: 'siteId', operator: '==', value: siteId });
    }

    const items = await queryFirestore(project, collectionPath, filters, limit);

    // Transform to a cleaner format for the viewer
    const scis = items.map((item: any) => ({
      id: item.id,
      siteId: item.siteId,
      siteName: item.siteName,
      parentDocumentId: item.parentDocumentId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      sourceFile: item.sourceFile,
      section: {
        title: item.section?.title,
        description: item.section?.description,
        sectionId: item.section?.sectionId,
        pageRange: item.section?.pageRange,
        stepGroups: item.section?.stepGroups || [],
        chemicals: item.section?.chemicals || [],
        frequency: item.section?.frequency,
        responsibility: item.section?.responsibility,
        keyInspectionPoints: item.section?.keyInspectionPoints || [],
        colourCodes: item.section?.colourCodes || [],
        applicationEquipment: item.section?.applicationEquipment || [],
        images: (item.section?.images || []).map((img: any) => ({
          caption: img.caption,
          pageNumber: img.pageNumber,
          url: img.url,
          storagePath: img.storagePath,
        })),
        documentMetadata: item.section?.documentMetadata,
      }
    }));

    // Sort by title
    scis.sort((a: any, b: any) =>
      (a.section?.title || '').localeCompare(b.section?.title || '')
    );

    res.json({
      success: true,
      data: scis,
      meta: {
        total: scis.length,
        siteId: siteId || null,
        companyId,
      }
    });
  } catch (error: any) {
    console.error('[GET /sci-viewer/scis] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch SCIs'
    });
  }
});

/**
 * GET /api/sci-viewer/scis/:id
 * Get a single SCI by ID
 */
router.get('/scis/:id', async (req: Request, res: Response) => {
  try {
    const project = (req.query.project || 'iclean') as string;
    const { id } = req.params;
    const companyId = ACS_COMPANY_ID;

    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

    // Query by document ID
    const items = await queryFirestore(project, collectionPath, [], 500);
    const item = items.find((i: any) => i.id === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'SCI not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: item.id,
        siteId: item.siteId,
        siteName: item.siteName,
        parentDocumentId: item.parentDocumentId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        sourceFile: item.sourceFile,
        section: item.section,
      }
    });
  } catch (error: any) {
    console.error('[GET /sci-viewer/scis/:id] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch SCI'
    });
  }
});

/**
 * GET /api/sci-viewer/stats
 * Get statistics about SCIs per site
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const project = (req.query.project || 'iclean') as string;
    const companyId = ACS_COMPANY_ID;

    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');
    const items = await queryFirestore(project, collectionPath, [], 1000);

    // Group by site
    const bySite: Record<string, { count: number; siteName: string; withImages: number }> = {};

    for (const item of items) {
      const siteId = item.siteId || 'unknown';
      if (!bySite[siteId]) {
        bySite[siteId] = { count: 0, siteName: item.siteName || 'Unknown', withImages: 0 };
      }
      bySite[siteId].count++;

      const images = item.section?.images || [];
      const hasValidImages = images.some((img: any) => img.url && img.url.length > 0);
      if (hasValidImages) {
        bySite[siteId].withImages++;
      }
    }

    res.json({
      success: true,
      data: {
        totalSCIs: items.length,
        totalSites: Object.keys(bySite).length,
        bySite: Object.entries(bySite).map(([siteId, stats]) => ({
          siteId,
          ...stats
        })).sort((a, b) => b.count - a.count)
      }
    });
  } catch (error: any) {
    console.error('[GET /sci-viewer/stats] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch stats'
    });
  }
});

/**
 * DELETE /api/sci-viewer/scis/batch
 * Delete multiple SCIs by IDs
 */
router.delete('/scis/batch', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const project = (req.query.project || 'iclean') as string;
    const companyId = ACS_COMPANY_ID;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'No SCI IDs provided' });
    }

    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

    let deleted = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await deleteFromFirestore(project, collectionPath, id);
        deleted++;
      } catch (err) {
        console.error(`Failed to delete SCI ${id}:`, err);
        failed++;
      }
    }

    res.json({
      success: true,
      data: {
        deleted,
        failed,
        total: ids.length
      }
    });
  } catch (error: any) {
    console.error('[DELETE /sci-viewer/scis/batch] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to delete SCIs'
    });
  }
});

/**
 * GET /api/sci-viewer/backup
 * Export all SCIs as JSON backup
 */
router.get('/backup', async (req: Request, res: Response) => {
  try {
    const project = (req.query.project || 'iclean') as string;
    const siteId = req.query.siteId as string | undefined;
    const companyId = ACS_COMPANY_ID;

    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

    const filters: Array<{ field: string; operator: any; value: any }> = [];
    if (siteId) {
      filters.push({ field: 'siteId', operator: '==', value: siteId });
    }

    const items = await queryFirestore(project, collectionPath, filters, 1000);

    const backup = {
      exportedAt: new Date().toISOString(),
      project,
      companyId,
      siteId: siteId || 'all',
      count: items.length,
      data: items
    };

    const siteName = items[0]?.siteName || 'all-sites';
    const filename = `SCI_Backup_${siteName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(backup);

    console.log(`[GET /sci-viewer/backup] Exported ${items.length} SCIs`);
  } catch (error: any) {
    console.error('[GET /sci-viewer/backup] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to create backup'
    });
  }
});

/**
 * POST /api/sci-viewer/restore
 * Restore SCIs from JSON backup
 */
router.post('/restore', async (req: Request, res: Response) => {
  try {
    const { data, overwrite } = req.body;
    const project = (req.query.project || 'iclean') as string;
    const companyId = ACS_COMPANY_ID;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ success: false, error: 'No backup data provided' });
    }

    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

    let restored = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const item of data) {
      try {
        const docId = item.id;
        const docData = { ...item };
        delete docData.id; // Remove id from data, it's the document key

        // Add restore metadata
        docData.restoredAt = new Date().toISOString();

        await updateInFirestore(project, collectionPath, docId, docData, overwrite !== false);
        restored++;
      } catch (err: any) {
        console.error(`Failed to restore SCI ${item.id}:`, err);
        failed++;
        errors.push(`${item.id}: ${err?.message || 'Unknown error'}`);
      }
    }

    console.log(`[POST /sci-viewer/restore] Restored ${restored}/${data.length} SCIs`);

    res.json({
      success: true,
      data: {
        restored,
        failed,
        total: data.length,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error: any) {
    console.error('[POST /sci-viewer/restore] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to restore backup'
    });
  }
});

/**
 * PATCH /api/sci-viewer/scis/:id
 * Update a single SCI
 */
router.patch('/scis/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const project = (req.query.project || 'iclean') as string;
    const companyId = ACS_COMPANY_ID;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No updates provided' });
    }

    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

    // Add updatedAt timestamp
    const dataToUpdate = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await updateInFirestore(project, collectionPath, id, dataToUpdate);

    console.log(`[PATCH /sci-viewer/scis/:id] Updated SCI ${id}:`, Object.keys(updates));

    res.json({
      success: true,
      data: { id, updated: Object.keys(updates) }
    });
  } catch (error: any) {
    console.error('[PATCH /sci-viewer/scis/:id] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to update SCI'
    });
  }
});

/**
 * PATCH /api/sci-viewer/scis/batch
 * Bulk update multiple SCIs with the same changes
 */
router.patch('/scis/batch', async (req: Request, res: Response) => {
  try {
    const { ids, updates } = req.body;
    const project = (req.query.project || 'iclean') as string;
    const companyId = ACS_COMPANY_ID;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'No SCI IDs provided' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No updates provided' });
    }

    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

    // Add updatedAt timestamp
    const dataToUpdate = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const id of ids) {
      try {
        await updateInFirestore(project, collectionPath, id, dataToUpdate);
        updated++;
      } catch (err: any) {
        console.error(`Failed to update SCI ${id}:`, err);
        failed++;
        errors.push(`${id}: ${err?.message || 'Unknown error'}`);
      }
    }

    console.log(`[PATCH /sci-viewer/scis/batch] Bulk updated ${updated}/${ids.length} SCIs`);

    res.json({
      success: true,
      data: {
        updated,
        failed,
        total: ids.length,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error: any) {
    console.error('[PATCH /sci-viewer/scis/batch] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to bulk update SCIs'
    });
  }
});

/**
 * POST /api/sci-viewer/export/excel
 * Export selected SCIs to Excel spreadsheet
 */
router.post('/export/excel', async (req: Request, res: Response) => {
  try {
    const { ids, siteId } = req.body;
    const project = (req.query.project || 'iclean') as string;
    const companyId = ACS_COMPANY_ID;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'No SCI IDs provided' });
    }

    // Fetch all SCIs
    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');
    const allItems = await queryFirestore(project, collectionPath, [], 1000);
    const items = allItems.filter((item: any) => ids.includes(item.id));

    if (items.length === 0) {
      return res.status(404).json({ success: false, error: 'No SCIs found' });
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ACS Content Engine';
    workbook.created = new Date();

    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Document ID', key: 'docId', width: 15 },
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Site', key: 'site', width: 25 },
      { header: 'Frequency', key: 'frequency', width: 15 },
      { header: 'Responsibility', key: 'responsibility', width: 25 },
      { header: 'Steps', key: 'steps', width: 10 },
      { header: 'Chemicals', key: 'chemicals', width: 10 },
    ];

    // Style header
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF27648B' }
    };
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add summary data
    for (const item of items) {
      const section = item.section || {};
      const totalSteps = (section.stepGroups || []).reduce(
        (sum: number, g: any) => sum + (g.steps?.length || 0), 0
      );
      summarySheet.addRow({
        docId: section.documentMetadata?.documentId || section.sectionId || '-',
        title: section.title || 'Untitled',
        site: item.siteName || '-',
        frequency: section.frequency || '-',
        responsibility: section.responsibility || '-',
        steps: totalSteps,
        chemicals: (section.chemicals || []).length,
      });
    }

    // Details sheet with all instructions
    const detailsSheet = workbook.addWorksheet('Cleaning Instructions');
    detailsSheet.columns = [
      { header: 'Document ID', key: 'docId', width: 12 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Group', key: 'group', width: 20 },
      { header: 'Step #', key: 'stepNum', width: 8 },
      { header: 'Instruction', key: 'instruction', width: 60 },
      { header: 'Notes', key: 'notes', width: 40 },
    ];

    detailsSheet.getRow(1).font = { bold: true };
    detailsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF27648B' }
    };
    detailsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    for (const item of items) {
      const section = item.section || {};
      const docId = section.documentMetadata?.documentId || section.sectionId || '-';

      for (const group of (section.stepGroups || [])) {
        for (const step of (group.steps || [])) {
          detailsSheet.addRow({
            docId,
            title: section.title || 'Untitled',
            group: group.title || '-',
            stepNum: step.order || step.stepNumber || '-',
            instruction: step.action || step.instruction || '-',
            notes: Array.isArray(step.notes) ? step.notes.join('; ') : (step.notes || ''),
          });
        }
      }
    }

    // Chemicals sheet
    const chemicalsSheet = workbook.addWorksheet('Chemicals');
    chemicalsSheet.columns = [
      { header: 'Document ID', key: 'docId', width: 12 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Chemical', key: 'chemical', width: 30 },
      { header: 'Use Ratio', key: 'ratio', width: 15 },
    ];

    chemicalsSheet.getRow(1).font = { bold: true };
    chemicalsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFCD34D' }
    };

    for (const item of items) {
      const section = item.section || {};
      const docId = section.documentMetadata?.documentId || section.sectionId || '-';

      for (const chem of (section.chemicals || [])) {
        chemicalsSheet.addRow({
          docId,
          title: section.title || 'Untitled',
          chemical: chem.name || '-',
          ratio: chem.useRatio || chem.hotRatio || '-',
        });
      }
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send file
    const siteName = items[0]?.siteName || 'SCIs';
    const filename = `${siteName.replace(/[^a-zA-Z0-9]/g, '_')}_SCIs_${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error: any) {
    console.error('[POST /sci-viewer/export/excel] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to export Excel'
    });
  }
});

/**
 * POST /api/sci-viewer/export/pdf
 * Export selected SCIs to PDF
 */
router.post('/export/pdf', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const project = (req.query.project || 'iclean') as string;
    const companyId = ACS_COMPANY_ID;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'No SCI IDs provided' });
    }

    // Fetch all SCIs
    const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');
    const allItems = await queryFirestore(project, collectionPath, [], 1000);
    const items = allItems.filter((item: any) => ids.includes(item.id));

    if (items.length === 0) {
      return res.status(404).json({ success: false, error: 'No SCIs found' });
    }

    // Generate HTML for all SCIs
    const html = generatePDFHTML(items);

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      printBackground: true,
    });

    await browser.close();

    // Send PDF - convert Uint8Array to Buffer for proper binary response
    const siteName = items[0]?.siteName || 'SCIs';
    const filename = `${siteName.replace(/[^a-zA-Z0-9]/g, '_')}_SCIs_${new Date().toISOString().slice(0, 10)}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(Buffer.from(pdfBuffer));

  } catch (error: any) {
    console.error('[POST /sci-viewer/export/pdf] Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to export PDF'
    });
  }
});

/**
 * Generate HTML for PDF export (Classic ACS format)
 */
function generatePDFHTML(items: any[]): string {
  const colorHexMap: Record<string, string> = {
    'yellow': '#FCD34D', 'green': '#4ADE80', 'blue': '#60A5FA',
    'red': '#F87171', 'orange': '#FB923C', 'purple': '#C084FC',
    'white': '#F1F5F9', 'black': '#334155', 'pink': '#F472B6',
  };

  const scisHTML = items.map((item, index) => {
    const section = item.section || {};
    const images = section.images || [];
    const chemicals = section.chemicals || [];
    const stepGroups = section.stepGroups || [];
    const colourCodes = section.colourCodes || [];
    const keyInspectionPoints = section.keyInspectionPoints || [];
    const applicationEquipment = section.applicationEquipment || [];

    return `
      <div class="sci-page ${index > 0 ? 'page-break' : ''}">
        <!-- Header -->
        <div class="header-row">
          <div class="logo-cell">
            <div style="font-size: 18px; font-weight: bold; color: #27648B;">ADVANCED</div>
            <div style="font-size: 8px; color: #666;">CLEANING SERVICES</div>
            <div style="font-size: 7px; color: #999; font-style: italic; margin-top: 4px;">safeguarding brands for over 25 years</div>
          </div>
          <div class="title-cell">
            <div style="font-size: 16px; font-weight: bold;">Standard Cleaning Procedures</div>
            <div style="font-size: 14px; font-weight: bold; color: #27648B;">${item.siteName?.toUpperCase() || 'SITE'}</div>
          </div>
        </div>

        <!-- Document Info -->
        <div class="info-row">
          <div class="info-left">
            <div class="section-title">${section.title || 'Untitled'}</div>
            <div class="info-field"><strong>AREA:</strong> ${section.description || section.area?.join(', ') || 'Production Areas'}</div>
          </div>
          <div class="info-right">
            <div class="meta-row"><span class="meta-label">Effective Date:</span><span>${section.documentMetadata?.effectiveDate || '01 December 2024'}</span></div>
            <div class="meta-row"><span class="meta-label">Document No.</span><span class="meta-value">${section.documentMetadata?.documentId || section.sectionId || '-'}</span></div>
            <div class="meta-row"><span class="meta-label">Amendment No.</span><span>${section.documentMetadata?.revision || '00'}</span></div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Left Column -->
          <div class="left-column">
            ${chemicals.length > 0 ? `
              <table class="chemicals-table">
                <tr class="table-header"><th>CHEMICAL</th><th style="text-align: right;">USE RATIO</th></tr>
                ${chemicals.map((c: any) => `<tr><td>${c.name || '-'}</td><td style="text-align: right;">${c.useRatio || c.hotRatio || '-'}</td></tr>`).join('')}
              </table>
            ` : ''}

            <div class="info-field"><strong>Frequency:</strong> ${section.frequency || 'Monthly'} <span style="color: #666;">(Or Refer to MCS)</span></div>
            <div class="info-field"><strong>Cleaning Record:</strong> ${section.cleaningRecord || 'Barlog System'}</div>
            <div class="info-field"><strong>Maintenance Assistance:</strong> ${section.maintenanceAssistance || 'None'}</div>
            <div class="info-field"><strong>Responsibility:</strong> ${section.responsibility || 'ACS Hygiene Operator'}</div>
            <div class="info-field"><strong>Inspected By:</strong> ${section.inspectedBy || 'ACS Hygiene Operator, ACS Supervisor, Client Representative'}</div>

            <div class="section-header">KEY INSPECTION POINTS:</div>
            <div class="inspection-content">
              ${images.slice(0, 2).map((img: any) => img.url ? `<img src="${img.url}" class="inspection-image" />` : '').join('')}
              ${keyInspectionPoints.length > 0 ? `<ul class="inspection-list">${keyInspectionPoints.map((p: string) => `<li>${p}</li>`).join('')}</ul>` : ''}
            </div>
          </div>

          <!-- Right Column -->
          <div class="right-column">
            <div class="info-field"><strong>EQUIPMENT TO BE CLEANED:</strong><br/>${section.title || '-'}</div>

            <div class="info-field">
              <strong>PPE REQUIREMENTS & SAFETY PRECAUTIONS:</strong>
              <div class="ppe-icons">
                <span class="ppe-icon">🥾</span>
                <span class="ppe-icon">🥼</span>
                <span class="ppe-icon">🥽</span>
                <span class="ppe-icon">🧤</span>
                <span class="ppe-icon">👒</span>
                <span class="ppe-icon">😷</span>
              </div>
              <div style="font-size: 8px; color: #666;">Ensure correct and complete PPE is worn before any cleaning operation.</div>
            </div>

            ${colourCodes.length > 0 ? `
              <div class="info-field">
                <strong>COLOUR CODE:</strong>
                <div class="colour-codes">
                  ${colourCodes.map((cc: any) => `<span><strong style="color: ${colorHexMap[cc.colour?.toLowerCase()] || '#333'}">${cc.colour}</strong> – ${cc.meaning}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            <div class="info-field"><strong>APPLICATION EQUIPMENT/CLEANING MATERIALS NEEDED:</strong><br/>${applicationEquipment.join(', ') || 'Bucket, Hand Brush, Spray Bottle, Cloth, Step Ladder'}</div>

            <div class="section-header">CLEANING INSTRUCTIONS</div>
            ${stepGroups.map((group: any) => `
              <div class="step-group">
                <div class="group-title">${group.title} ${group.frequency ? `(${group.frequency})` : ''}</div>
                <table class="steps-table">
                  ${(group.steps || []).map((step: any, si: number) => `
                    <tr>
                      <td class="step-num">${step.order || si + 1}</td>
                      <td class="step-text">${step.action || step.instruction || '-'}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer-row">
          <div><strong>Issued By:</strong> ACS QA Department</div>
          <div><strong>Approved by:</strong> ${item.siteName?.toUpperCase() || 'SITE'}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 10px; line-height: 1.3; }

        .sci-page { page-break-inside: avoid; margin-bottom: 20px; border: 1px solid #000; }
        .page-break { page-break-before: always; }

        .header-row { display: flex; border-bottom: 2px solid #000; }
        .logo-cell { width: 160px; padding: 8px; border-right: 1px solid #000; }
        .title-cell { flex: 1; padding: 12px; text-align: right; }

        .info-row { display: flex; border-bottom: 1px solid #000; }
        .info-left { flex: 1; border-right: 1px solid #000; }
        .info-right { width: 180px; font-size: 9px; }
        .section-title { background: #f1f5f9; padding: 6px 8px; font-weight: bold; text-align: center; border-bottom: 1px solid #000; font-size: 12px; }
        .info-field { padding: 4px 8px; border-bottom: 1px solid #000; }
        .meta-row { display: flex; border-bottom: 1px solid #000; }
        .meta-row:last-child { border-bottom: none; }
        .meta-label { width: 90px; padding: 4px 8px; background: #f8fafc; }
        .meta-value { font-weight: bold; }
        .meta-row span:last-child { flex: 1; padding: 4px 8px; }

        .main-content { display: flex; border-bottom: 1px solid #000; }
        .left-column { width: 45%; border-right: 1px solid #000; }
        .right-column { width: 55%; }

        .section-header { background: #f1f5f9; padding: 4px 8px; font-weight: bold; text-align: center; border-bottom: 1px solid #000; }

        .chemicals-table { width: 100%; border-collapse: collapse; }
        .chemicals-table th, .chemicals-table td { padding: 3px 8px; border-bottom: 1px solid #000; }
        .table-header { background: #f1f5f9; }
        .table-header th { text-align: left; font-weight: bold; }
        .table-header th:last-child { border-left: 1px solid #000; }
        .chemicals-table td:last-child { border-left: 1px solid #000; }

        .inspection-content { padding: 8px; }
        .inspection-image { width: 100%; max-height: 150px; object-fit: cover; border: 1px solid #ccc; margin-bottom: 4px; }
        .inspection-list { margin-left: 12px; font-size: 9px; }
        .inspection-list li { margin-bottom: 2px; }

        .ppe-icons { display: flex; gap: 8px; margin: 8px 0 4px; font-size: 20px; }
        .ppe-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }

        .colour-codes { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px; font-size: 9px; }

        .step-group { border-bottom: 1px solid #000; }
        .step-group:last-child { border-bottom: none; }
        .group-title { background: #f8fafc; padding: 3px 8px; font-weight: bold; font-size: 9px; border-bottom: 1px solid #000; }
        .steps-table { width: 100%; border-collapse: collapse; }
        .steps-table tr { border-bottom: 1px solid #000; }
        .steps-table tr:last-child { border-bottom: none; }
        .step-num { width: 24px; padding: 3px 4px; text-align: center; border-right: 1px solid #000; font-weight: bold; }
        .step-text { padding: 3px 8px; font-size: 9px; }

        .footer-row { display: flex; justify-content: space-between; padding: 4px 8px; font-size: 9px; }
      </style>
    </head>
    <body>
      ${scisHTML}
    </body>
    </html>
  `;
}

export default router;
