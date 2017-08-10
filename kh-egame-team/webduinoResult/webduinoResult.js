/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
WebduinoResult = {};
WebduinoResult.imageObjs = {};
WebduinoResult.laseSectionId = {"Webduino": 15, "Appduino": 10};
//圖片資源陣列
WebduinoResult.imagePaths = [
    {name: "bg", path: '/images/gameResult/gameResultBg.png'},
    {name: "button", path: "/images/gameResult/gameResultBtn.png"},
    {name: "btnNext", path: "/images/gameResult/btnCircleBluePress.png"},
    {name: "achiveBg", path: "/images/dialog/dialogBgRedV.png"},
    {name: "achiveBtn", path: "/images/dialog/btnCircleRedPress.png"}
];

WebduinoResult.initGameResultView = function (gameResultJSON)
{
    try {
        WebduinoResult.gameResultJSONObject = gameResultJSON;

        //如果有錯誤，就停止往下，並且彈出錯誤訊息
        if (WebduinoResult.gameResultJSONObject.error != "none")
        {
            alert(WebduinoResult.gameResultJSONObject.errorMessage);
            location.href = "/auth/main/";
            return;
        }
        var splitCount = window.location.pathname.split("/");
        WebduinoResult.imageGameResultUrlPrefix = "";
        //網站根目錄為3
        if (splitCount.length > 3)
        {
            for (var i = 3; i <= splitCount.length; i++)
            {
                WebduinoResult.imageGameResultUrlPrefix += i == 3 ? ".." : "/..";
            }
        }
        for (var i = 0; i < WebduinoResult.imagePaths.length; i++)
        {
            WebduinoResult.imagePaths[i].path = WebduinoResult.imageGameResultUrlPrefix + WebduinoResult.imagePaths[i].path;
        }
        //將成就圖片加到圖片資源中
        if (WebduinoResult.gameResultJSONObject.newAchievements.length > 0)
        {
            WebduinoResult.imagePaths.push({name: "achieveIcon", path:
                        WebduinoResult.imageGameResultUrlPrefix + "/" + WebduinoResult.gameResultJSONObject.newAchievements[0].imageResourceRoot + "/icon.png"});
        }
        if (WebduinoResult.gameResultJSONObject.isLevelUp == true)
        {
            WebduinoResult.loadImages(WebduinoResult.imagePaths, WebduinoResult.initLevelUpDialog);
        } else if (WebduinoResult.gameResultJSONObject.newAchievements.length > 0) {
            WebduinoResult.loadImages(WebduinoResult.imagePaths, WebduinoResult.initAchievementGetDialog);
        } else {
            WebduinoResult.loadImages(WebduinoResult.imagePaths, WebduinoResult.initGameResult);
        }
    } catch (e) {
        alert("產生遊戲結果視窗時發生錯誤!!" + e);
    }
};

//升級畫面
WebduinoResult.initLevelUpDialog = function (images)
{
    $('#content').css('display', 'block');
    $("#resultView").html(
            "<div class='levelUp'>恭喜!升級囉~~~!!</div>" +
            "<div class='levelUpInfo'>您目前等級:  " + WebduinoResult.gameResultJSONObject.currentLevel + "</div>" +
            "<div class='levelUpButtonSet' onclick=\"WebduinoResult.showNextDialogAfterLevelUp()\">" +
            "<img class='levelUpButton' src=" + images.achiveBtn.src + ">" +
            "<div class='levelUpButtonText' >確定</div>" +
            "</div>" +
            "<div class='levelExit' onclick=\"WebduinoResult.showNextDialogAfterLevelUp()\"></div>"
            );
    $("#resultView").css("background-image", "url(" + images.achiveBg.src + ")");
    $("#resultView").css("height", "100%");
};

WebduinoResult.showNextDialogAfterLevelUp = function ()
{
    if (WebduinoResult.gameResultJSONObject.newAchievements.length > 0)
    {
        WebduinoResult.loadImages(WebduinoResult.imagePaths, WebduinoResult.initAchievementGetDialog);
    } else {
        WebduinoResult.loadImages(WebduinoResult.imagePaths, WebduinoResult.initGameResult);
    }
};

