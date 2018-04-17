import * as d3 from 'd3';
import joinurl from 'url-join';

const { API_ROOT } = process.env;
const NUKE_FILE = 'assets/data.csv';

export function createAPILink(path) { return joinurl(API_ROOT, path); }

export async function loadCSV(path) { return d3.csv(createAPILink(path)); }

export async function loadNukeData() { return loadCSV(NUKE_FILE); }
