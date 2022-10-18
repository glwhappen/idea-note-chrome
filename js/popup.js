// import { sendToIdeaNote } from "./background";
// const { sendToIdeaNote } = require('./background')

function sendToIdeaNote(info, tab) {
    var url = localStorage.api || "";
    var api_password = localStorage.api_password || "";
    var currentUrl = "";
    var content = "";
    if (!url || !api_password) {
      alert("请填写API和密码后才能使用呃~");
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
    var api_password = localStorage.api_password || "";
    $.ajax({
      url: url,
      type: "POST",
      beforeSend: function(request) {
        request.setRequestHeader("password",api_password);
      },
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (data) {
        console.log("succes: " + JSON.stringify(data.data.note.content));
  
        chrome.notifications.create(null, {
          type: 'basic',
          iconUrl: 'logo.png',
          title: '添加成功' + api_password,
          message: data.data.note.content
      });
      },
      error: function (data) {
        chrome.notifications.create(null, {
          type: 'basic',
          iconUrl: 'logo.png',
          title: '添加失败，请检查api和密码'
      });
      }
    });
  }

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        for (const anchor of document.getElementsByTagName('a')) {
            anchor.onclick = () => {
                chrome.tabs.create({ active: true, url: anchor.href });
            };
        };
        
    });
    console.log("12312")
    const sendText = document.getElementById('sendText')
    const sendTextBtn = document.getElementById('sendTextBtn')
    sendTextBtn.addEventListener('click', () => {
        console.log("发送文字", sendText.value)
    //     alert(sendText.innerText)
        sendToIdeaNote(sendText.value)
    })
})();