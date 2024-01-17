import { elems, createEl, wrapEl } from "./functions";

export function scrollableTableInit() {
  const tables = elems('table');
  if (tables) {
    const scrollable = 'scrollable-table';
    for (let idx = 0, table = tables[0]; idx < tables.length; table = tables[++idx]) {
      const wrapper = createEl('div');
      wrapper.className = scrollable;
      wrapEl(table, wrapper);
    }
  }
}
