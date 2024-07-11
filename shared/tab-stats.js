import { join, roundToDecimals, sortByProp } from "./utils.js";

export async function getTabData() {
  const windows = await browser.windows.getAll({populate: true});
  let maxTabs = Number.NEGATIVE_INFINITY;
  let minTabs = Number.POSITIVE_INFINITY;
  const tabsByAge = [];
  let tabCount = 0;
  for (const win of windows) {
    tabCount += win.tabs.length;
    if (maxTabs < win.tabs.length) {
      maxTabs = win.tabs.length;
    }
    if (minTabs > win.tabs.length) {
      minTabs = win.tabs.length;
    }
    join(tabsByAge, win.tabs);
  }
  sortByProp(tabsByAge, "lastAccessed");
  const avgTabs = roundToDecimals(tabCount / windows.length, 3);

  return {
    windows,
    tabCount,
    maxTabs,
    minTabs,
    avgTabs,
    tabsByAge,
  };
}