/** Topic 5 colour tokens (SHARED-SPECS §5 and §6), fixed as exact hex so every session draws ChromosomeModel,
 * CellCycleWheel, DNAContentGraph, TelomereEndModel and MitosisCellModel identically.
 * Copy this file byte for byte into work/t5-shared/ and import it; never choose a model colour elsewhere.
 * Colour means WHICH chromosome, never parental origin. Terracotta (BRAND.primary) is reserved for the error marker:
 * nothing else in Topic 5 uses it — rings and highlights use T5.ring (the house accent) over a thin ink halo. */
export const T5 = {
  // chromosome hues (C1, C2 long; C3, C4 short) — fill + edge
  c1: '#2F4F9E', c1Edge: '#1B2F63',   // C1 long: deep blue
  c2: '#2F8F8A', c2Edge: '#1B5956',   // C2 long: teal
  c3: '#D9962B', c3Edge: '#8E5E14',   // C3 short: amber
  c4: '#4E9A4A', c4Edge: '#2F602C',   // C4 short: green (not the tick green)
  centromere: '#1E1E1E',              // constriction with a small dark dot
  telomere: '#9A9A9A', telomereEdge: '#5E5E5E', // grey schematic blocks
  gene: '#FFFFFF', geneEdge: '#253247', // white band, thin dark outline, labelled "gene"
  mutationStar: '#000000',            // 5.1.6 only: black star on the mutated gene band (never terracotta)
  histone: '#F4E3A1', histoneEdge: '#A88F3A', // pale yellow beads
  dna: '#253247',                     // dark line (Z1) / two-strand helix strip (Z2)
  nucleolus: '#7C7C7C',               // darker grey disc inside the interphase nucleus
  nucleoplasm: '#EEF0F4', envelope: '#5A6475', // nucleus fill; nuclear envelope double line
  cytoplasm: '#FBF7EE', membrane: '#6F6A60',   // cell fill; cell surface membrane
  cellWall: '#8C7A55',                // plant cell wall (thick outline); cell plate/vesicles use this edge colour
  vesicle: '#E6DDC8',
  spindle: '#7E8FA6', centriole: '#3C5570',    // spindle microtubules; centrosome/centriole pairs
  // cell-cycle wheel arcs (G1 widest)
  g1: '#DDE6F2', s: '#C7D8EE', g2: '#B3C9E7', m: '#F2E1C4', c: '#E8D5E6',
  // squash drawings (§6): REAL toluidine-blue colours, intensity only; identify by structure, not hue
  tbChromatin: '#1F2F7A', tbBackground: '#D9DDEF', rootCream: '#F3EAD3',
  // annotation (NOT terracotta)
  ring: '#FFAC8F', ringHalo: '#253247',        // house accent ring with a thin ink halo for contrast on images
} as const;
