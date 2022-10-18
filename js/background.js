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

function sendToFlomoWithLink(tab) {
  var url = localStorage.api || "";
  var opt = null;
  var content = "";
  if (url == "") {
    alert("请填写API后才能使用呃~(右键)");
  } else {
    chrome.tabs.getSelected(null, function (tab) {
      content = "标题：" + tab.title + "，来自：" + tab.url;

      var data = {
        content: content,
      };

      sendToFlomo(data, url);
    });
  }
}

function sendToFlomoWithText(info, tab) {
  var url = localStorage.api || "";
  var opt = null;
  var content = "";
  var currentUrl = "";
  if (url == "") {
    alert("请填写API后才能使用呃~(右键)");
  } else {
    chrome.tabs.getSelected(null, function (tab) {
      currentUrl = tab.url;
      content = info.selectionText + " 来自：" + currentUrl;
      var data = {
        content: content,
      };

      sendToFlomo(data, url);
    });
  }
}

function sendToIdeaNote(info, tab) {
  var url = localStorage.api || "";
  var currentUrl = "";
  var content = "";
  if (url == "") {
    alert("请填写API后才能使用呃~(右键)");
  } else {
    chrome.tabs.getSelected(null, function (tab) {
      currentUrl = tab.url;
      content = info + " 来自：" + currentUrl;
      var data = {
        content: content,
      };

      sendToFlomo(data, url);
    });
  }
}

function sendToFlomo(data, url) {
  data = {"option": "AddNoteApi", ... data}
  $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    beforeSend: function(request) {
      request.setRequestHeader("password","happen");
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
