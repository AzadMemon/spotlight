'use strict';

chrome.windows.getAll(function (windows) {
  for (var i = 0; i < windows.length; i++) {
    chrome.tabs.getAllInWindow(windows[i].id, function (tabs) {
      for (var j = 0; j < tabs.length; j++) {
        console.log(tabs[j].favIconUrl);
        var isFavIconChromeUrl = !tabs[j].favIconUrl || tabs[j].favIconUrl.indexOf('chrome://') != -1;
        var favIconUrl = isFavIconChromeUrl ? '/images/default-favicon.png' : tabs[j].favIconUrl;

        $('.menu').append(
          '<div class="item" data-value="' + tabs[j].url + '">' +
            '<img class="favicon" src="' + favIconUrl + '" />' +
            '<span>' + tabs[j].title + '</span>' +
          '</div>'
        );
      }



      // TODO: Need to add favicons when accessing chrome extensions/settings
      // TODO: Need to add history + bookmarks
      // TODO: Need to listen on new tab creation chrome.tabs.onCreated
      // TODO: Need to listen on tab deletion chrome.tabs.onRemoved
      // TODO: Need to listen on tab change and take a screenshot chrome.tabs.onActivated
      // TODO: Need to add ability to enter your own url
      // TODO: Need to add listener for onEnter to actually select the tab and go to it
      // TODO: Need to add listener to onScroll to a) change image and b) check if image is either last or first and scroll menu all the way to the bottom or top respectively

      //chrome.history.search({}, function (historyItems) {
      //  for (var i = 0; i < historyItems.length; i++) {
      //    history.push({
      //      'name': historyItems[i].title,
      //      'value': historyItems[i].url
      //    });
      //  }
      //
      //  chrome.bookmarks.getRecent(20, function (bookmarks) {
      //    for (var i = 0; i < bookmarks.length; i++) {
      //      bookmarks.push({
      //        'name': bookmarks[i].title,
      //        'value': bookmarks[i].url
      //      });
      //    }
      //  });
      //});
    });
  }

  $('.ui.dropdown').dropdown({
    fullTextSearch: true,
    direction: 'downward',
    allowTabs: true,
    duration: 0,
    onHide: function (val) {
      return false;
    }
  });

  $('input').focus();
});
