'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

var screenshots = {};

chrome.tabs.onUpdated.addListener(onTapUpdated);
chrome.tabs.onActivated.addListener(onActivated);

function onTapUpdated(tabId) {
  chrome.tabs.captureVisibleTab(null, {}, function (image) {
    screenshots[tabId] = image;
  });
}

function onActivated(activeInfo) {
  chrome.tabs.captureVisibleTab(null, {}, function (image) {
    screenshots[activeInfo.tabId] = image;
  });
}