WebduinoResult.initAchievementGetDialog = function (images)
{
    $('#content').css('display', 'block');
    $("#resultView").html(
            "<div class='achieve'>新成就達成!!</div>" +
            "<div class='achieveInfo'></div>" +
            "<div class='achieveButtonSet' onclick=\"WebduinoResult.loadImages(imagePaths, initGameResult)\">" +
            "<img class='achieveButton' src=" + WebduinoResult.achiveBtn.src + ">" +
            "<div class='achieveButtonText'>確定</div>" +
            "</div>" +
            "<div class='achieveExit' onclick=\"WebduinoResult.loadImages(imagePaths, initGameResult)\"></div>"
            );

    for (var i = 0; i < WebduinoResult.gameResultJSONObject.newAchievements.length; i++)
    {
        $(".achieveInfo").append(
                "成就稱號:  " + WebduinoResult.gameResultJSONObject.newAchievements[i].name + "<br><br>" +
                "成就系列:  " + WebduinoResult.gameResultJSONObject.newAchievements[i].belongSeries + "<br><br>" +
                "條件說明:  " + WebduinoResult.gameResultJSONObject.newAchievements[i].description + "<br><br>"
                );
    }
    $("#resultView").css("background-image", "url(" + WebduinoResult.images.achiveBg.src + ")");
    $("#resultView").css("height", "100%");
};

WebduinoResult.loadImages = function (sources, callback)
{
    var loadedImages = 0;
    var numImages = 0;
    numImages = sources.length - 1;
    for (var i = 0; i <= numImages; i++)
    {
        var key = sources[i].name;
        var path = sources[i].path;
        WebduinoResult.imageObjs[key] = new Image();
        WebduinoResult.imageObjs[key].onload = function ()
        {
            if (++loadedImages >= numImages)
            {
                callback(WebduinoResult.imageObjs);
            }
        };
        WebduinoResult.imageObjs[key].src = path;
    }
};
//從這裡開始初始化畫面
WebduinoResult.initGameResult = function (images)
{
    $('#content').css('display', 'block');
    $("#resultView").html(
            "<img src='" + images.bg.src + "' style='width:100%' />" +
            "<div class='rightArea'>" +
            "<div class='titleArea'></div>" +
            "<div class='topArea'></div>" +
            "<div class='midArea'>" +
            "<div class='commentArea'></div>" +
            "<div class='expArea'></div>" +
            "<div class='goldArea'></div>" +
            "</div>" +
            "</div>" +
            "<div class='exit'></div>" +
            "<div class='btnRow'></div>");
    $("#resultView").css("background-image", "");
    $("#resultView").css("height", "");
    //$("#resultView").css("background-size","contain");
    $("#resultView").css("top", "0%");
    $("#resultView").css("left", "10%");
    $("#resultView").css("width", "80%");
//    $("#resultView").css("height","100%");
    $("#resultView").css("z-index", "2");

    WebduinoResult.drawButtons(images);
    //中間經驗值與金錢
    WebduinoResult.refreshGameResult();
    //下方遊戲結語與過關條件
    WebduinoResult.refreshGamePassCondition();

    $("#resultView").hide();
    $("#resultView").slideDown(0, function () {
        $(".expArea").hide();
        $(".goldArea").hide();
        $(".commentArea").hide();
        $(".expArea").slideDown(500, function () {
            $(".goldArea").slideDown(500, function () {
                $(".commentArea").fadeIn(500, function () {
                });
            });
        });
    });
};

WebduinoResult.refreshGamePassCondition = function ()
{
    var resultString;
    $(".topArea").empty();
    var gameStar = parseInt(WebduinoResult.gameResultJSONObject.gameStar);
//    var section_id = parseInt(WebduinoResult.gameResultJSONObject.sectionId);
//        var level = parseInt(DotCodeResult.gameResultJSONObject.userInfo.level);
    var score = gameStar * 250;
    var passString = "恭喜你，得到" + gameStar + "顆星，本關卡得分: " + score + " 分！";
    $(".topArea").append(resultString);
    $(".topArea").append("<img src=\"" + WebduinoResult.imageGameResultUrlPrefix + "/images/gameResult/footPrint.png\" width=\"5%\" height=\"100%\" style=\"margin: 0 2% 0 2%;\"/>" +
            "<span>" + passString + "</span>");
};

