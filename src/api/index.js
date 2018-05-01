import * as d3 from 'd3';
import joinurl from 'url-join';

const { API_ROOT } = process.env;
const NUKE_FILE = 'assets/nukes.csv';
const MILITARY_FILE = 'assets/national_material_1945-2009.csv';

function createAPILink(path) { return joinurl(API_ROOT, path); }

export function loadCSV(path) { return d3.csv(createAPILink(path)); }

export function loadNukeData() { return loadCSV(NUKE_FILE); }

export function loadMilitaryData() { return loadCSV(MILITARY_FILE); }
