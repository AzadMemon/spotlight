'use strict';

$('.ui.dropdown').dropdown({
  apiSettings: {
    responseAsync: function (settings, callback) {
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

        callback({success: true, results: openTabs});
      });
    }
  }
});