WebduinoResult.refreshGameResult = function ()
{
    var sectionName = WebduinoResult.gameResultJSONObject.sectionName;
    var timeStamp = WebduinoResult.gameResultJSONObject.timeStamp;
    var time = new Date(timeStamp);
    var sn = timeStamp % 86400000;
    var timeStr = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "-" + sn;
    var titleArea = "<p style='display:inline-block;float:left;margin:0px;font-weight:600'>" + sectionName + "</p>" +
            "<p style='display:inline-block;float:right;margin:18px;font-size:60%'>" + timeStr + "</p>";
    $(".titleArea").html(titleArea);
    var gameStar = parseInt(WebduinoResult.gameResultJSONObject.resultComment);
    var comment_img;
    if (gameStar == 2) {
        comment_img = 'Incredible';
    } else if (gameStar == 1) {
        comment_img = 'Good';
    } else {
        comment_img = 'Try again';
    }
    var commentImg = "url(\"" + WebduinoResult.imageGameResultUrlPrefix + "/images/gameResult/" + comment_img + ".png\")";
    $(".commentArea").css("background-image", commentImg);
    $(".commentArea").css("background-size", "100% 100%");
    $(".goldArea").empty();
    $(".goldArea").append(
            "<p>獲得金錢</p>" +
            "<p class='fontNormal'>關卡獲得:" + WebduinoResult.gameResultJSONObject.goldOrg +
            "<p class='fontNormal'>角色加乘:" + WebduinoResult.gameResultJSONObject.goldRole +
            //"<p class='fontNormal'>裝備加乘:"+WebduinoResult.gameResultJSONObject.goldEquipment+"<br><br>"+
            "<p class='fontNormal'>道具加乘:" + WebduinoResult.gameResultJSONObject.goldProps +
            "<p class='fontNormal'>成就加乘:" + WebduinoResult.gameResultJSONObject.goldAchievement +
            "<p class='fontResult'>總共獲得金錢:" + WebduinoResult.gameResultJSONObject.goldTotal);
    $(".expArea").empty();
    $(".expArea").append(
            "<p>獲得經驗值</p>" +
            "<p class='fontNormal'>關卡獲得:" + WebduinoResult.gameResultJSONObject.expOrg +
            "<p class='fontNormal'>角色加乘:" + WebduinoResult.gameResultJSONObject.expRole +
            //"<p class='fontNormal'>裝備加乘:"+WebduinoResult.gameResultJSONObject.expEquipment+"<br>"+
            "<p class='fontNormal'>道具加乘:" + WebduinoResult.gameResultJSONObject.expProps +
            "<p class='fontNormal'>成就加乘:" + WebduinoResult.gameResultJSONObject.expAchievement +
            "<p class='fontResult'>總共獲得經驗值:" + WebduinoResult.gameResultJSONObject.expTotal);
};

WebduinoResult.drawButtons = function (images)
{
    var buttonColor = '#FFF4CC';
    var fontSize = "180%";
    //右上角關閉X
    var exit = $(".exit");
    var section_id = parseInt(WebduinoResult.gameResultJSONObject.sectionId);
    var gameCode = WebduinoResult.gameResultJSONObject.gameCode;
    var lastSectionId = WebduinoResult.laseSectionId[gameCode];
    if (section_id !== lastSectionId) {
        //下一關
        $(".btnRow").append(
                "<div class='btnNextSet' onclick=\"WebduinoResult.doNextSection()\">" +
                "<img class='btnNext' src='" + images.button.src + "'/>" +
                "<div class='textNext'>下一關</div>" +
                "</div>"
                );
    }
    //再玩一次按鈕
    $(".btnRow").append(
            "<div class='btnPlayAgainSet' onclick=\"WebduinoResult.isAllowToPlay(WebduinoResult.canPlayAgain)\">" +
            "<img class='btnPlayAgain' src='" + images.button.src + "'/>" +
            "<div class='textPlayAgain'>再玩一次</div>" +
            "</div>");
    //退出按鈕
    $(".btnRow").append(
            "<div class='btnExitSet' onclick=\"window.location='/auth/main#" + (WebduinoResult.gameResultJSONObject.gameCode).toLowerCase() + "/" + pageId + "'\">" +
            "<img class='btnExit' src='" + images.button.src + "'/>" +
            "<div class='textExit'>回遊戲關卡</div>" +
            "</div>");
    //右上角關閉X
    exit.on('mousedown', function () {
        window.location = "/auth/main#" + (WebduinoResult.gameResultJSONObject.gameCode).toLowerCase() +"/"+ pageId;
    });
    exit.on('touchend', function () {
        window.location = "/auth/main#" + (WebduinoResult.gameResultJSONObject.gameCode).toLowerCase() +"/"+ pageId;
    });
};

WebduinoResult.doNextSection = function ()
{
    var section;
    sectionId +=1;
    if(sectionId<0){
        section = "0"+sectionId;
    }else{
        section = Integer.toString(sectionId);
    }
    window.location = "/webduino/?lang=zh-hant&page=stages/"+section;
};
WebduinoResult.canPlayAgain = function (isAllowToPlay)
{
    if (isAllowToPlay) {
        location.reload();
    } else {
        alert("你已經沒有體力了~~~讓眼睛休息一下吧");
        window.location = "/auth/main/";
    }
};
WebduinoResult.isAllowToPlay = function (callback)
{
    var request = $.ajax({
        url: "/resources/eGame/auth/isAllowToPlay",
        type: "get"
    });
    request.done(
        function (msg) {
            callback(msg.isAllow);
    });
};

