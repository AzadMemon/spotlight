'use strict';

// TODO: Need to add listener for onEnter to actually select the tab and go to it
// TODO: Sort open tabs by most recently visited

var counter = 0;

window.addEventListener('keydown', onKeyDown);

renderMenu();
$('input').on('input', renderMenu);
// $('input').focus();


function renderMenu(event) {
  var text = (event && event.target.value) || '';
  addOpenTabsToMenu(text.toLowerCase());
}

function addOpenTabsToMenu(text) {
  console.log('is this even running')
  chrome.windows.getAll(function (windows) {
    var html = '';
    var tabCounter = 0;

    windows.forEach(function (chromeWindow) {
      chrome.tabs.getAllInWindow(chromeWindow.id, function (tabs) {
        tabs.forEach(function (tab) {
          if (text && tab.url.indexOf(text) == -1 && tab.title.indexOf(text) == -1) {
            return;
          }

          var showDefaultFavIcon = !tab.favIconUrl || tab.favIconUrl.indexOf('chrome://') != -1;
          var favIconUrl = showDefaultFavIcon ? '/images/default-favicon.png' : tab.favIconUrl;
          var title = tab.title || tab.url;

          html +=
            '<div id="' + tabCounter + '" class="item" data-tab-id="' + tab.id + '" tabindex="' + tabCounter + '" data-tab-window="' + chromeWindow.id + '">' +
            '<object class="ui avatar image favicon" data="' + favIconUrl + '" type="image/png">' +
            '<img class="ui avatar image" src="/images/default-favicon.png" />' +
            '</object>' +
            '<div class="content">' +
            '<a class="header">' + title + '</a>' +
            '</div>' +
            '</div>';

          tabCounter++;
        })

        $('.list').html(html);
        $('.list').remove('#' + counter++); // Remove after so we don't get flash (per window)
        $('#0').addClass('selected');
        setScreenshot($('#0').data('tabId'));
      });
    })
  });
}

function onKeyDown(event) {
  var selectedItem = $('.selected');
  var tabId = parseInt(selectedItem.attr('data-tab-id'))
  var index = parseInt(selectedItem.attr('tabindex'));
  var nextElement;

  // TODO: Get image from array and insert in here as well
  // TODO: Need to scroll list so selected is always in view
  // TODO: Add listener when new tab is created and repopulate list
  // TODO: check if tab is within which window and bring window to front on enter press
  switch (event.keyCode) {
    case 13: //Enter key
      chrome.tabs.update(tabId, {active: true});
    case 38: //up arrow
      index -= 1;
      nextElement = $('[tabindex=' + index + ']');

      if (nextElement.length) {
        setScreenshot(parseInt(nextElement.data('tabId')));
        scrollToElement(nextElement.attr('id'));
        selectedItem.removeClass('selected');
        nextElement.addClass('selected');
      }
    case 40:
      index += 1;
      nextElement = $('[tabindex=' + index + ']');

      if (nextElement.length) {
        setScreenshot(parseInt(nextElement.data('tabId')));
        scrollToElement(nextElement.attr('id'));
        selectedItem.removeClass('selected');
        nextElement.addClass('selected');
      }
  }
}

function setScreenshot(tabId) {
  chrome.runtime.sendMessage({tabId: tabId}, function (response) {
    var screenshotElement = $('.screenshot');
    var screenshotNotAvailableElement = $('.screenshot-not-available');

    if (response) {
      screenshotElement.attr('src', response);
      screenshotElement.attr('style','display:inline-block !important');
      screenshotNotAvailableElement.attr('style','display:none !important');
    } else {
      screenshotNotAvailableElement.attr('style','display:inline-block !important');
      screenshotElement.attr('style','display:none !important');
    }
  });
}

function scrollToElement(id) {
  $('.list').scrollTop($('.list').scrollTop() + $('#' + id).position().top);
}
