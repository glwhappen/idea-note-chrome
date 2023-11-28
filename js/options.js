(function () {
    let api = localStorage.api || "";
    let api_password = localStorage.api_password || "";
    let right_formatted_text = localStorage.right_formatted_text || "$text$ \n$url$";
    let url_formatted_text = localStorage.url_formatted_text || "[$title$]($url$)";

    document.getElementById("api").value = api;
    document.getElementById("apiPassword").value = api_password;
    document.getElementById("right_formatted_text").value = right_formatted_text;
    document.getElementById("url_formatted_text").value = url_formatted_text;

    document.getElementById("save").onclick = function () {
        localStorage.api = document.getElementById("api").value;
        localStorage.api_password = document.getElementById("apiPassword").value;
        localStorage.right_formatted_text = document.getElementById("right_formatted_text").value
        localStorage.url_formatted_text = document.getElementById("url_formatted_text").value

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