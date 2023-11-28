chrome.storage.sync.set({
  quick_enabled: false,
});
chrome.contextMenus.create({
  type: "normal",
  title: "将文本保存到idea-note",
  id: "flomoText",
  onclick: sendToFlomoWithText,
  contexts: ["selection"],
});

chrome.contextMenus.create({
  type: "normal",
  title: "将链接保存到idea-note",
  id: "flomoLink",
  onclick: sendToFlomoWithLink,
});
/**
 * 将链接保存到idea-note
 */
function sendToFlomoWithLink(tab) {
  var url = localStorage.api || "";
  let url_formatted_text = localStorage.url_formatted_text || "[$title$]($url$)"

  var opt = null;
  var content = "";
  if (url == "") {
    alert("请填写API后才能使用呃~(右键)");
  } else {
    chrome.tabs.getSelected(null, function (tab) {
      url_formatted_text = url_formatted_text.replace('$title$', tab.title)
      url_formatted_text = url_formatted_text.replace('$url$', tab.url)

      content = url_formatted_text;

      var data = {
        content: content,
      };

      sendToFlomo(data, url);
    });
  }
}

function sendToFlomoWithText(info, tab) {
  var url = localStorage.api || "";
  let right_formatted_text = localStorage.right_formatted_text || "$text$ \n$url$"


  var opt = null;
  var content = "";
  var currentUrl = "";
  if (url == "") {
    alert("请填写API后才能使用呃~(右键)");
  } else {
    chrome.tabs.getSelected(null, function (tab) {
      currentUrl = tab.url;

      right_formatted_text = right_formatted_text.replace('$text$', info.selectionText)
      right_formatted_text = right_formatted_text.replace('$title$', tab.title)
      right_formatted_text = right_formatted_text.replace('$url$', currentUrl)

      content = right_formatted_text;
      var data = {
        content: content,
      };

      sendToFlomo(data, url);
    });
  }
}

function sendToIdeaNote(info, tab) {
  var url = localStorage.api || "";
  let right_formatted_text = localStorage.right_formatted_text || "$text$ \n$url$"

  var currentUrl = "";
  var content = "";
  if (url == "") {
    alert("请填写API后才能使用呃~(右键)");
  } else {
    chrome.tabs.getSelected(null, function (tab) {
      currentUrl = tab.url;
      right_formatted_text = right_formatted_text.replace('$text$', info.selectionText)
      right_formatted_text = right_formatted_text.replace('$title$', tab.title)
      right_formatted_text = right_formatted_text.replace('$url$', currentUrl)

      content = right_formatted_text;
      var data = {
        content: content,
      };

      sendToFlomo(data, url);
    });
  }
}

function sendToFlomo(data, url) {
  data = {"option": "AddNoteApi", ... data}
  pwd = localStorage.api_password
  $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    beforeSend: function(request) {
      request.setRequestHeader("password", pwd);
    },
    data: JSON.stringify(data),
    success: function (data) {
      console.log("succes: " + JSON.stringify(data.data.note.content));

      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'logo.png',
        title: '添加成功',
        message: data.data.note.content
    });
    },
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  chrome.contextMenus.update("idea-note Text", {
    title: "Send Text to idea-note“" + message + "”",
  });

  chrome.tabs.getSelected(null, function (tab) {
    currentUrl = tab.url;
    content = "#chrome " + message + " 来自：" + currentUrl;
    var data = {
      content: content,
    };
    var url = localStorage.api || "";
    sendToFlomo(data, url);
  });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log("inputChanged: " + text);
  if (!text) return;
  suggest([
    { content: "#chrome " + text, description: "保存到idea-note ===>>>  " + text },
    // { content: "flomo", description: "回到flomo https://flomoapp.com/mine" },
  ]);
});

chrome.omnibox.onInputEntered.addListener((text) => {
  console.log("inputEntered: " + text);
  if (!text) return;
  if (text == "flomo") {
    openUrlCurrentTab("https://flomoapp.com/mine");
  } else {
    var data = {
      content: text,
    };
    var url = localStorage.api || "";
    sendToFlomo(data, url);
  }
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}
// 当前标签打开某个链接
function openUrlCurrentTab(url) {
  getCurrentTabId((tabId) => {
    chrome.tabs.update(tabId, { url: url });
  });
}
