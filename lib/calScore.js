const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
  async calScore(objScore) { 

    let res = await fetch(
      "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json"
    );

    let resScr = {};
    resScr = await res.json();

    // resScr.groups.a.matches[0].home_result = 1;
    // resScr.groups.a.matches[0].away_result = 0;

    // resScr.groups.a.matches[1].home_result = 0;
    // resScr.groups.a.matches[1].away_result = 2;

    // resScr.groups.b.matches[3].home_result = 0;
    // resScr.groups.b.matches[3].away_result = 2;


    let totalScore = 0;
    let resHomeScore;
    let resAwayScore;
    let resTeamWin;
    let playerTeamWin;
    for (let gup in objScore.groups) {
      for (let i = 0; i < objScore.groups[gup].matches.length; i++) {
        resTeamWin = undefined;
        playerTeamWin = undefined;
        resHomeScore = resScr.groups[gup].matches[i].home_result;
        resAwayScore = resScr.groups[gup].matches[i].away_result;
        if (
            objScore.groups[gup].matches[i].home_result === resHomeScore &&
            objScore.groups[gup].matches[i].away_result === resAwayScore
        ) {
            objScore.groups[gup].matches[i].score = 3;
          totalScore = totalScore + 3;
        } else {
          if (
            Number.isInteger(resHomeScore) === true &&
            Number.isInteger(resAwayScore) === true
          ) {
            if (resHomeScore > resAwayScore) {
              resTeamWin = 1;
            } else if (resHomeScore < resAwayScore) {
              resTeamWin = 2;
            } else if (resHomeScore === resAwayScore) {
              resTeamWin = 0;
            }
          }

          if (
            Number.isInteger(objScore.groups[gup].matches[i].home_result) &&
            Number.isInteger(objScore.groups[gup].matches[i].away_result)
          ) {
            if (
                objScore.groups[gup].matches[i].home_result >
                objScore.groups[gup].matches[i].away_result
            ) {
              playerTeamWin = 1;
            } else if (
                objScore.groups[gup].matches[i].home_result <
                objScore.groups[gup].matches[i].away_result
            ) {
              playerTeamWin = 2;
            } else if (
                objScore.groups[gup].matches[i].home_result ===
                objScore.groups[gup].matches[i].away_result
            ) {
              playerTeamWin = 0;
            }
          }
          if (
            Number.isInteger(resTeamWin) &&
            Number.isInteger(playerTeamWin) &&
            resTeamWin === playerTeamWin
          ) {
            objScore.groups[gup].matches[i].score = 1;
            totalScore = totalScore + 1;
          }
        }
      }
    }
    objScore.totalscore = totalScore;
    return objScore
  },
  async calScoreChart(playerName) {
    let playerPmis = new Promise(function(resolve, reject) {
      fs.readFile(
        "public/json/user/" + playerName + ".json",
        "utf8",
        function(err, dataRet) {
          if (err) reject(err);
          else resolve(dataRet);
        }
      );
    });

    let obj = {};
    obj.player = JSON.parse(await playerPmis);

    let resScrPmis = await fetch(
      "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json"
    );

    let resScr = {};
    resScr = await resScrPmis.json();

    // resScr.groups.a.matches[0].home_result = 1;
    // resScr.groups.a.matches[0].away_result = 0;

    // resScr.groups.a.matches[1].home_result = 0;
    // resScr.groups.a.matches[1].away_result = 2;

    // resScr.groups.b.matches[3].home_result = 0;
    // resScr.groups.b.matches[3].away_result = 2;


    let totalScore = 0;
    let resHomeScore;
    let resAwayScore;
    let resTeamWin;
    let playerTeamWin;
    for (let gup in obj.player.groups) {
      for (let i = 0; i < obj.player.groups[gup].matches.length; i++) {
        resTeamWin = undefined;
        playerTeamWin = undefined;
        resHomeScore = resScr.groups[gup].matches[i].home_result;
        resAwayScore = resScr.groups[gup].matches[i].away_result;
        if (
          obj.player.groups[gup].matches[i].home_result === resHomeScore &&
          obj.player.groups[gup].matches[i].away_result === resAwayScore
        ) {
          // obj.player.groups[gup].matches[i].score = 3
          totalScore = totalScore + 3;
        } else {
          if (
            Number.isInteger(resHomeScore) === true &&
            Number.isInteger(resAwayScore) === true
          ) {
            if (resHomeScore > resAwayScore) {
              resTeamWin = 1;
            } else if (resHomeScore < resAwayScore) {
              resTeamWin = 2;
            } else if (resHomeScore === resAwayScore) {
              resTeamWin = 0;
            }
          }

          if (
            Number.isInteger(obj.player.groups[gup].matches[i].home_result) &&
            Number.isInteger(obj.player.groups[gup].matches[i].away_result)
          ) {
            if (
              obj.player.groups[gup].matches[i].home_result >
              obj.player.groups[gup].matches[i].away_result
            ) {
              playerTeamWin = 1;
            } else if (
              obj.player.groups[gup].matches[i].home_result <
              obj.player.groups[gup].matches[i].away_result
            ) {
              playerTeamWin = 2;
            } else if (
              obj.player.groups[gup].matches[i].home_result ===
              obj.player.groups[gup].matches[i].away_result
            ) {
              playerTeamWin = 0;
            }
          }
          if (
            Number.isInteger(resTeamWin) &&
            Number.isInteger(playerTeamWin) &&
            resTeamWin === playerTeamWin
          ) {
            // obj.player.groups[gup].matches[i].score = 1
            totalScore = totalScore + 1;
          }
        }
      }
    }
    return totalScore;
  }
}  