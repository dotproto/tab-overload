import { getTabData } from "./shared/tab-stats.js";

const bankruptcyNote = document.getElementById("bankruptcy-note");
const tabCountEl = bankruptcyNote.getElementsByClassName("tab-count")[0];
const windowCountEl = bankruptcyNote.getElementsByClassName("window-count")[0];
const tpwEl = bankruptcyNote.getElementsByClassName("tabs-per-window")[0];

const data = await getTabData();
globalThis.data = data;

tabCountEl.innerText = data.tabCount;
windowCountEl.innerText = data.windows.length;
tpwEl.innerText = data.avgTabs;
// const tabs = browser.tabs.query({});


[...document.querySelector("#close-buttons").children].forEach(button => {
  button.addEventListener("click", async (event) => {
    const urlData = button.dataset.urls;
    const url = urlData.split(",").map(current => `*://${current}*`);
    const tabs = await browser.tabs.query({url});
    const length = tabs.length;
    const dryRun = !(event.target.dataset.dryRun === undefined || event.target.dataset.dryRun === "false");
    if (!dryRun) {
      for (const tab of tabs) {
        browser.tabs.remove(tab.id);
      }
    }
    alert(`Closed ${length} tabs${!dryRun ? "" : " (dry)" }`);
  });
});

document.getElementById("big-red").addEventListener("click", async () => {
  if (!window.confirm("Are you sure?")) return;

  // const tabs = await browser.tabs.query({});
  const windows = await browser.windows.getAll({populate: true});
  for (const window of windows) {
    if (!window.tabs.find(tab => tab.pinned)) {
      // No pinned tabs, nuke it
      browser.windows.remove(window.id);
    } else {
      // At least one tab is pinned, close the unpinned tabs one by one
      for (const tab of window.tabs) {
        if (!tab.pinned) {
          browser.tabs.remove(tab.id);
        }
      }
    }
  }
});
