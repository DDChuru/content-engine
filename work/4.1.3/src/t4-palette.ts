/** Topic 4 colour ROLES (SHARED-SPECS §4), fixed here so every session draws the shared models identically.
 * Copy this file byte for byte into work/t4-shared/ and import it; never choose a role colour elsewhere.
 * Error and contrast treatment stays BRAND.primary (terracotta); correct/tick stays BRAND.green. */
export const T4 = {
  head: '#E8A94A', headEdge: '#A36B17',         // phospholipid head: warm amber
  tail: '#8E8E8E',                               // fatty-acid tails: mid grey
  protein: '#8CC3C7', proteinEdge: '#2F7F86',    // proteins: teal (BRAND.teal edge)
  cholesterol: '#B8862F', cholesterolEdge: '#6E4E17', // cholesterol: ochre
  carb: '#5A9E4B', carbEdge: '#35652B',          // carbohydrate bead chains: green (not the tick green)
  water: '#BFE0F5', waterEdge: '#5B9CC4',        // water tokens: small pale blue circles
  glucose: '#F08C2E', glucoseEdge: '#A4561A',    // glucose: orange hexagon; sucrose: larger orange double hexagon
  ion: '#8A5CC2', ionEdge: '#553585',            // ions: small violet circles with + or −
  o2: '#D6453D', o2Edge: '#8E2A24',              // O₂ token: two joined red circles
  ligand: '#C2378E', ligandEdge: '#7D1F5A',      // ligand shapes: magenta
  atp: '#F2C45A', atpEdge: '#8A6414',            // ATP token: yellow rounded tag (= BRAND.sub)
  solution: '#EAF3FA',                           // watery regions (outside / cytoplasm) behind the bilayer
} as const;
