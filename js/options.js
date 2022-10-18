(function () {
    var api = localStorage.api || "";
    var api_password = localStorage.api_password || "";
    document.getElementById("api").value = api;
    document.getElementById("apiPassword").value = api_password;
    document.getElementById("save").onclick = function () {
        localStorage.api = document.getElementById("api").value;
        localStorage.api_password = document.getElementById("apiPassword").value;
        if (localStorage.api && localStorage.api_password) {
            alert("保存成功");
        } else {
            alert("请输入idea-note API地址和密码");
        }
    };

    // var quick = document.querySelector("#quick");
    // var checked = localStorage.quick_enabled || false
    // quick.checked = checked;
    // chrome.storage.sync.get("quick_enabled", function (obj) {
    //     quick.checked = obj.quick_enabled;
    //     quick.onchange = function () {
    //         chrome.storage.sync.set({
    //             "quick_enabled": quick.checked
    //         });
    //     }
    // })
})();