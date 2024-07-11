import { getTabData } from "./shared/tab-stats.js";
import { roundToDecimals } from "./shared/utils.js";

const manifest = browser.runtime.getManifest();

// Wrapping our event handler in another function avoids
// https://bugzilla.mozilla.org/show_bug.cgi?id=1907429
function updateTabCount(...args) {
  updateTabCountInternal(...args);
}
async function updateTabCountInternal() {
  const { tabCount, windows, maxTabs, minTabs, avgTabs } = await getTabData();

  const shortText = `${tabCount}`;
  const longText = `${shortText}:${windows.length}`;
  let text = longText;
  if (longText.length > 3) {
    text = shortText;
  }
  browser.action.setBadgeText({ text });

  const title = `
${manifest.name}

Tabs: ${tabCount}
Windows: ${windows.length}
Highest tab count: ${maxTabs}
Lowest tab count: ${minTabs}
Avg tab count: ${avgTabs}
`.trim();
  browser.action.setTitle({ title });
}

browser.tabs.onCreated.addListener(updateTabCount);
browser.tabs.onRemoved.addListener(updateTabCount);
browser.tabs.onReplaced.addListener(updateTabCount);
browser.tabs.onDetached.addListener(updateTabCount);
browser.tabs.onAttached.addListener(updateTabCount);
browser.runtime.onInstalled.addListener(updateTabCount);
browser.runtime.onStartup.addListener(updateTabCount);

browser.action.onClicked.addListener(() => {
  browser.sidebarAction.toggle();
});
