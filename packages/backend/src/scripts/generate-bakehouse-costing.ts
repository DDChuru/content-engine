/**
 * Bakehouse In-House Hygiene & Sanitation Costing Model
 *
 * Generates an Excel workbook with detailed labour costing for
 * Bakehouse's in-house sanitation team (38 staff including SM).
 *
 * Shift structure:
 *   Day     (07:00-14:00) — 21 cleaners, 3 off/day, 7 days/week
 *   Afternoon (14:00-22:00) — 5 cleaners, 2 off Mon-Fri (none weekends)
 *   Night   (22:00-06:00) — 12 cleaners, 2 off/day Mon-Sat
 *
 * Usage: npx tsx src/scripts/generate-bakehouse-costing.ts
 * Output: output/bakehouse/bakehouse-inhouse-costing-2025-2026.xlsx
 */

import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Configuration ─────────────────────────────────────────────────────

const CONFIG = {
  // Rates
  currentRPH: 31.69,           // 2025 rate per hour
  projectedIncrease: 0.015,    // 1.5% increase for 2026
  get projectedRPH() { return +(this.currentRPH * (1 + this.projectedIncrease)).toFixed(2); },

  // Staff complement: 38 total (including Sanitation Manager)
  // 1 SM + 3 Supervisors + 21 Day + 5 Afternoon + 12 Night = 42 roles
  // But total is 38 including SM, so cleaners = 21+5+12 = 38 - 1 SM - 3 Supervisors = 34 cleaners
  // Wait — user says 38 including SM, with 21+5+12=38 cleaners listed separately
  // Re-reading: "Staff compliment 38(including SM)" and shifts total 21+5+12=38
  // So SM is one of the 38. Let's assume SM is separate from shift counts.
  // Actually the shifts list cleaners: 21+5+12 = 38 total. SM is included in this 38.
  // The 3 supervisors come from the "allowance increase for Supervisors x3"
  // So: 1 SM + 3 Supervisors + 34 cleaners = 38 total? No, 21+5+12=38.
  // Most likely: SM + 3 Supervisors are part of the 38 headcount across shifts.
  // Let's model it as given: 38 total staff, shifts as described.

  shifts: {
    day: {
      name: 'Day Shift',
      hours: '07:00 - 15:00',
      paidHours: 8,
      totalStaff: 20,            // 21 minus SM (SM costed separately)
      offPerDay: 3,
      daysPerWeek: 7,
      allowancePercent: 0,       // No shift allowance for day
    },
    afternoon: {
      name: 'Afternoon Shift',
      hours: '15:00 - 23:00',
      paidHours: 8,
      totalStaff: 5,
      offPerDay: 1,              // Mon-Fri only (1 off)
      daysPerWeek: 5,            // Mon-Fri
      allowancePercent: 0.05,    // 5% afternoon allowance
    },
    night: {
      name: 'Night Shift',
      hours: '23:00 - 07:00',
      paidHours: 8,
      totalStaff: 12,
      offPerDay: 2,              // Mon-Sat (2 off per day)
      daysPerWeek: 6,            // Mon-Sat
      allowancePercent: 0.10,    // 10% night shift allowance
    },
  },

  sundayAllowancePercent: 0.10,  // Sunday paid as 10% allowance

  // Statutory costs (same bargaining council as Farmwise)
  pensionEmployer: 0.0545,      // 5.45%
  pensionEmployee: 0.0525,      // 5.25%
  uif: 0.01,                    // 1%
  sld: 0.01,                    // 1% Skills Development Levy
  coidaPerEmployee: 97.94,      // Fixed COIDA per employee/month (from Farmwise)

  // Bonus & leave (same formulas as Farmwise)
  bonusDivisor: 12,             // basic / 12 = full 13th cheque monthly provision
  annualLeaveDays: 15,          // 15 days annual leave
  annualLeaveHoursPerDay: 8,

  // Public holidays
  publicHolidaysPerYear: 12,    // SA public holidays
  publicHolidayCleaners: 30,    // 30 cleaners amortised

  // Allowance increases
  adminAllowanceIncrease: { min: 500, max: 1500 },
  supervisorAllowanceIncrease: { min: 1000, max: 1500, count: 3 },

  // Manager (fixed salary, not RPH-based)
  managerSalary: 26000,

  // Operating costs (monthly amortised figures)
  operatingCosts: {
    ppeAndSafetyShoes: 2691,        // PPE & Safety Shoes
    garmentRental: 7100,            // Garment Rental
    chemicals: 32500,               // Chemical Budget
    cleaningMaterialsBrushware: 6700, // Cleaning Materials & Brushware
    equipmentMaintenance: 8200,     // Equipment & Maintenance
  },

  // Current totals (for validation)
  currentGrossSalary: 280000,
  currentNetSalary: 262000,
};

