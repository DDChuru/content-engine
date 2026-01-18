/**
 * Test what pdf-lib finds in the TOMIS PDF
 */

import { PDFDocument, PDFName, PDFDict, PDFRawStream, PDFArray } from 'pdf-lib';
import * as fs from 'fs';

async function testPdfExtraction() {
  const pdfPath = '/home/dachu/Downloads/tomis.pdf';
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const context = pdfDoc.context;

  console.log(`PDF has ${pdfDoc.getPageCount()} pages`);
  console.log('='.repeat(60));

  // Check page 25 specifically (0-indexed = page 24)
  const pageIndex = 24; // Page 25
  const page = pdfDoc.getPage(pageIndex);

  console.log(`\nAnalyzing page ${pageIndex + 1}:`);

  const resourcesDict = page.node.Resources();
  if (!resourcesDict) {
    console.log('  No Resources dict found!');
    return;
  }

  const xObjectDictMaybe = resourcesDict.lookup(PDFName.of('XObject'));
  const xObjectDict = xObjectDictMaybe instanceof PDFDict ? xObjectDictMaybe : undefined;

  if (!xObjectDict) {
    console.log('  No XObject dict found!');
    return;
  }

  console.log(`  Found ${xObjectDict.entries().length} XObjects`);

  let imageCount = 0;
  let jpegCount = 0;
  let otherCount = 0;

  for (const [key, ref] of xObjectDict.entries()) {
    const xObject = context.lookup(ref);
    if (!(xObject instanceof PDFRawStream)) continue;

    const subtype = xObject.dict.get(PDFName.of('Subtype'));
    if (!(subtype instanceof PDFName) || subtype.toString() !== '/Image') continue;

    imageCount++;

    const width = xObject.dict.get(PDFName.of('Width'));
    const height = xObject.dict.get(PDFName.of('Height'));
    const filter = xObject.dict.get(PDFName.of('Filter'));

    const filters: string[] = [];
    if (filter instanceof PDFName) {
      filters.push(filter.toString());
    } else if (filter instanceof PDFArray) {
      for (let idx = 0; idx < filter.size(); idx++) {
        const item = filter.get(idx);
        if (item instanceof PDFName) {
          filters.push(item.toString());
        }
      }
    }

    const isJpeg = filters.some(f => f === '/DCTDecode');
    const isJpeg2000 = filters.some(f => f === '/JPXDecode');

    if (isJpeg || isJpeg2000) {
      jpegCount++;
      console.log(`  ✅ JPEG Image: ${width}x${height}, filters: ${filters.join(', ')}, data size: ${xObject.contents.length}`);
    } else {
      otherCount++;
      if (otherCount <= 3) {
        console.log(`  ❌ Non-JPEG: ${width}x${height}, filters: ${filters.join(', ') || '(none)'}`);
      }
    }
  }

  console.log(`\n  Summary for page ${pageIndex + 1}:`);
  console.log(`    Total images: ${imageCount}`);
  console.log(`    JPEG/JPEG2000: ${jpegCount}`);
  console.log(`    Other formats: ${otherCount}`);

  // Now test what collectImagesByPage would return
  console.log('\n\n=== Testing full collectImagesByPage logic ===');

  const imagesByPage = new Map<number, Array<{ data: string; mimeType: string }>>();

  for (let pi = 0; pi < pdfDoc.getPageCount(); pi++) {
    const p = pdfDoc.getPage(pi);
    const rd = p.node.Resources();
    const xod = rd?.lookup(PDFName.of('XObject'));
    const xDict = xod instanceof PDFDict ? xod : undefined;
    if (!xDict) continue;

    for (const [, ref] of xDict.entries()) {
      const xObj = context.lookup(ref);
      if (!(xObj instanceof PDFRawStream)) continue;
      const st = xObj.dict.get(PDFName.of('Subtype'));
      if (!(st instanceof PDFName) || st.toString() !== '/Image') continue;

      const flt = xObj.dict.get(PDFName.of('Filter'));
      const flts: string[] = [];
      if (flt instanceof PDFName) {
        flts.push(flt.toString());
      } else if (flt instanceof PDFArray) {
        for (let i = 0; i < flt.size(); i++) {
          const it = flt.get(i);
          if (it instanceof PDFName) flts.push(it.toString());
        }
      }

      let mimeType: string | null = null;
      if (flts.some(f => f === '/DCTDecode')) {
        mimeType = 'image/jpeg';
      } else if (flts.some(f => f === '/JPXDecode')) {
        mimeType = 'image/jp2';
      }

      if (!mimeType) continue;

      const data = Buffer.from(xObj.contents).toString('base64');
      if (!data) continue;

      const list = imagesByPage.get(pi + 1) ?? [];
      list.push({ data, mimeType });
      imagesByPage.set(pi + 1, list);
    }
  }

  console.log(`\nImages extracted by page (showing pages with images):`);
  let totalImages = 0;
  for (const [pageNum, images] of imagesByPage) {
    console.log(`  Page ${pageNum}: ${images.length} JPEG images`);
    totalImages += images.length;
  }
  console.log(`\nTotal JPEG images extracted: ${totalImages}`);

  // Check page 25 specifically
  const page25Images = imagesByPage.get(25) ?? [];
  console.log(`\nPage 25 specifically: ${page25Images.length} images`);
  for (const img of page25Images) {
    console.log(`  - ${img.mimeType}, data length: ${img.data.length}`);
  }
}

testPdfExtraction().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
