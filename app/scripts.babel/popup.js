'use strict';


function initDropdown() {
  $('.ui.dropdown').dropdown({
    fullTextSearch: true,
    direction: 'downward',
    allowTabs: true,
    duration: 0
  });

  $('input').focus();
  $('.menu').scrollTop(0);
}


appendHeading('open');
addOpenTabsToMenu(function (numberOfResults) {
  if (numberOfResults === 0) {
    $('.menu').remove('.open');
  }

  appendHeading('history');
  addHistoryToMenu(function (numberOfResults) {
    if (numberOfResults === 0) {
      $('.menu').remove('.history');
    }

    appendHeading('bookmarks');
    addBookmarksToMenu(function (numberOfResults) {
      if (numberOfResults === 0) {
        $('.menu').remove('.bookmarks');
      }

      initDropdown();
    });
  });
});

function appendHeading(text) {
  $('.menu').append(
    '<div class="heading ' + text + '">' + text + '</div>' +
    '<div class="ui divider ' + text + '"></div>'
  );
}

// TODO: Add a loading bar in the list when loading search results
// TODO: On search, need to actually search history and bookmarks and replace contents with that
// TODO: Need to listen on new tab creation chrome.tabs.onCreated and add to list
// TODO: Need to listen on tab deletion chrome.tabs.onRemoved and remove from list
// TODO: Need to listen on tab change and take a screenshot chrome.tabs.onActivated
// TODO: Need to add listener for onEnter to actually select the tab and go to it
// TODO: Need to add listener to onScroll to a) change image and b) check if image is either last or first and scroll menu all the way to the bottom or top respectively
// TODO: Sort open tabs by most recently visited

function addOpenTabsToMenu(callback) {
  chrome.windows.getAll(function (windows) {
    var numberOfOpenTabs = 0;
    for (var i = 0; i < windows.length; i++) {
      chrome.tabs.getAllInWindow(windows[i].id, function (tabs) {
        numberOfOpenTabs += tabs.length;

        for (var j = 0; j < tabs.length; j++) {
          var showDefaultFavIcon = !tabs[j].favIconUrl || tabs[j].favIconUrl.indexOf('chrome://') != -1;
          var favIconUrl = showDefaultFavIcon ? '/images/default-favicon.png' : tabs[j].favIconUrl;
          var title = tabs[j].title || tabs[j].url;

          $('.menu').append(
            '<div class="item" data-value="' + tabs[j].url + '">' +
            '<object class="favicon" data="' + favIconUrl + '" type="image/png">' +
            '<img src="/images/default-favicon.png" />' +
            '</object>' +
            '<span>' + title + '</span>' +
            '</div>'
          );
        }

        if (i === windows.length) {
          console.log(numberOfOpenTabs);
          callback(numberOfOpenTabs);
        }
      });
    }
  });
}

function addHistoryToMenu(callback) {
  chrome.history.search({text: '', maxResults: 20}, function (history) {
    for (var j = 0; j < history.length; j++) {
      var parsedUrl = parseUrl(history[j].url);
      var showDefaultFavicon = !history[j].url || history[j].url.indexOf('chrome://') != -1;
      var favIconUrl = showDefaultFavicon ? '/images/default-favicon.png' : parsedUrl.protocol + '//' + parsedUrl.host + '/favicon.ico';
      var title = history[j].title || history[j].url;

      $('.menu').append(
        '<div class="item" data-value="' + history[j].url + '">' +
        '<object class="favicon" data="' + favIconUrl + '" type="image/png">' +
        '<img src="/images/default-favicon.png" />' +
        '</object>' +
        '<span>' + title + '</span>' +
        '</div>'
      );
    }

    callback(history.length);
  });
}

function addBookmarksToMenu(callback) {
  chrome.bookmarks.getRecent(20, function (bookmarks) {
    for (var j = 0; j < bookmarks.length; j++) {
      var parsedUrl = parseUrl(bookmarks[j].url);
      var showDefaultFavicon = !bookmarks[j].url || bookmarks[j].url.indexOf('chrome://') != -1;
      var favIconUrl = showDefaultFavicon ? '/images/default-favicon.png' : parsedUrl.protocol + '//' + parsedUrl.host + '/favicon.ico';
      var title = bookmarks[j].title || bookmarks[j].url;

      $('.menu').append(
        '<div class="item" data-value="' + bookmarks[j].url + '">' +
        '<object class="favicon" data="' + favIconUrl + '" type="image/png">' +
        '<img src="/images/default-favicon.png" />' +
        '</object>' +
        '<span>' + title + '</span>' +
        '</div>'
      );
    }

    callback(bookmarks.length);
  });
}

function parseUrl(url) {
  var parser = document.createElement('a');
  parser.href = url;

  return parser;
}