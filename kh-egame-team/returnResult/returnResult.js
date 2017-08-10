/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//sectionValues: JSON格式, 各關卡之特徵值, 用之判斷是否過關及得幾顆星
//userCode: 寫入資料庫之blocks codes
// 回傳遊戲結果用
ReturnGameRecord = function (gameCode, sectionId, gameTime, sectionValues, userCode)
{
    var request = $.ajax({
        url: '/auth/main/?a=stemRecord',
        type: "POST",
        data: {gameCode: gameCode,sectionId: sectionId, gameTime: gameTime, sectionValues: JSON.stringify(sectionValues), userCode: userCode},
        success: function (response) 
        {
            if(response.gameStar>0){
                try {
                    WebduinoResult.initGameResultView(msg);
                } catch (e) {
                    alert(msg);
                    window.location = "http://www.egame.kh.edu.tw/login.html";
                }
            }else{
                console.log("no Pass!");
            }
        }
    });
};