// ── Calculation helpers ───────────────────────────────────────────────

// Bargaining council standard: flat 181 hours per month across all shifts
const MONTHLY_HOURS = 181;

function calcMonthlyHours(_shift: typeof CONFIG.shifts.day): number {
  return MONTHLY_HOURS;
}

function calcBasicSalary(rph: number, monthlyHours: number): number {
  return +(rph * monthlyHours).toFixed(2);
}

interface EmployeeCost {
  role: string;
  shift: string;
  rph: number;
  monthlyHours: number;
  basicSalary: number;
  bonusProvision: number;
  annualLeave: number;
  coida: number;
  pensionEmployer: number;
  pensionEmployee: number;
  uif: number;
  sld: number;
  shiftAllowance: number;
  sundayAllowance: number;
  totalCTC: number;
}

function calcEmployeeCost(
  role: string,
  shiftName: string,
  rph: number,
  monthlyHours: number,
  shiftAllowancePercent: number,
  includesSunday: boolean,
): EmployeeCost {
  const basicSalary = calcBasicSalary(rph, monthlyHours);
  const bonusProvision = +(basicSalary / CONFIG.bonusDivisor).toFixed(2);
  // BCEA: 6-day workers get 18 days leave, 5-day workers get 15
  const leaveDays = shiftName === 'Night Shift' ? 18 : CONFIG.annualLeaveDays;
  const annualLeave = +(rph * CONFIG.annualLeaveHoursPerDay * leaveDays / 12).toFixed(2);
  const coida = CONFIG.coidaPerEmployee;
  const pensionEmployer = +(basicSalary * CONFIG.pensionEmployer).toFixed(2);
  const pensionEmployee = +(basicSalary * CONFIG.pensionEmployee).toFixed(2);
  const uif = +(basicSalary * CONFIG.uif).toFixed(2);
  const sld = +(basicSalary * CONFIG.sld).toFixed(2);
  const shiftAllowance = +(basicSalary * shiftAllowancePercent).toFixed(2);
  const sundayAllowance = includesSunday ? +(basicSalary * CONFIG.sundayAllowancePercent).toFixed(2) : 0;

  const totalCTC = +(
    basicSalary + bonusProvision + annualLeave + coida +
    pensionEmployer + pensionEmployee + uif + sld +
    shiftAllowance + sundayAllowance
  ).toFixed(2);

  return {
    role, shift: shiftName, rph, monthlyHours, basicSalary,
    bonusProvision, annualLeave, coida,
    pensionEmployer, pensionEmployee, uif, sld,
    shiftAllowance, sundayAllowance, totalCTC,
  };
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EnviroWize';
  wb.created = new Date();

  // ── Colour palette ──
  const navy = '0A1628';
  const darkNavy = '060F1C';
  const green = '2D8A4E';
  const accent = '34D399';
  const gold = 'FBBF24';
  const white = 'F0F4F8';
  const medNavy = '1E3A5F';

  const headerFill: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: green } };
  const subHeaderFill: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: medNavy } };
  const dataFill: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: navy } };
  const totalFill: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkNavy } };

  const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: white }, size: 11, name: 'Calibri' };
  const dataFont: Partial<ExcelJS.Font> = { color: { argb: white }, size: 10, name: 'Calibri' };
  const accentFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: accent }, size: 10, name: 'Calibri' };
  const goldFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: gold }, size: 11, name: 'Calibri' };
  const titleFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: accent }, size: 14, name: 'Calibri' };

  const currency = '#,##0.00';
  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: medNavy } },
    bottom: { style: 'thin', color: { argb: medNavy } },
    left: { style: 'thin', color: { argb: medNavy } },
    right: { style: 'thin', color: { argb: medNavy } },
  };

  // ════════════════════════════════════════════════════════════════════
  // SHEET 1: 2025 Current Costing
  // ════════════════════════════════════════════════════════════════════

  for (const yearLabel of ['2026 Current', '2027 Projected'] as const) {
    const rph = yearLabel === '2026 Current' ? CONFIG.currentRPH : CONFIG.projectedRPH;
    const ws = wb.addWorksheet(`${yearLabel}`);

    // Column widths
    ws.columns = [
      { width: 22 }, // A: Role
      { width: 14 }, // B: Shift
      { width: 10 }, // C: RPH
      { width: 12 }, // D: Monthly Hrs
      { width: 14 }, // E: Basic Salary
      { width: 13 }, // F: Bonus Provision
      { width: 13 }, // G: Annual Leave
      { width: 10 }, // H: COIDA
      { width: 14 }, // I: Pension (Employer)
      { width: 14 }, // J: Pension (Employee)
      { width: 10 }, // K: UIF
      { width: 10 }, // L: SLD
      { width: 14 }, // M: Shift Allowance
      { width: 14 }, // N: Sunday Allowance
      { width: 16 }, // O: Total CTC
    ];

    // Title
    ws.mergeCells('A1:O1');
    const titleCell = ws.getCell('A1');
    titleCell.value = `BAKEHOUSE IN-HOUSE HYGIENE & SANITATION COSTING — ${yearLabel.toUpperCase()}`;
    titleCell.font = titleFont;
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkNavy } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(1).height = 30;

    // Rate info
    ws.mergeCells('A2:O2');
    const rateCell = ws.getCell('A2');
    rateCell.value = `Rate per Hour: R${rph.toFixed(2)} | Shift: 8hrs | Staff: 38 (incl. SM)`;
    rateCell.font = { ...dataFont, italic: true };
    rateCell.fill = dataFill;
    rateCell.alignment = { horizontal: 'center' };

    // Headers
    const headers = [
      'Role / Position', 'Shift', 'R/Hr', 'Monthly Hrs',
      'Basic Salary', 'Bonus Prov.', 'Annual Leave', 'COIDA',
      'Pension 5.45%', 'Pension 5.25%', 'UIF 1%', 'SLD 1%',
      'Shift Allow.', 'Sunday Allow.', 'Total CTC p/m',
    ];

    const headerRow = ws.getRow(4);
    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = h;
      cell.font = headerFont;
      cell.fill = headerFill;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = thinBorder;
    });
    headerRow.height = 28;

    // Build employee lines
    let row = 5;

    const addShiftBlock = (shiftKey: 'day' | 'afternoon' | 'night') => {
      const shift = CONFIG.shifts[shiftKey];
      const monthlyHours = calcMonthlyHours(shift);
      const includesSunday = shift.daysPerWeek === 7; // Day shift works 7 days

      // Shift sub-header
      const subRow = ws.getRow(row);
      ws.mergeCells(`A${row}:O${row}`);
      const subCell = subRow.getCell(1);
      subCell.value = `${shift.name} (${shift.hours}) — ${shift.totalStaff} staff, ${shift.offPerDay} off/day, ${shift.daysPerWeek} days/week`;
      subCell.font = goldFont;
      subCell.fill = subHeaderFill;
      subCell.alignment = { horizontal: 'left', vertical: 'middle' };
      subRow.height = 22;
      row++;

      const startRow = row;

      for (let i = 0; i < shift.totalStaff; i++) {
        const roleName = `Cleaner ${i + 1}`;

        const emp = calcEmployeeCost(
          roleName, shift.name, rph, monthlyHours,
          shift.allowancePercent, includesSunday,
        );

        const r = ws.getRow(row);
        const vals = [
          emp.role, emp.shift, emp.rph, emp.monthlyHours,
          emp.basicSalary, emp.bonusProvision, emp.annualLeave, emp.coida,
          emp.pensionEmployer, emp.pensionEmployee, emp.uif, emp.sld,
          emp.shiftAllowance, emp.sundayAllowance, emp.totalCTC,
        ];
        vals.forEach((v, ci) => {
          const cell = r.getCell(ci + 1);
          cell.value = v;
          cell.font = ci === 0 ? accentFont : dataFont;
          cell.fill = dataFill;
          cell.border = thinBorder;
          if (ci >= 2) {
            cell.numFmt = ci === 2 ? '#,##0.00' : currency;
            cell.alignment = { horizontal: 'right' };
          }
        });
        row++;
      }

      // Subtotal row
      const subTotalRow = ws.getRow(row);
      const endRow = row - 1;
      subTotalRow.getCell(1).value = `${shift.name} Subtotal`;
      subTotalRow.getCell(1).font = goldFont;

      for (let ci = 5; ci <= 15; ci++) {
        const col = String.fromCharCode(64 + ci); // E=5, F=6, ...
        const cell = subTotalRow.getCell(ci);
        cell.value = { formula: `SUM(${col}${startRow}:${col}${endRow})` };
        cell.numFmt = currency;
        cell.font = goldFont;
      }

      // Count
      subTotalRow.getCell(4).value = shift.totalStaff;
      subTotalRow.getCell(4).font = goldFont;
      subTotalRow.getCell(4).alignment = { horizontal: 'center' };

      for (let ci = 1; ci <= 15; ci++) {
        subTotalRow.getCell(ci).fill = totalFill;
        subTotalRow.getCell(ci).border = thinBorder;
      }

      row++;
      row++; // blank row
      return { startRow, endRow, subtotalRow: row - 2 };
    };

    const dayBlock = addShiftBlock('day');
    const aftBlock = addShiftBlock('afternoon');
    const nightBlock = addShiftBlock('night');

    // ── Grand Total Labour ──
    const grandRow = ws.getRow(row);
    ws.mergeCells(`A${row}:D${row}`);
    grandRow.getCell(1).value = 'TOTAL MONTHLY LABOUR COST';
    grandRow.getCell(1).font = { bold: true, color: { argb: accent }, size: 12, name: 'Calibri' };

    for (let ci = 5; ci <= 15; ci++) {
      const col = String.fromCharCode(64 + ci);
      const cell = grandRow.getCell(ci);
      cell.value = { formula: `${col}${dayBlock.subtotalRow}+${col}${aftBlock.subtotalRow}+${col}${nightBlock.subtotalRow}` };
      cell.numFmt = currency;
      cell.font = { bold: true, color: { argb: accent }, size: 12, name: 'Calibri' };
    }

    for (let ci = 1; ci <= 15; ci++) {
      grandRow.getCell(ci).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0D2A1A' } };
      grandRow.getCell(ci).border = thinBorder;
    }
    grandRow.height = 26;
    const grandTotalRow = row;
    row += 2;

    // ── Public Holidays (amortised) ──
    ws.mergeCells(`A${row}:O${row}`);
    const phTitle = ws.getCell(`A${row}`);
    phTitle.value = 'PUBLIC HOLIDAYS — Additional x1 Premium, Amortised (30 staff per day)';
    phTitle.font = goldFont;
    phTitle.fill = subHeaderFill;
    row++;

    const phRow = ws.getRow(row);
    const dailyPHCost = rph * 1 * 8 * CONFIG.publicHolidayCleaners; // 30 cleaners × 8hrs × RPH × 1 (premium only — basic already covers normal day)
    const annualPHCost = dailyPHCost * CONFIG.publicHolidaysPerYear;
    const monthlyPHCost = +(annualPHCost / 12).toFixed(2);

    phRow.getCell(1).value = 'Public Holiday Provision';
    phRow.getCell(1).font = accentFont;
    phRow.getCell(2).value = `${CONFIG.publicHolidaysPerYear} days/yr`;
    phRow.getCell(2).font = dataFont;
    phRow.getCell(3).value = rph;
    phRow.getCell(3).numFmt = '#,##0.00';
    phRow.getCell(3).font = dataFont;
    phRow.getCell(4).value = `${CONFIG.publicHolidayCleaners} staff`;
    phRow.getCell(4).font = dataFont;

    phRow.getCell(5).value = dailyPHCost;
    phRow.getCell(5).numFmt = currency;
    phRow.getCell(5).font = dataFont;
    ws.getCell(`E${row}`).note = 'Cost per public holiday (30 cleaners × 8hrs × RPH × 1 premium)';

    phRow.getCell(7).value = annualPHCost;
    phRow.getCell(7).numFmt = currency;
    phRow.getCell(7).font = dataFont;
    ws.getCell(`G${row}`).note = 'Annual public holiday cost';

    phRow.getCell(15).value = monthlyPHCost;
    phRow.getCell(15).numFmt = currency;
    phRow.getCell(15).font = goldFont;
    ws.getCell(`O${row}`).note = 'Monthly amortised public holiday cost (cleaners)';

    for (let ci = 1; ci <= 15; ci++) {
      phRow.getCell(ci).fill = dataFill;
      phRow.getCell(ci).border = thinBorder;
    }
    const phCostRow = row;
    row += 2;

    // ── Manager Salary & Provisions ──
    ws.mergeCells(`A${row}:O${row}`);
    ws.getCell(`A${row}`).value = 'SANITATION MANAGER (Fixed Salary + Provisions)';
    ws.getCell(`A${row}`).font = goldFont;
    ws.getCell(`A${row}`).fill = subHeaderFill;
    row++;

    const mgrSalary = CONFIG.managerSalary;
    const mgrBonus = +(mgrSalary / 12).toFixed(2);                              // 13th cheque
    const mgrLeave = +(mgrSalary / 21.67 * CONFIG.annualLeaveDays / 12).toFixed(2); // 15 days / 12
    const mgrPensionEr = +(mgrSalary * CONFIG.pensionEmployer).toFixed(2);
    const mgrPensionEe = +(mgrSalary * CONFIG.pensionEmployee).toFixed(2);
    const mgrUif = +(mgrSalary * CONFIG.uif).toFixed(2);
    const mgrSdl = +(mgrSalary * CONFIG.sld).toFixed(2);
    const mgrCoida = CONFIG.coidaPerEmployee;
    const mgrTotalCTC = +(mgrSalary + mgrBonus + mgrLeave + mgrPensionEr + mgrPensionEe + mgrUif + mgrSdl + mgrCoida).toFixed(2);

    const mgrLines = [
      { label: 'Basic Salary', value: mgrSalary },
      { label: 'Bonus Provision (basic ÷ 12)', value: mgrBonus },
      { label: 'Annual Leave Provision', value: mgrLeave },
      { label: 'Pension — Employer 5.45%', value: mgrPensionEr },
      { label: 'Pension — Employee 5.25%', value: mgrPensionEe },
      { label: 'UIF 1%', value: mgrUif },
      { label: 'SDL 1%', value: mgrSdl },
      { label: 'COIDA', value: mgrCoida },
    ];

    const mgrStartRow = row;
    mgrLines.forEach(line => {
      const r = ws.getRow(row);
      r.getCell(1).value = `  ${line.label}`;
      r.getCell(1).font = accentFont;
      r.getCell(15).value = line.value;
      r.getCell(15).numFmt = currency;
      r.getCell(15).font = dataFont;
      for (let ci = 1; ci <= 15; ci++) {
        r.getCell(ci).fill = dataFill;
        r.getCell(ci).border = thinBorder;
      }
      row++;
    });

    // Manager total
    const mgrTotalRowObj = ws.getRow(row);
    mgrTotalRowObj.getCell(1).value = 'Sanitation Manager Total CTC';
    mgrTotalRowObj.getCell(1).font = goldFont;
    mgrTotalRowObj.getCell(15).value = mgrTotalCTC;
    mgrTotalRowObj.getCell(15).numFmt = currency;
    mgrTotalRowObj.getCell(15).font = goldFont;
    for (let ci = 1; ci <= 15; ci++) {
      mgrTotalRowObj.getCell(ci).fill = totalFill;
      mgrTotalRowObj.getCell(ci).border = thinBorder;
    }
    const mgrCostRow = row;
    row += 2;

    // ── Operating Costs ──
    ws.mergeCells(`A${row}:O${row}`);
    ws.getCell(`A${row}`).value = 'OPERATING COSTS (Monthly Amortised)';
    ws.getCell(`A${row}`).font = goldFont;
    ws.getCell(`A${row}`).fill = subHeaderFill;
    row++;

    const opCostItems = [
      { label: 'PPE & Safety Shoes', value: CONFIG.operatingCosts.ppeAndSafetyShoes },
      { label: 'Garment Rental', value: CONFIG.operatingCosts.garmentRental },
      { label: 'Chemicals', value: CONFIG.operatingCosts.chemicals },
      { label: 'Cleaning Materials & Brushware', value: CONFIG.operatingCosts.cleaningMaterialsBrushware },
      { label: 'Equipment & Maintenance', value: CONFIG.operatingCosts.equipmentMaintenance },
    ];

    const opCostStartRow = row;
    opCostItems.forEach(item => {
      const r = ws.getRow(row);
      r.getCell(1).value = item.label;
      r.getCell(1).font = accentFont;
      r.getCell(15).value = item.value;
      r.getCell(15).numFmt = currency;
      r.getCell(15).font = dataFont;
      for (let ci = 1; ci <= 15; ci++) {
        r.getCell(ci).fill = dataFill;
        r.getCell(ci).border = thinBorder;
      }
      row++;
    });

    // Operating costs subtotal
    const opSubRow = ws.getRow(row);
    opSubRow.getCell(1).value = 'Operating Costs Subtotal';
    opSubRow.getCell(1).font = goldFont;
    opSubRow.getCell(15).value = { formula: `SUM(O${opCostStartRow}:O${row - 1})` };
    opSubRow.getCell(15).numFmt = currency;
    opSubRow.getCell(15).font = goldFont;
    for (let ci = 1; ci <= 15; ci++) {
      opSubRow.getCell(ci).fill = totalFill;
      opSubRow.getCell(ci).border = thinBorder;
    }
    const opCostTotalRow = row;
    row += 2;

    // ── Supervisor Allowance Increases ──
    ws.mergeCells(`A${row}:O${row}`);
    ws.getCell(`A${row}`).value = 'ALLOWANCE INCREASES (2026 Projected)';
    ws.getCell(`A${row}`).font = goldFont;
    ws.getCell(`A${row}`).fill = subHeaderFill;
    row++;

    const allowItems = [
      { label: 'Admin Allowance Increase', range: `R${CONFIG.adminAllowanceIncrease.min} - R${CONFIG.adminAllowanceIncrease.max}`, midpoint: (CONFIG.adminAllowanceIncrease.min + CONFIG.adminAllowanceIncrease.max) / 2 },
      { label: `Supervisor Allowance Increase (×${CONFIG.supervisorAllowanceIncrease.count})`, range: `R${CONFIG.supervisorAllowanceIncrease.min} - R${CONFIG.supervisorAllowanceIncrease.max} each`, midpoint: ((CONFIG.supervisorAllowanceIncrease.min + CONFIG.supervisorAllowanceIncrease.max) / 2) * CONFIG.supervisorAllowanceIncrease.count },
    ];

    allowItems.forEach(item => {
      const r = ws.getRow(row);
      r.getCell(1).value = item.label;
      r.getCell(1).font = accentFont;
      r.getCell(5).value = item.range;
      r.getCell(5).font = dataFont;
      r.getCell(15).value = item.midpoint;
      r.getCell(15).numFmt = currency;
      r.getCell(15).font = dataFont;
      for (let ci = 1; ci <= 15; ci++) {
        r.getCell(ci).fill = dataFill;
        r.getCell(ci).border = thinBorder;
      }
      row++;
    });

    row += 1;

    // ── Grand Total Summary ──
    ws.mergeCells(`A${row}:O${row}`);
    ws.getCell(`A${row}`).value = 'MONTHLY COST SUMMARY';
    ws.getCell(`A${row}`).font = { ...titleFont, size: 12 };
    ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0D2A1A' } };
    ws.getRow(row).height = 26;
    row++;

    const summaryItems = [
      { label: 'Total Labour (all shifts)', formula: `O${grandTotalRow}` },
      { label: 'Sanitation Manager', formula: `O${mgrCostRow}` },
      { label: 'Public Holidays (amortised)', formula: `O${phCostRow}` },
      { label: 'Operating Costs', formula: `O${opCostTotalRow}` },
    ];

    const summaryStartRow = row;
    summaryItems.forEach(item => {
      const r = ws.getRow(row);
      r.getCell(1).value = item.label;
      r.getCell(1).font = accentFont;
      r.getCell(15).value = { formula: item.formula };
      r.getCell(15).numFmt = currency;
      r.getCell(15).font = accentFont;
      for (let ci = 1; ci <= 15; ci++) {
        r.getCell(ci).fill = dataFill;
        r.getCell(ci).border = thinBorder;
      }
      row++;
    });

    // GRAND TOTAL
    const gtRow = ws.getRow(row);
    ws.mergeCells(`A${row}:N${row}`);
    gtRow.getCell(1).value = 'TOTAL MONTHLY COST TO BAKEHOUSE';
    gtRow.getCell(1).font = { bold: true, color: { argb: accent }, size: 14, name: 'Calibri' };
    gtRow.getCell(15).value = { formula: `SUM(O${summaryStartRow}:O${row - 1})` };
    gtRow.getCell(15).numFmt = currency;
    gtRow.getCell(15).font = { bold: true, color: { argb: accent }, size: 14, name: 'Calibri' };
    for (let ci = 1; ci <= 15; ci++) {
      gtRow.getCell(ci).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0D2A1A' } };
      gtRow.getCell(ci).border = {
        top: { style: 'double', color: { argb: accent } },
        bottom: { style: 'double', color: { argb: accent } },
        left: { style: 'thin', color: { argb: medNavy } },
        right: { style: 'thin', color: { argb: medNavy } },
      };
    }
    gtRow.height = 30;

    // Freeze panes: freeze header row
    ws.views = [{ state: 'frozen', ySplit: 4, activeCell: 'A5' }];

    // Print setup
    ws.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
  }

  // ════════════════════════════════════════════════════════════════════
  // SHEET 3: Advantages of In-House Model
  // ════════════════════════════════════════════════════════════════════

  const advWs = wb.addWorksheet('In-House Advantages');
  advWs.columns = [{ width: 5 }, { width: 35 }, { width: 70 }];

  advWs.mergeCells('A1:C1');
  advWs.getCell('A1').value = 'ADVANTAGES OF IN-HOUSE HYGIENE & SANITATION MODEL';
  advWs.getCell('A1').font = { bold: true, color: { argb: accent }, size: 14, name: 'Calibri' };
  advWs.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkNavy } };
  advWs.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  advWs.getRow(1).height = 30;

  const advantages = [
    ['Direct Management Control', 'Bakehouse management has hands-on oversight of hygiene and sanitation operations. No intermediary layer between management decisions and on-the-ground execution.'],
    ['Retained Expertise', 'The Hygiene & Sanitation Manager with 15+ years of specialised experience remains on board, bringing institutional knowledge and continuity to the team.'],
    ['Proximity & Responsiveness', 'In-house team is embedded within Bakehouse operations — faster response to production schedule changes, spills, and ad-hoc cleaning requirements.'],
    ['Cost Transparency', 'Full visibility into every rand spent — no outsourced margins, management fees, or hidden costs. Budget directly funds staff, chemicals, and materials.'],
    ['Cultural Alignment', 'Sanitation team becomes part of Bakehouse culture, aligned with company values, quality standards, and food safety objectives.'],
    ['Specialised Consultancy Support', 'EnviroWize provides ongoing hygiene and sanitation consultancy and training — expert guidance without the outsourced overhead.'],
    ['Digital Management System', 'EnviroWize\'s digital platform (cleaning sign-off, NCR system, audits, training tracking) will be supplied or custom-developed for Bakehouse — same enterprise-grade tools.'],
    ['Staff Loyalty & Retention', 'In-house employees have stronger company loyalty, lower turnover, and better institutional knowledge vs. rotating outsourced staff.'],
    ['Bargaining Council Compliance', 'Staff remain within the same bargaining council framework — no disruption to existing employment terms, benefits, or labour relations.'],
    ['Tailored Training Programs', 'Training is designed specifically for Bakehouse\'s facility, products, and risk profile — not generic modules from an outsourced provider.'],
    ['Accountability & Performance', 'Direct employment means direct accountability — performance management, disciplinary processes, and incentives are under Bakehouse\'s control.'],
    ['No Contract Lock-In', 'No multi-year outsourcing contracts with exit penalties. Full flexibility to adjust staffing levels, shift patterns, and scope as needs evolve.'],
  ];

  // Headers
  const advHdrRow = advWs.getRow(3);
  ['#', 'Advantage', 'Detail'].forEach((h, i) => {
    const cell = advHdrRow.getCell(i + 1);
    cell.value = h;
    cell.font = headerFont;
    cell.fill = headerFill;
    cell.border = thinBorder;
  });

  advantages.forEach((adv, i) => {
    const r = advWs.getRow(4 + i);
    r.getCell(1).value = i + 1;
    r.getCell(1).font = goldFont;
    r.getCell(1).alignment = { horizontal: 'center' };
    r.getCell(2).value = adv[0];
    r.getCell(2).font = accentFont;
    r.getCell(3).value = adv[1];
    r.getCell(3).font = dataFont;
    r.getCell(3).alignment = { wrapText: true };
    for (let ci = 1; ci <= 3; ci++) {
      r.getCell(ci).fill = dataFill;
      r.getCell(ci).border = thinBorder;
    }
    r.height = 40;
  });

  advWs.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

  // ── Write file ──────────────────────────────────────────────────────

  const outDir = path.resolve(__dirname, '../../output/bakehouse');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'bakehouse-inhouse-costing-2025-2026.xlsx');
  await wb.xlsx.writeFile(outPath);

  console.log(`\n✅ Bakehouse costing exported: ${outPath}`);
  console.log(`   3 sheets: 2026 Current, 2027 Projected, In-House Advantages`);
  console.log(`   38 staff (37 cleaners + 1 SM)`);
  console.log(`   RPH 2026: R${CONFIG.currentRPH} → 2027: R${CONFIG.projectedRPH}`);
}

main().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
