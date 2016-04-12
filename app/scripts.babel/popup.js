'use strict';

// TODO: Need to add listener for onEnter to actually select the tab and go to it
// TODO: Sort open tabs by most recently visited

var counter = 0;

window.addEventListener('keydown', onKeyDown);

renderMenu();
$('input').on('input', renderMenu);
$('input').focus();


function renderMenu(event) {
  var text = (event && event.target.value) || '';
  addOpenTabsToMenu(text.toLowerCase());
}

function addOpenTabsToMenu(text) {
  chrome.windows.getAll(function (windows) {
    var html = '';
    var tabCounter = 0;

    for (var i = 0; i < windows.length; i++) {
      chrome.tabs.getAllInWindow(windows[i].id, function (tabs) {
        for (var j = 0; j < tabs.length; j++) {
          if (text && tabs[j].url.indexOf(text) == -1 && tabs[j].title.indexOf(text) == -1) {
            continue;
          }

          var showDefaultFavIcon = !tabs[j].favIconUrl || tabs[j].favIconUrl.indexOf('chrome://') != -1;
          var favIconUrl = showDefaultFavIcon ? '/images/default-favicon.png' : tabs[j].favIconUrl;
          var title = tabs[j].title || tabs[j].url;

          html +=
            '<div id="' + counter + '" class="item" data-tab-id="' + tabs[j].id + '" tabindex="' + tabCounter + '">' +
            '<object class="ui avatar image favicon" data="' + favIconUrl + '" type="image/png">' +
            '<img class="ui avatar image" src="/images/default-favicon.png" />' +
            '</object>' +
            '<div class="content">' +
            '<a class="header">' + title + '</a>' +
            '</div>' +
            '</div>';

          tabCounter++;
        }

        $('.list').html(html);
        $('.list').remove('#' + counter++); // Remove after so we don't get flash
        $('#0').addClass('selected');
      });
    }
  });
}

function onKeyDown(event) {
  var selectedItem = $('.selected');
  var index = parseInt(selectedItem.attr('tabindex'));

  // TODO: Get image from array and insert in here as well
  // TODO: Need to scroll list so selected is always in view
  if (event.keyCode === 38) { //Up arrow
    index -= 1;

    if ($('[tabindex=' + index + ']').length) {
      selectedItem.removeClass('selected');
      $('[tabindex=' + index + ']').addClass('selected');
    }
  } else if (event.keyCode === 40) {
    index += 1;

    if ($('[tabindex=' + index + ']').length) {
      selectedItem.removeClass('selected');
      $('[tabindex=' + index + ']').addClass('selected');
    }
  }
}