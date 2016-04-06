'use strict';

chrome.windows.getAll(function(windows) {
  var openTabs = [];

  for (var i = 0; i < windows.length; i++) {
    chrome.tabs.getAllInWindow(windows[i].id, function(tabs) {
      for (var j = 0; j < tabs.length; j++) {
        openTabs.push({
          'name': tabs[j].title,
          'value': tabs[j].url
        });
      }
    });
  }

  // For each open tab create a list node and insert into html

});

chrome.history.search({}, function(historyItems) {
  var history = [];

  for (var i = 0; i < historyItems.length; i++) {
    history.push({
      'name': historyItems[i].title,
      'value': historyItems[i].url
    });
  }

  // Append list node and insert into html
});

chrome.bookmarks.getRecent(20, function(bookmarks) {
  for (var i = 0; i < bookmarks.length; i++) {
    bookmarks.push({
      'name': bookmarks[i].title,
      'value': bookmarks[i].url
    });
  }
});

// On search we redo everything
