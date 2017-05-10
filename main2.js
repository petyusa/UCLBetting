////////////////////////////////////////////////////////////////////////////////////////
// fogadási oldalhoz táblázatok megjelenítése
var elements = document.querySelectorAll('.groups');
var groupName = ["A", "B", "C", "D", "E", "F", "G", "H"]
for (var k = 0; k < elements.length; k++) {
    groups[k].sort(function(a, b){
        if (a.name < b.name) {
            return -1;
        }
        else {
            return 1;
        }
    });
    var groupTitle = document.createElement("caption");
    groupTitle.innerHTML = groupName[k] + " csoport"
    elements[k].appendChild(groupTitle)
    var groupRow = document.createElement("tr");
    groupRow.innerHTML = "<th  colspan='2'>Csapat</th><th>NAT</th><th style='text-align: center'>BAJ</th><th>M</th><th>GY</th><th>D</th><th>V</th><th style='width: 23px'>P</th>";
    elements[k].appendChild(groupRow)
    for (var j = 0; j < groups[k].length; j++){
        var championOrNot = groups[k][j].champion == true ? "★" : "";
        var groupRow = document.createElement("tr");
        groupRow.setAttribute('id', 'group'+ k + j);
        groupRow.setAttribute('class', 'invisibleRow')
        groupRow.innerHTML = "<td><img src=" + groups[k][j].crestUrl + 
        " style='height:20px; display:block; margin: auto'></td><td>" 
        + groups[k][j].name + "</td><td><img src=" + groups[k][j].flag 
        + " style='height:16px; width:22px; display:block; margin: auto'></td><td style='text-align: center'>" 
        + championOrNot  + "</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>";
        elements[k].appendChild(groupRow)
    }
}
////////////////////////////////////////////////////////////////////////////////////////
// fogadási oldalhoz meccsek megjelenítése
var matchesDiv = document.querySelectorAll('.matches')
for (var k = 0; k < 8; k++) {
    for (var j = 0; j < groupMatches[k].length; j++){
        var oddsTeam1 = parseFloat(((1/(groupMatches[k][j][0].uefaCoeff/(groupMatches[k][j][0].uefaCoeff
         + groupMatches[k][j][1].uefaCoeff))).toFixed(2)));
        var oddsTeam2 = parseFloat(((1/(groupMatches[k][j][1].uefaCoeff/(groupMatches[k][j][0].uefaCoeff
         + groupMatches[k][j][1].uefaCoeff))).toFixed(2)));
        var goalsTeam1 = 0;
        var goalsTeam2 = 0;
        var matches = document.createElement("div");
        matches.setAttribute('id', 'match' + k + '_' + j);
        matches.setAttribute('class', 'matchesDiv')
        matches.innerHTML = "<div id='team1Odds" + k + j + "' class='odds oddsLeft'> " + oddsTeam1 + " </div> <div id='matchTeam" + k + '_' + j + "0' class='teamsInMatch'> " + groupMatches[k][j][0].shortName 
        + " </div> <div id='matchResult" + k + '_' + j + "' class='result'> : </div> <div id='matchTeam"
         + k + '_' + j + "1' class='teamsInMatch'> " + groupMatches[k][j][1].shortName + " </div> <div id='team2Odds" + k + j + "' class='odds oddsRight'> " + oddsTeam2 + 
         " </div><input class='betBoxInput' type='number' id='betBox" + k + '_' + j + "' placeholder='tét'><input type='button' value='B' class='betButton' onclick='betting(" + k +"," + j + ")' '>";
        matchesDiv[k].appendChild(matches)
    }
}
///////////////////////////////////////////////////////////////////////////////////
//csapatok kijelölése a csoportkörben
var groupMatchesTeamDiv = document.querySelectorAll(".teamsInMatch");
for (var n = 0; n < groupMatchesTeamDiv.length; n++) {
    groupMatchesTeamDiv[n].addEventListener("click", function() { 
        this.classList.toggle('clicked'); 
    });
}
/////////////////////////////////////////////////////////////////////////////////
// user életkor ellenőrzés
var loginBtn = document.getElementById('loginBtn');
var dateInput = document.getElementById('birthDate');
var loginBox = document.querySelector('.login');
loginBtn.addEventListener('click', getAge);
var age;
function getAge() {
    var today = new Date();
    var userBirthDate = new Date(document.getElementById('birthDate').value);
    age = today.getFullYear() - userBirthDate.getFullYear();
    var m = today.getMonth() - userBirthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < userBirthDate.getDate())) {
        age--;
    }
    if ((age < 18) || userBirthDate == "Invalid Date") {
        dateInput.classList.add('errorInput')
    }
    else {
        login()
    }
}
/////////////////////////////////////////////////////////////////////////////////
// user felvétele és megjelenítése
var user = {};
var userDiv = document.querySelector('.user');
var userContainer = document.querySelector('.userContainer');
var userName = document.createElement('div');
var userBankroll = document.createElement('div');
var userWinnigs = document.createElement('div');
var userBets = document.createElement('div');
var userAllBets = document.createElement('div');
function login(){
    user.name = document.getElementById('userName').value;
    user.age = document.getElementById('birthDate').value;
    user.bankroll = document.getElementById('bankroll').value;
    user.startBankroll = document.getElementById('bankroll').value;
    user.winnings = 0;
    if (user.name == "") {
        document.getElementById('userName').classList.add('errorInput');
        document.getElementById('userName').innerHTML = "Név megadása kötelező"
    }
    else if(user.bankroll == "") {
        document.getElementById('bankroll').classList.add('errorInput');
    }
    else{
        userName.setAttribute('class', 'userData');
        userName.innerHTML = user.name;
        userContainer.appendChild(userName);
        userBankroll.setAttribute('class', 'userData');
        userBankroll.setAttribute('id', 'userBankrollDiv');
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
        userWinnigs.setAttribute('class', 'userData');
        userWinnigs.setAttribute('id', 'userWinningsDiv');
        userWinnigs.innerHTML = 'Nyeremény: ' + user.winnings + "Ft";
        userContainer.appendChild(userWinnigs);
        loginBox.style.display = 'none';
        userDiv.style.display = 'block';
    }
}
/////////////////////////////////////////////////////////////////////////////////////////
// Fogadás a csoportmeccsekre
var bets = [];
var groupNames = ["A","B","C","D","E","F","G","H"];
var matchNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var allWinnings = 0;
function betting(i, k){
    var team1 = document.querySelector('#matchTeam' + i +'_' + k + '0');
    var team2 = document.querySelector('#matchTeam' + i +'_' + k + '1');
    var odds1 = parseFloat(document.querySelector('#team1Odds' + i + k +'').innerHTML);
    var odds2 = parseFloat(document.querySelector('#team2Odds' + i + k +'').innerHTML);
    betAmount = parseInt(document.querySelector('#betBox' + i + '_' + k + '').value);
    if (team1.getAttribute('class') === "teamsInMatch clicked" && team2.getAttribute('class') === "teamsInMatch clicked") {
        alert('Csak az egyik csapatra fogadhatsz!');
    }
    else if (team1.getAttribute('class') === "teamsInMatch" && team2.getAttribute('class') === "teamsInMatch") {
        alert('Jelölj ki egy csapatot a fogadáshoz!');
    }
    else if ((user.bankroll - betAmount) < 0){
        alert("Nem áll rendelkezésedre ekkora összeg!")
    }
    else if (betAmount !== betAmount){
        alert("Add meg a fogadási összeget!")
    }
    else {
        if (team1.getAttribute('class') === "teamsInMatch clicked" && team2.getAttribute('class') !== "teamsInMatch clicked"){
            bets.push({groupName: groupName[i], groupNum: i, matchName : matchNums[k], matchNum : k, teamNum: 0, teamName: team1.innerHTML, EV: parseInt(odds1*betAmount), betAmount: betAmount, matchID : i+""+k});
        }
        else if (team2.getAttribute('class') === "teamsInMatch clicked" && team1.getAttribute('class') !== "teamsInMatch clicked"){
            bets.push({groupName: groupName[i], groupNum: i, matchName : matchNums[k], matchNum : k, teamNum: 1, teamName: team2.innerHTML, EV: parseInt(odds2*betAmount), betAmount: betAmount, matchID : i+""+k});
        }
        userBets.innerHTML = "";
        user.bankroll -= betAmount;
        allWinnings = 0;
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
            for (var h =0; h < bets.length; h++){
                allWinnings += bets[h].EV
                userBets.setAttribute('class', 'userData')
                userBets.innerHTML += bets[h].groupName + "/" + bets[h].matchName + " "+ bets[h].teamName + "<br>várható nyeremény: " + bets[h].EV + "Ft<br><br>";
                userContainer.appendChild(userBets);
                userAllBets.setAttribute('class', 'userData')
                userAllBets.innerHTML = "Össz várható nyeremény: " + allWinnings + "Ft<br>";
                userContainer.appendChild(userAllBets);
            }
    }
}
////////////////////////////////////////////////////////////////////////////////
// Utolsó fogadás törlése
function deleteLast(last){
    user.bankroll += last[last.length-1].betAmount;
    allWinnings -= last[last.length-1].EV;
    last.pop();
    userBets.innerHTML = "";
    userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
    userContainer.appendChild(userBankroll);
    for (var h =0; h < last.length; h++){
                userBets.setAttribute('class', 'userData')
                userBets.innerHTML += last[h].groupName + "/" + last[h].matchName + " "+ last[h].teamName + "<br>várható nyeremény: " + last[h].EV + "Ft<br><br>";
                userContainer.appendChild(userBets);
            }
    userAllBets.innerHTML = "Össz várható nyeremény: " + allWinnings + "Ft<br>";
    userContainer.appendChild(userAllBets);
}
////////////////////////////////////////////////////////////////////////////////
// meccsek szimulásása
var matchesA = document.getElementById('matches0')
var resultsA = matchesA.querySelectorAll('.result')
var matchesB = document.getElementById('matches1')
var resultsB = matchesB.querySelectorAll('.result')
var matchesC = document.getElementById('matches2')
var resultsC = matchesC.querySelectorAll('.result')
var matchesD = document.getElementById('matches3')
var resultsD = matchesD.querySelectorAll('.result')
var matchesE = document.getElementById('matches4')
var resultsE = matchesE.querySelectorAll('.result')
var matchesF = document.getElementById('matches5')
var resultsF = matchesF.querySelectorAll('.result')
var matchesG = document.getElementById('matches6')
var resultsG = matchesG.querySelectorAll('.result')
var matchesH = document.getElementById('matches7')
var resultsH = matchesH.querySelectorAll('.result')

var groupWinners = [];
var groupRunnerUps = [];
function simulation() {
    for (var i = 0; i < teams.length; i++){
            teams[i].wins = 0;
            teams[i].matches = 0;
    }
    for (var m = 0; m < resultsA.length; m++) {
        for (var i =0; i < teams.length; i++){
            if ((groupMatches[0][m][0].name.indexOf(teams[i].name) > -1) || (groupMatches[0][m][1].name.indexOf(teams[i].name) > -1)){
                teams[i].matches += 1;
            }
        }
        var team1pont = (groupMatches[0][m][0].uefaCoeff * (Math.random() * 10) +4);
        var team2pont = (groupMatches[0][m][1].uefaCoeff * (Math.random() * 10) +4);
        if (team1pont >= team2pont) {
                    var diff = team1pont - team2pont;
                    var goalsTeam1 = Math.floor(1 + Math.floor(diff/200));
                    var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i =0; i < teams.length; i++){
                        if (groupMatches[0][m][0].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                        }
                    }
        }
        else {
                    var diff = team2pont - team1pont;
                    var goalsTeam2 = Math.floor(1 + Math.floor(diff/200));
                    var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i  =0; i < teams.length; i++){
                        if (groupMatches[0][m][1].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                        }
                    }
        }
        resultsA[m].innerHTML = "";
        var resultDiv = document.createElement("div");
        resultDiv.innerHTML = "<div id='goalsTeamGroup0" + m + "0' class='goals'>" + goalsTeam1 + "</div> : <div id='goalsTeamGroup0" + m + "1' class='goals'>" + goalsTeam2 + "</div>";
        resultsA[m].appendChild(resultDiv)
    }
    for (var m = 0; m < resultsB.length; m++) {
        for (var i =0; i < teams.length; i++){
            if ((groupMatches[1][m][0].name.indexOf(teams[i].name) > -1) || (groupMatches[1][m][1].name.indexOf(teams[i].name) > -1)){
                teams[i].matches += 1;
            }
        }
        var team1pont = (groupMatches[1][m][0].uefaCoeff * (Math.random() * 10) +4);
        var team2pont = (groupMatches[1][m][1].uefaCoeff * (Math.random() * 10) +4);
        if (team1pont > team2pont) {
                    var diff = team1pont - team2pont
                    var goalsTeam1 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i =0; i < teams.length; i++){
                        if (groupMatches[1][m][0].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[1][m][0].winner = true;
                        }
                    }
        }
        else {
                    var diff = team2pont - team1pont
                    var goalsTeam2 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i  =0; i < teams.length; i++){
                        if (groupMatches[1][m][1].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[1][m][1].winner = true;
                        }
                    }
        }
        resultsB[m].innerHTML = "";
        var resultDiv = document.createElement("div");
        resultDiv.innerHTML = "<div id='goalsTeamGroup1" + m + "0' class='goals'>" + goalsTeam1 + "</div> : <div id='goalsTeamGroup1" + m + "1' class='goals'>" + goalsTeam2 + "</div>";
        resultsB[m].appendChild(resultDiv)
    }
    for (var m = 0; m < resultsC.length; m++) {
        for (var i =0; i < teams.length; i++){
            if ((groupMatches[2][m][0].name.indexOf(teams[i].name) > -1) || (groupMatches[2][m][1].name.indexOf(teams[i].name) > -1)){
                teams[i].matches += 1;
            }
        }
        var team1pont = (groupMatches[2][m][0].uefaCoeff * (Math.random() * 10) +4);
        var team2pont = (groupMatches[2][m][1].uefaCoeff * (Math.random() * 10) +4);
        if (team1pont > team2pont) {
                    var diff = team1pont - team2pont
                    var goalsTeam1 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i =0; i < teams.length; i++){
                        if (groupMatches[2][m][0].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[2][m][0].winner = true;
                        }
                    }
        }
        else {
                    var diff = team2pont - team1pont
                    var goalsTeam2 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i  =0; i < teams.length; i++){
                        if (groupMatches[2][m][1].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[2][m][1].winner = true;
                        }
                    }
        }
        resultsC[m].innerHTML = "";
        var resultDiv = document.createElement("div");
        resultDiv.innerHTML = "<div id='goalsTeamGroup2" + m + "0' class='goals'>" + goalsTeam1 + "</div> : <div id='goalsTeamGroup2" + m + "1' class='goals'>" + goalsTeam2 + "</div>";
        resultsC[m].appendChild(resultDiv)
    }
    for (var m = 0; m < resultsD.length; m++) {
        for (var i =0; i < teams.length; i++){
            if ((groupMatches[3][m][0].name.indexOf(teams[i].name) > -1) || (groupMatches[3][m][1].name.indexOf(teams[i].name) > -1)){
                teams[i].matches += 1;
            }
        }
        var team1pont = (groupMatches[3][m][0].uefaCoeff * (Math.random() * 10) +4);
        var team2pont = (groupMatches[3][m][1].uefaCoeff * (Math.random() * 10) +4);
        if (team1pont > team2pont) {
                    var diff = team1pont - team2pont
                    var goalsTeam1 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i =0; i < teams.length; i++){
                        if (groupMatches[3][m][0].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[3][m][0].winner = true;
                        }
                    }
        }
        else {
                    var diff = team2pont - team1pont
                    var goalsTeam2 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i  =0; i < teams.length; i++){
                        if (groupMatches[3][m][1].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[3][m][1].winner = true;
                        }
                    }
        }
        resultsD[m].innerHTML = "";
        var resultDiv = document.createElement("div");
        resultDiv.innerHTML = "<div id='goalsTeamGroup3" + m + "0' class='goals'>" + goalsTeam1 + "</div> : <div id='goalsTeamGroup3" + m + "1' class='goals'>" + goalsTeam2 + "</div>";
        resultsD[m].appendChild(resultDiv)
    }
    for (var m = 0; m < resultsE.length; m++) {
        for (var i =0; i < teams.length; i++){
            if ((groupMatches[4][m][0].name.indexOf(teams[i].name) > -1) || (groupMatches[4][m][1].name.indexOf(teams[i].name) > -1)){
                teams[i].matches += 1;
            }
        }
        var team1pont = (groupMatches[4][m][0].uefaCoeff * (Math.random() * 10) +4);
        var team2pont = (groupMatches[4][m][1].uefaCoeff * (Math.random() * 10) +4);
        if (team1pont > team2pont) {
                    var diff = team1pont - team2pont
                    var goalsTeam1 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i =0; i < teams.length; i++){
                        if (groupMatches[4][m][0].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[4][m][0].winner = true;
                        }
                    }
        }
        else {
                    var diff = team2pont - team1pont
                    var goalsTeam2 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i  =0; i < teams.length; i++){
                        if (groupMatches[4][m][1].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[4][m][1].winner = true;
                        }
                    }
        }
        resultsE[m].innerHTML = "";
        var resultDiv = document.createElement("div");
        resultDiv.innerHTML = "<div id='goalsTeamGroup4" + m + "0' class='goals'>" + goalsTeam1 + "</div> : <div id='goalsTeamGroup4" + m + "1' class='goals'>" + goalsTeam2 + "</div>";
        resultsE[m].appendChild(resultDiv)
    }
    for (var m = 0; m < resultsF.length; m++) {
        for (var i =0; i < teams.length; i++){
            if ((groupMatches[5][m][0].name.indexOf(teams[i].name) > -1) || (groupMatches[5][m][1].name.indexOf(teams[i].name) > -1)){
                teams[i].matches += 1;
            }
        }
        var team1pont = (groupMatches[5][m][0].uefaCoeff * (Math.random() * 10) +4);
        var team2pont = (groupMatches[5][m][1].uefaCoeff * (Math.random() * 10) +4);
        if (team1pont > team2pont) {
                    var diff = team1pont - team2pont
                    var goalsTeam1 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i =0; i < teams.length; i++){
                        if (groupMatches[5][m][0].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[5][m][0].winner = true;
                        }
                    }
        }
        else {
                    var diff = team2pont - team1pont
                    var goalsTeam2 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i  =0; i < teams.length; i++){
                        if (groupMatches[5][m][1].name.indexOf(teams[i].name) > -1){
                           teams[i].wins += 1;
                           groupMatches[5][m][1].winner = true;
                        }
                    }
        }
        resultsF[m].innerHTML = "";
        var resultDiv = document.createElement("div");
        resultDiv.innerHTML = "<div id='goalsTeamGroup5" + m + "0' class='goals'>" + goalsTeam1 + "</div> : <div id='goalsTeamGroup5" + m + "1' class='goals'>" + goalsTeam2 + "</div>";
        resultsF[m].appendChild(resultDiv)
    }
    for (var m = 0; m < resultsG.length; m++) {
        for (var i =0; i < teams.length; i++){
            if ((groupMatches[6][m][0].name.indexOf(teams[i].name) > -1) || (groupMatches[6][m][1].name.indexOf(teams[i].name) > -1)){
                teams[i].matches += 1;
            }
        }
        var team1pont = (groupMatches[6][m][0].uefaCoeff * (Math.random() * 10) +4);
        var team2pont = (groupMatches[6][m][1].uefaCoeff * (Math.random() * 10) +4);
        if (team1pont > team2pont) {
                    var diff = team1pont - team2pont
                    var goalsTeam1 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i =0; i < teams.length; i++){
                        if (groupMatches[6][m][0].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                        }
                    }
        }
        else {
                    var diff = team2pont - team1pont
                    var goalsTeam2 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i  =0; i < teams.length; i++){
                        if (groupMatches[6][m][1].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                        }
                    }
        }
        resultsG[m].innerHTML = "";
        var resultDiv = document.createElement("div");
        resultDiv.innerHTML = "<div id='goalsTeamGroup6" + m + "0' class='goals'>" + goalsTeam1 + "</div> : <div id='goalsTeamGroup6" + m + "1' class='goals'>" + goalsTeam2 + "</div>";
        resultsG[m].appendChild(resultDiv)
    }
    for (var m = 0; m < resultsH.length; m++) {
        for (var i =0; i < teams.length; i++){
            if ((groupMatches[7][m][0].name.indexOf(teams[i].name) > -1) || (groupMatches[7][m][1].name.indexOf(teams[i].name) > -1)){
                teams[i].matches += 1;
            }
        }
        var team1pont = (groupMatches[7][m][0].uefaCoeff * (Math.random() * 10) +4);
        var team2pont = (groupMatches[7][m][1].uefaCoeff * (Math.random() * 10) +4);
        if (team1pont > team2pont) {
                    var diff = team1pont - team2pont
                    var goalsTeam1 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i =0; i < teams.length; i++){
                        if (groupMatches[7][m][0].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[7][m][0].winner = true;
                        }
                    }
        }
        else {
                    var diff = team2pont - team1pont
                    var goalsTeam2 = Math.floor(1 + Math.floor(diff/200))
                    var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                    for (var i  =0; i < teams.length; i++){
                        if (groupMatches[7][m][1].name.indexOf(teams[i].name) > -1){
                            teams[i].wins += 1;
                            groupMatches[7][m][1].winner = true;
                        }
                    }
        }
        resultsH[m].innerHTML = "";
        var resultDiv = document.createElement("div");
        resultDiv.innerHTML = "<div id='goalsTeamGroup7" + m + "0' class='goals'>" + goalsTeam1 + "</div> : <div id='goalsTeamGroup7" + m + "1' class='goals'>" + goalsTeam2 + "</div>";
        resultsH[m].appendChild(resultDiv)
    }
    ////////////////////////////////////////////////////
    // csoporteredmények kiírása
    for (var k = 0; k < elements.length; k++) {
        elements[k].innerHTML = "";
        var groupTitle = document.createElement("caption");
        groupTitle.innerHTML = groupName[k] + " csoport"
        elements[k].appendChild(groupTitle)
        var groupRow = document.createElement("tr");
        groupRow.innerHTML = "<th  colspan='2'>Csapat</th><th>NAT</th><th style='text-align: center'>BAJ</th><th>M</th><th>GY</th><th>D</th><th>V</th><th style='width: 20px'>P</th>";
        elements[k].appendChild(groupRow)
        groups[k].sort(function(a, b){
                if (a.wins > b.wins) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        for (var j = 0; j < groups[k].length; j++){
            groupWinners[k] = [groups[k][0]];
            groupRunnerUps[k] = [groups[k][1]];
            var championOrNot = groups[k][j].champion == true ? "★" : "";
            var groupRow = document.createElement("tr");
            groupRow.setAttribute('id', 'group'+ k + j);
            groupRow.innerHTML = "<td><img src=" + groups[k][j].crestUrl + 
            " style='height:20px; display:block; margin: auto'></td><td style='width: 179px' id='team"+k+j+"'>" 
            + groups[k][j].name + "</td><td><img src=" + groups[k][j].flag 
            + " style='height:16px; width:22px; display:block; margin: auto'></td><td style='text-align: center'>" 
            + championOrNot  + "</td><td>" + groups[k][j].matches + "</td><td>" + groups[k][j].wins + "</td><td>0</td><td>" + (groups[k][j].matches - groups[k][j].wins)  + "</td><td>" + groups[k][j].wins*3 + "</td>";
            elements[k].appendChild(groupRow)
        }
    }
    showBest16()
    checkWinningsGroups()
}
////////////////////////////////////////////////////////////////////////////////////////
// Fogadások eredménye a csoportkörben
var winnings = 0;
function checkWinningsGroups(){
    if (bets.length > 0){
        for (var i =0; i < bets.length; i++){
            var betTeam1Goals = document.querySelector('#goalsTeamGroup' + bets[i].matchID + '0');
            var betTeam2Goals = document.querySelector('#goalsTeamGroup' + bets[i].matchID + '1');
            if (parseInt(betTeam1Goals.innerHTML) > parseInt(betTeam2Goals.innerHTML)){
                if (bets[i].teamNum == 0){
                    winnings += bets[i].EV
                }
            }
            else {
                if (bets[i].teamNum == 1){
                    winnings += bets[i].EV
                }
            }
        }
        userBets.innerHTML = "";
        userAllBets.innerHTML = "";
        user.bankroll += winnings;
        allWinnings = 0;
        user.winnings = user.bankroll - user.startBankroll;
        userWinnigs.innerHTML = 'Nyeremény: ' + user.winnings + "Ft";
        userContainer.appendChild(userWinnigs);
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
    }
}
////////////////////////////////////////////////////////////////////////////////////////
// csapatokk összekeverése
function shuffleTeams(array) {
    var counter = array.length;
    while (counter > 0) {
        var index = Math.floor(Math.random() * counter);
        counter--;
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}
///////////////////////////////////////////////////////////////////////////////////////
// Nyolcaddöntők kiírása
var best16 = document.querySelector('#best16');
function showBest16(){
    best16.innerHTML = "<h2 style='display: inline-block;margin-left: 10px'>Nyolcad-döntő</h2><input type='button' class='simulateBtn' value='Szimuláció' onclick='simulateBest16()'><br>";
    best16.classList.remove('.opaciNull')
    best16.classList.add('fade');
    shuffleTeams(groupWinners);
    shuffleTeams(groupRunnerUps);
    for (var j = 0; j < groupWinners.length; j++){
        var best16TeamsDiv = document.createElement("div");
        var oddsTeam1 = parseFloat(((1/(groupWinners[j][0].uefaCoeff/(groupWinners[j][0].uefaCoeff
         + groupRunnerUps[j][0].uefaCoeff))).toFixed(2)));
        var oddsTeam2 = parseFloat(((1/(groupRunnerUps[j][0].uefaCoeff/(groupWinners[j][0].uefaCoeff
         + groupRunnerUps[j][0].uefaCoeff))).toFixed(2)));
        best16TeamsDiv.setAttribute('class', 'best16Teams');
        best16TeamsDiv.innerHTML = "<div class='oddsLeftBest16' id='team1Oddsbest16"+ j +"0'>" + oddsTeam1 + "</div><div class='best16Logo'><img src='" +
         groupWinners[j][0].crestUrl + "' style='height:20px; margin: auto'></div><div id='best16" + j + "0' class='best16Team1'> " + 
        groupWinners[j][0].name + " </div><div class='resultBest16'> : </div><div class='best16Team2' id='best16" + j + "1'> " + 
        groupRunnerUps[j][0].name + " </div><div class='best16Logo'><img src=" + groupRunnerUps[j][0].crestUrl + 
        " style='height:20px; margin: auto'></div><div class='oddsRightBest16' id='team2Oddsbest16"+ j +"1'> " + oddsTeam2 + 
        " </div><input class='betBoxInput' type='number' id='betBoxBest16" + j + "' placeholder='tét'><input type='button' value='B' class='betButton' onclick='bettingBest16("+ j +")'>";
        best16.appendChild(best16TeamsDiv)
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //csapatok kijelölése a nyolcaddöntőben
    var best16Matches1 = document.querySelectorAll(".best16Team1");
    var best16Matches2 = document.querySelectorAll(".best16Team2");
    for (var n = 0; n < best16Matches1.length; n++) {
        best16Matches1[n].addEventListener("click", function() { 
            this.classList.toggle('clicked'); 
        });
        best16Matches2[n].addEventListener("click", function() { 
            this.classList.toggle('clicked'); 
        });
    }
}
/////////////////////////////////////////////////////////////////////////////////////////
// Fogadás a nyolcaddöntőkre
var matchNumsBest16 = [1, 2, 3, 4, 5, 6, 7, 8];
var allWinnings = 0;
var betsBest16 = [];
function bettingBest16(i){
    var team1 = document.querySelector('#best16' + i +'0');
    var team2 = document.querySelector('#best16' + i +'1');
    var odds1 = parseFloat(document.querySelector('#team1Oddsbest16'+ i +'0').innerHTML);
    var odds2 = parseFloat(document.querySelector('#team2Oddsbest16'+ i +'1').innerHTML);
    var betAmountBest16 = parseInt(document.querySelector('#betBoxBest16' + i + '').value);
    if (team1.getAttribute('class') === "best16Team1 clicked" && team2.getAttribute('class') === "best16Team2 clicked") {
        alert('Csak az egyik csapatra fogadhatsz!');
    }
    else if (team1.getAttribute('class') === "best16Team1" && team2.getAttribute('class') === "best16Team2") {
        alert('Jelölj ki egy csapatot a fogadáshoz!');
    }
    else if ((user.bankroll - betAmountBest16) < 0){
        alert("Nem áll rendelkezésedre ekkora összeg!")
    }
    else if (betAmountBest16 !== betAmountBest16){
        alert("Add meg a fogadási összeget!")
    }
    else {
        if (team1.getAttribute('class') === "best16Team1 clicked" && team2.getAttribute('class') !== "best16Team2 clicked"){
            betsBest16.push({matchNum: i, matchName: matchNumsBest16[i], teamNum: 0, teamName: team1.innerHTML, EV: parseInt(odds1*betAmountBest16), betAmount: betAmountBest16, matchID : i});
        }
        else if (team2.getAttribute('class') === "best16Team2 clicked" && team1.getAttribute('class') !== "best16Team1 clicked"){
            betsBest16.push({matchNum: i, matchName: matchNumsBest16[i], teamNum: 1, teamName: team2.innerHTML, EV: parseInt(odds2*betAmountBest16), betAmount: betAmountBest16, matchID : i});
        }
        userBets.innerHTML = "";
        user.bankroll -= betAmountBest16;
        allWinnings = 0;
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
            for (var h =0; h < betsBest16.length; h++){
                allWinnings += betsBest16[h].EV
                userBets.setAttribute('class', 'userData')
                userBets.innerHTML += betsBest16[h].matchName + ". nyolcaddöntő "+ betsBest16[h].teamName + "<br>várható nyeremény: " + betsBest16[h].EV + "Ft<br><br>";
                userContainer.appendChild(userBets);
                userAllBets.setAttribute('class', 'userData')
                userAllBets.innerHTML = "Össz várható nyeremény: " + allWinnings + "Ft<br>";
                userContainer.appendChild(userAllBets);
            }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Fogadások eredménye a nyolcaddöntőben
function checkWinningsBest16(){
    var winningsBest16 = 0;
    if (betsBest16.length > 0) {
        for (var i =0; i < betsBest16.length; i++){
            var betTeam1Goals = document.querySelector('#goalsTeamBest16' + betsBest16[i].matchID + '0');
            var betTeam2Goals = document.querySelector('#goalsTeamBest16' + betsBest16[i].matchID + '1');
            if (parseInt(betTeam1Goals.innerHTML) > parseInt(betTeam2Goals.innerHTML)){
                if (betsBest16[i].teamNum == 0){
                    winningsBest16 += betsBest16[i].EV
                }
            }
            else {
                if (betsBest16[i].teamNum == 1){
                    winningsBest16 += betsBest16[i].EV
                }
            }
        }
        userBets.innerHTML = "";
        userAllBets.innerHTML = "";
        user.bankroll += winningsBest16;
        allWinnings = 0;
        user.winnings = user.bankroll - user.startBankroll;
        userWinnigs.innerHTML = 'Nyeremény: ' + user.winnings + "Ft";
        userContainer.appendChild(userWinnigs);
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
    }
}

///////////////////////////////////////////////////////////////////////////////////
// Best16 szimulation
var matchesBest16 = "";
var resultsBest16 = [];
var best16Winners = [];
function simulateBest16(){
    var matchesBest16 = document.getElementById('best16');
    var resultsBest16 = matchesBest16.querySelectorAll('.resultBest16')
    best16Winners = [];
    for (var m = 0; m < groupWinners.length; m++) {
            var team1pont = (groupWinners[m][0].uefaCoeff * (Math.random() * 10) +4);
            var team2pont = (groupRunnerUps[m][0].uefaCoeff * (Math.random() * 10) +4);
            if (team1pont >= team2pont) {
                        var diff = team1pont - team2pont;
                        var goalsTeam1 = Math.floor(1 + Math.floor(diff/200));
                        var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                        best16Winners.push(groupWinners[m][0]);
            }
            else {
                        var diff = team2pont - team1pont;
                        var goalsTeam2 = Math.floor(1 + Math.floor(diff/200));
                        var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                        best16Winners.push(groupRunnerUps[m][0]);
            }
            resultsBest16[m].innerHTML = "";
            var resultsBest16Div = document.createElement("div");
            resultsBest16Div.innerHTML = " <div id='goalsTeamBest16" + m + "0' class='goals'> " + goalsTeam1 + " </div> : <div id='goalsTeamBest16" + m + "1' class='goals'> " + goalsTeam2 + " </div> ";
            resultsBest16[m].appendChild(resultsBest16Div)
    }
    checkWinningsBest16();
    showBest8();
}
///////////////////////////////////////////////////////////////////////////////////////
// Negyed-döntők kiírása
var best8 = document.querySelector('#best8');
function showBest8(){
    shuffleTeams(best16Winners);
    best8.classList.remove('.opaciNull')
    best8.classList.add('fade');
    best8.innerHTML = "<h2 style='display: inline-block; margin-left: 10px'>Negyed-döntő</h2><input type='button' class='simulateBtn' value='Szimuláció' onclick='simulateBest8()'><br>";
    for (var j = 0; j < 4; j++){
        var best8TeamsDiv = document.createElement("div");
        var oddsTeam1 = parseFloat(((1/(best16Winners[j*2].uefaCoeff/(best16Winners[j*2].uefaCoeff
         + best16Winners[j*2+1].uefaCoeff))).toFixed(2)));
        var oddsTeam2 = parseFloat(((1/(best16Winners[j*2+1].uefaCoeff/(best16Winners[j*2+1].uefaCoeff
         + best16Winners[j*2].uefaCoeff))).toFixed(2)));
        best8TeamsDiv.setAttribute('class', 'best16Teams');
        best8TeamsDiv.innerHTML = "<div class='oddsLeftBest8' id='team1Oddsbest8"+j+"0'>" + oddsTeam1 + "</div><div class='best16Logo'><img src='" + 
        best16Winners[j*2].crestUrl + "' style='height:20px; margin: auto'></div><div id='best8" + j + "0' class='best8Team1'> " + 
        best16Winners[j*2].name + " </div><div class='resultBest8'> : </div><div id='best8" + j + "1' class='best8Team2'> " + 
        best16Winners[j*2+1].name + " </div><div class='best16Logo'><img src=" + best16Winners[j*2+1].crestUrl + 
        " style='height:20px; margin: auto'></div><div class='oddsRightBest8' id='team2Oddsbest8"+j+"1'> " + oddsTeam2 + 
        " </div><input class='betBoxInput' type='number' id='betBoxBest8" + j + "' placeholder='tét'><input type='button' value='B' class='betButton' onclick='bettingBest8("+ j +")'>";
        best8.appendChild(best8TeamsDiv)
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //csapatok kijelölése a negyed-döntőben
    var best8Matches1 = document.querySelectorAll(".best8Team1");
    var best8Matches2 = document.querySelectorAll(".best8Team2");
    for (var n = 0; n < best8Matches1.length; n++) {
        best8Matches1[n].addEventListener("click", function() { 
            this.classList.toggle('clicked'); 
        });
        best8Matches2[n].addEventListener("click", function() { 
            this.classList.toggle('clicked'); 
        });
    }
    
}
/////////////////////////////////////////////////////////////////////////////////////////
// Fogadás a negyeddöntőkre
var matchNumsBest8 = [1, 2, 3, 4];
var betsBest8 = [];
function bettingBest8(i){

    bets = [];
    var team1 = document.querySelector('#best8' + i +'0');
    var team2 = document.querySelector('#best8' + i +'1');
    var odds1 = parseFloat(document.querySelector('#team1Oddsbest8'+ i +'0').innerHTML);
    var odds2 = parseFloat(document.querySelector('#team2Oddsbest8'+ i +'1').innerHTML);
    var betAmountBest8 = parseInt(document.querySelector('#betBoxBest8' + i + '').value);
    if (team1.getAttribute('class') === "best4Team1 clicked" && team2.getAttribute('class') === "best4Team2 clicked") {
        alert('Csak az egyik csapatra fogadhatsz!');
    }
    else if (team1.getAttribute('class') === "best8Team1" && team2.getAttribute('class') === "best8Team2") {
        alert('Jelölj ki egy csapatot a fogadáshoz!');
    }
    else if ((user.bankroll - betAmountBest8) < 0){
        alert("Nem áll rendelkezésedre ekkora összeg!")
    }
    else if (betAmountBest8 !== betAmountBest8){
        alert("Add meg a fogadási összeget!")
    }
    else {
        if (team1.getAttribute('class') === "best8Team1 clicked" && team2.getAttribute('class') !== "best8Team2 clicked"){
            betsBest8.push({matchNum: i, matchName: matchNumsBest8[i], teamNum: 0, teamName: team1.innerHTML, EV: parseInt(odds1*betAmountBest8), betAmount: betAmountBest8, matchID : i});
        }
        else if (team2.getAttribute('class') === "best8Team2 clicked" && team1.getAttribute('class') !== "best8Team1 clicked"){
            betsBest8.push({matchNum: i, matchName: matchNumsBest8[i], teamNum: 1, teamName: team2.innerHTML, EV: parseInt(odds2*betAmountBest8), betAmount: betAmountBest8, matchID : i});
        }
        userBets.innerHTML = "";
        user.bankroll -= betAmountBest8;
        allWinnings = 0;
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
            for (var h =0; h < betsBest8.length; h++){
                allWinnings += betsBest8[h].EV
                userBets.setAttribute('class', 'userData')
                userBets.innerHTML += betsBest8[h].matchName + ". negyed-döntő "+ betsBest8[h].teamName + "<br>várható nyeremény: " + betsBest8[h].EV + "Ft<br><br>";
                userContainer.appendChild(userBets);
                userAllBets.setAttribute('class', 'userData')
                userAllBets.innerHTML = "Össz várható nyeremény: " + allWinnings + "Ft<br>";
                userContainer.appendChild(userAllBets);
            }
    }
}
///////////////////////////////////////////////////////////////////////////////////
// Best8 szimulation
var matchesBest8 = "";
var resultsBest8 = [];
var best8Winners = [];
function simulateBest8(){
    var matchesBest8 = document.getElementById('best8');
    var resultsBest8 = matchesBest8.querySelectorAll('.resultBest8')
    best8Winners = [];
    for (var m = 0; m < 4; m++) {
            var team1pont = (best16Winners[m*2].uefaCoeff * (Math.random() * 10) +4);
            var team2pont = (best16Winners[m*2+1].uefaCoeff * (Math.random() * 10) +4);
            if (team1pont >= team2pont) {
                        var diff = team1pont - team2pont;
                        var goalsTeam1 = Math.floor(1 + Math.floor(diff/200));
                        var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                        best8Winners.push(best16Winners[m*2]);
            }
            else {
                        var diff = team2pont - team1pont;
                        var goalsTeam2 = Math.floor(1 + Math.floor(diff/200));
                        var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                        best8Winners.push(best16Winners[m*2+1]);
            }
            resultsBest8[m].innerHTML = "";
            var resultsBest8Div = document.createElement("div");
            resultsBest8Div.innerHTML = " <div id='goalsTeamBest8" + m + "0' class='goals'> " + goalsTeam1 + " </div> : <div id='goalsTeamBest8" + m + "1' class='goals'> " + goalsTeam2 + " </div> ";
            resultsBest8[m].appendChild(resultsBest8Div)
    }
    showBest4();
    checkWinningsBest8()
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Fogadások eredménye a negyeddöntőben
function checkWinningsBest8(){
    var winningsBest8 = 0;
    if (betsBest8.length > 0) {
        for (var i =0; i < betsBest8.length; i++){
            var betTeam1Goals = document.querySelector('#goalsTeamBest8' + betsBest8[i].matchID + '0');
            var betTeam2Goals = document.querySelector('#goalsTeamBest8' + betsBest8[i].matchID + '1');
            if (parseInt(betTeam1Goals.innerHTML) > parseInt(betTeam2Goals.innerHTML)){
                if (betsBest8[i].teamNum == 0){
                    winningsBest8 += betsBest8[i].EV
                }
            }
            else {
                if (betsBest8[i].teamNum == 1){
                    winningsBest8 += betsBest8[i].EV
                }
            }
        }
        userBets.innerHTML = "";
        userAllBets.innerHTML = "";
        user.bankroll += winningsBest8;
        allWinnings = 0;
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
        user.winnings = user.bankroll - user.startBankroll;
        userWinnigs.innerHTML = 'Nyeremény: ' + user.winnings + "Ft";
        userContainer.appendChild(userWinnigs);
    }
}
///////////////////////////////////////////////////////////////////////////////////////
// Elő-döntők kiírása
var best4 = document.querySelector('#best4');
function showBest4(){
    shuffleTeams(best8Winners);
    best4.classList.remove('.opaciNull')
    best4.classList.add('fade');
    best4.innerHTML = "<h2 style='display: inline-block; margin-left: 10px'>Elő-döntő</h2><input type='button' value='Szimuláció' class='simulateBtn' onclick='simulateBest4()'><br>";
    for (var j = 0; j < 2; j++){
        var best4TeamsDiv = document.createElement("div");
        var oddsTeam1 = parseFloat(((1/(best8Winners[j*2].uefaCoeff/(best8Winners[j*2].uefaCoeff
         + best8Winners[j*2+1].uefaCoeff))).toFixed(2)));
        var oddsTeam2 = parseFloat(((1/(best8Winners[j*2+1].uefaCoeff/(best8Winners[j*2+1].uefaCoeff
         + best8Winners[j*2].uefaCoeff))).toFixed(2)));
        best4TeamsDiv.setAttribute('class', 'best16Teams');
        best4TeamsDiv.innerHTML = "<div class='oddsLeftBest4' id='team1Oddsbest4"+j+"0'>" + oddsTeam1 + "</div><div class='best16Logo'><img src='" + 
        best8Winners[j*2].crestUrl + "' style='height:20px; margin: auto'></div><div id='best4" + j + "0' class='best4Team1'> " + 
        best8Winners[j*2].name + " </div><div class='resultBest4'> : </div><div id='best4" + j + "1' class='best4Team2'> " + 
        best8Winners[j*2+1].name + " </div><div class='best16Logo'><img src=" + best8Winners[j*2+1].crestUrl + 
        " style='height:20px; margin: auto'></div><div class='oddsRightBest4' id='team2Oddsbest4"+j+"1'> " + oddsTeam2 + 
        " </div><input class='betBoxInput' type='number' id='betBoxBest4" + j + "' placeholder='tét'><input type='button' value='B' class='betButton' onclick='bettingBest4("+ j +")'>";
        best4.appendChild(best4TeamsDiv)
    }
    var best4Matches1 = document.querySelectorAll(".best4Team1");
    var best4Matches2 = document.querySelectorAll(".best4Team2");
    for (var n = 0; n < best4Matches1.length; n++) {
        best4Matches1[n].addEventListener("click", function() { 
            this.classList.toggle('clicked'); 
        });
        best4Matches2[n].addEventListener("click", function() { 
            this.classList.toggle('clicked'); 
        });
    }
}
//////////////////////////////////////////////////////////////////////////////////////
// Fogadások az elődöntőkre
var matchNumsBest4 = [1, 2];
var betsBest4 = [];
function bettingBest4(i){

    bets = [];
    var team1 = document.querySelector('#best4' + i +'0');
    var team2 = document.querySelector('#best4' + i +'1');
    var odds1 = parseFloat(document.querySelector('#team1Oddsbest4'+ i +'0').innerHTML);
    var odds2 = parseFloat(document.querySelector('#team2Oddsbest4'+ i +'1').innerHTML);
    var betAmountBest4 = parseInt(document.querySelector('#betBoxBest4' + i + '').value);
    if (team1.getAttribute('class') === "best4Team1 clicked" && team2.getAttribute('class') === "best4Team2 clicked") {
        alert('Csak az egyik csapatra fogadhatsz!');
    }
    else if (team1.getAttribute('class') === "best4Team1" && team2.getAttribute('class') === "best4Team2") {
        alert('Jelölj ki egy csapatot a fogadáshoz!');
    }
    else if (betAmountBest4 !== betAmountBest4){
        alert("Add meg a fogadási összeget!")
    }
    else if ((user.bankroll - betAmountBest4) < 0){
        alert("Nem áll rendelkezésedre ekkora összeg!")
    }
    else {
        if (team1.getAttribute('class') === "best4Team1 clicked" && team2.getAttribute('class') !== "best4Team2 clicked"){
            betsBest4.push({matchNum: i, matchName: matchNumsBest4[i], teamNum: 0, teamName: team1.innerHTML, EV: parseInt(odds1*betAmountBest4), betAmount: betAmountBest4, matchID : i});
        }
        else if (team2.getAttribute('class') === "best4Team2 clicked" && team1.getAttribute('class') !== "best4Team1 clicked"){
            betsBest4.push({matchNum: i, matchName: matchNumsBest4[i], teamNum: 1, teamName: team2.innerHTML, EV: parseInt(odds2*betAmountBest4), betAmount: betAmountBest4, matchID : i});
        }
        userBets.innerHTML = "";
        user.bankroll -= betAmountBest4;
        allWinnings = 0;
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
            for (var h =0; h < betsBest4.length; h++){
                allWinnings += betsBest4[h].EV
                userBets.setAttribute('class', 'userData')
                userBets.innerHTML += betsBest4[h].matchName + ". elő-döntő "+ betsBest4[h].teamName + "<br>várható nyeremény: " + betsBest4[h].EV + "Ft<br><br>";
                userContainer.appendChild(userBets);
                userAllBets.setAttribute('class', 'userData')
                userAllBets.innerHTML = "Össz várható nyeremény: " + allWinnings + "Ft<br>";
                userContainer.appendChild(userAllBets);
            }
    }
}
///////////////////////////////////////////////////////////////////////////////////
// Best4 szimulation
var matchesBest4 = "";
var resultsBest4 = [];
var best4Winners = [];
function simulateBest4(){
    var matchesBest4 = document.getElementById('best4');
    var resultsBest4 = matchesBest4.querySelectorAll('.resultBest4')
    best4Winners = [];
    for (var m = 0; m < 2; m++) {
            var team1pont = (best8Winners[m*2].uefaCoeff * (Math.random() * 10) +4);
            var team2pont = (best8Winners[m*2+1].uefaCoeff * (Math.random() * 10) +4);
            if (team1pont >= team2pont) {
                        var diff = team1pont - team2pont;
                        var goalsTeam1 = Math.floor(1 + Math.floor(diff/200));
                        var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                        best4Winners.push(best8Winners[m*2]);
            }
            else {
                        var diff = team2pont - team1pont;
                        var goalsTeam2 = Math.floor(1 + Math.floor(diff/200));
                        var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                        best4Winners.push(best8Winners[m*2+1]);
            }
            resultsBest4[m].innerHTML = "";
            var resultsBest4Div = document.createElement("div");
            resultsBest4Div.innerHTML = " <div id='goalsTeamBest4" + m + "0' class='goals'> " + goalsTeam1 + " </div> : <div id='goalsTeamBest4" + m + "1' class='goals'> " + goalsTeam2 + " </div> ";
            resultsBest4[m].appendChild(resultsBest4Div)
    }
    showFinal()
    checkWinningsBest4()
}
/////////////////   //////////////////////////////////////////////////////////////////////////////
// Fogadások eredménye az elő-döntőben
function checkWinningsBest4(){
    var winningsBest4 = 0;
    if (betsBest4.length > 0) {
        for (var i =0; i < betsBest4.length; i++){
            var betTeam1Goals = document.querySelector('#goalsTeamBest4' + betsBest4[i].matchID + '0');
            var betTeam2Goals = document.querySelector('#goalsTeamBest4' + betsBest4[i].matchID + '1');
            if (parseInt(betTeam1Goals.innerHTML) > parseInt(betTeam2Goals.innerHTML)){
                if (betsBest4[i].teamNum == 0){
                    winningsBest4 += betsBest4[i].EV
                }
            }
            else {
                if (betsBest4[i].teamNum == 1){
                    winningsBest4 += betsBest4[i].EV
                }
            }
        }
        userBets.innerHTML = "";
        userAllBets.innerHTML = "";
        user.bankroll += winningsBest4;
        allWinnings = 0;
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
        user.winnings = user.bankroll - user.startBankroll;
        userWinnigs.innerHTML = 'Nyeremény: ' + user.winnings + "Ft";
        userContainer.appendChild(userWinnigs);
    }
}
///////////////////////////////////////////////////////////////////////////////////////
// Döntő kiírása
var final = document.querySelector('#final');
function showFinal(){
    shuffleTeams(best4Winners);
    final.classList.remove('.opaciNull')
    final.classList.add('fade');
    final.innerHTML = "<h2 style='display: inline-block; margin-left: 10px'>Döntő</h2><input type='button' value='Szimuláció' class='simulateBtn' onclick='simulateFinal()'><br>";
    for (var j = 0; j < 1; j++){
        var finalTeamsDiv = document.createElement("div");
        var oddsTeam1 = parseFloat(((1/(best4Winners[j*2].uefaCoeff/(best4Winners[j*2].uefaCoeff
         + best4Winners[j*2+1].uefaCoeff))).toFixed(2)));
        var oddsTeam2 = parseFloat(((1/(best4Winners[j*2+1].uefaCoeff/(best4Winners[j*2+1].uefaCoeff
         + best4Winners[j*2].uefaCoeff))).toFixed(2)));
        finalTeamsDiv.setAttribute('class', 'best16Teams');
        finalTeamsDiv.innerHTML = "<div class='oddsLeftFinal' id='team1OddsFinal'>" + oddsTeam1 + "</div><div class='best16Logo'><img src='" + 
        best4Winners[j*2].crestUrl + "' style='height:20px; margin: auto'></div><div id='finalTeam1' class='finalTeam1'> " + 
        best4Winners[j*2].name + " </div><div class='finalResult'> : </div><div id='finalTeam2' class='finalTeam2'> " + 
        best4Winners[j*2+1].name + " </div><div class='best16Logo'><img src=" + best4Winners[j*2+1].crestUrl + 
        " style='height:20px; margin: auto'></div><div class='oddsRightFinal' id='team2OddsFinal'> " + oddsTeam2 + 
        " </div><input class='betBoxInput' type='number' id='betBoxFinal' placeholder='tét'><input type='button' value='B' class='betButton' onclick='bettingFinal("+j+")'>";
        final.appendChild(finalTeamsDiv)
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //csapatok kijelölése a döntőben
    var finalMatches1 = document.querySelectorAll(".finalTeam1");
    var finalMatches2 = document.querySelectorAll(".finalTeam2");
    for (var n = 0; n < finalMatches1.length; n++) {
        finalMatches1[n].addEventListener("click", function() { 
            this.classList.toggle('clicked'); 
        });
        finalMatches2[n].addEventListener("click", function() { 
            this.classList.toggle('clicked'); 
        });
    }
}
//////////////////////////////////////////////////////////////////////////////////////
// Fogadások az döntőre
var matchNumsFinal = 1;
var betsFinal = [];
function bettingFinal(i){

    bets = [];
    var team1 = document.querySelector('#finalTeam1');
    var team2 = document.querySelector('#finalTeam2');
    var odds1 = parseFloat(document.querySelector('#team1OddsFinal').innerHTML);
    var odds2 = parseFloat(document.querySelector('#team2OddsFinal').innerHTML);
    var betAmountFinal = parseInt(document.querySelector('#betBoxFinal').value);
    if (team1.getAttribute('class') === "finalTeam1 clicked" && team2.getAttribute('class') === "finalTeam2 clicked") {
        alert('Csak az egyik csapatra fogadhatsz!');
    }
    else if (team1.getAttribute('class') === "finalTeam1" && team2.getAttribute('class') === "finalTeam2") {
        alert('Jelölj ki egy csapatot a fogadáshoz!');
    }
    else if (betAmountFinal !== betAmountFinal){
        alert("Add meg a fogadási összeget!")
    }
    else if ((user.bankroll - betAmountFinal) < 0){
        alert("Nem áll rendelkezésedre ekkora összeg!")
    }
    else {
        if (team1.getAttribute('class') === "finalTeam1 clicked" && team2.getAttribute('class') !== "finalTeam2 clicked"){
            betsFinal.push({matchNum: i, matchName: matchNumsFinal[i], teamNum: 0, teamName: team1.innerHTML, EV: parseInt(odds1*betAmountFinal), betAmount: betAmountFinal, matchID : i});
        }
        else if (team2.getAttribute('class') === "finalTeam2 clicked" && team1.getAttribute('class') !== "finalTeam1 clicked"){
            betsFinal.push({matchNum: i, matchName: matchNumsFinal[i], teamNum: 1, teamName: team2.innerHTML, EV: parseInt(odds2*betAmountFinal), betAmount: betAmountFinal, matchID : i});
        }
        userBets.innerHTML = "";
        user.bankroll -= betAmountFinal;
        allWinnings = 0;
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
            for (var h =0; h < betsFinal.length; h++){
                allWinnings += betsFinal[h].EV
                userBets.setAttribute('class', 'userData')
                userBets.innerHTML += "Döntő "+ betsFinal[h].teamName + "<br>várható nyeremény: " + betsFinal[h].EV + "Ft<br><br>";
                userContainer.appendChild(userBets);
                userAllBets.setAttribute('class', 'userData')
                userAllBets.innerHTML = "Össz várható nyeremény: " + allWinnings + "Ft<br>";
                userContainer.appendChild(userAllBets);
            }
    }
}
///////////////////////////////////////////////////////////////////////////////////
// Döntő szimulation
var finalMatch = "";
var finalResult = [];
var finalWinner = [];
function simulateFinal(){
    var finalMatch = document.getElementById('final');
    var finalResult = finalMatch.querySelectorAll('.finalResult')
    finalWinner = [];
    for (var m = 0; m < 1; m++) {
            var team1pont = (best4Winners[m].uefaCoeff * (Math.random() * 10) +4);
            var team2pont = (best4Winners[m+1].uefaCoeff * (Math.random() * 10) +4);
            if (team1pont >= team2pont) {
                        var diff = team1pont - team2pont;
                        var goalsTeam1 = Math.floor(1 + Math.floor(diff/200));
                        var goalsTeam2 = goalsTeam1 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                        finalWinner.push(best4Winners[m]);
            }
            else {
                        var diff = team2pont - team1pont;
                        var goalsTeam2 = Math.floor(1 + Math.floor(diff/200));
                        var goalsTeam1 = goalsTeam2 - Math.floor((Math.random() * (Math.floor(diff/200))+1));
                        finalWinner.push(best4Winners[m+1]);
            }
            finalResult[m].innerHTML = "";
            var finalResultDiv = document.createElement("div");
            finalResultDiv.innerHTML = " <div id='goalsTeam1Final' class='goals'> " + goalsTeam1 + " </div> : <div id='goalsTeam2Final' class='goals'> " + goalsTeam2 + " </div> ";
            finalResult[m].appendChild(finalResultDiv)
    }
    checkWinningsFinal()
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Fogadások eredménye a döntőben
function checkWinningsFinal(){
    var winningsFinal = 0;
    if (betsFinal.length > 0) {
        for (var i =0; i < betsFinal.length; i++){
            var betTeam1Goals = document.querySelector('#goalsTeam1Final');
            var betTeam2Goals = document.querySelector('#goalsTeam2Final');
            if (parseInt(betTeam1Goals.innerHTML) > parseInt(betTeam2Goals.innerHTML)){
                if (betsFinal[i].teamNum == 0){
                    winningsFinal += betsFinal[i].EV
                }
            }
            else {
                if (betsFinal[i].teamNum == 1){
                    winningsFinal += betsFinal[i].EV
                }
            }
        }
        userBets.innerHTML = "";
        userAllBets.innerHTML = "";
        user.bankroll += winningsFinal;
        allWinnings = 0;
        userBankroll.innerHTML = 'Egyenleg: ' + user.bankroll + "Ft";
        userContainer.appendChild(userBankroll);
        user.winnings = user.bankroll - user.startBankroll;
        userWinnigs.innerHTML = 'Nyeremény: ' + user.winnings + "Ft";
        userContainer.appendChild(userWinnigs);
    }
}
////////////////////////////////////////////////////////////////////////////////////////
// adatbázis oldalhoz táblázatok megjelenítése
var teamTable = document.querySelector('#csapatBank');
for (var j = 0; j < teams.length; j++){
    var championOrNot = teams[j].champion == true ? "★" : "";
    var teamsDiv = document.createElement("div");
    teamsDiv.setAttribute('class', 'dbTeams');
    teamsDiv.innerHTML = "<div style='display: inline-block; width: 30px; text-align: center'><img src=" +
     teams[j].crestUrl + " style='height:20px'></div><div class='teamsInDB' onclick='showPlayers(" + j +")'>" + teams[j].name + "</div>";
    teamTable.appendChild(teamsDiv)
}
var numberOfClicks = 0;
function showPlayers(teamnumber){
    if (teams[teamnumber].players == "no-data"){
        document.getElementById("playersTable").classList.add('fade');
        document.getElementById("playersTable").classList.remove('.opaciNull');
        var noPlayer = document.querySelector('#noPlayers');
        var noPlayerDiv = document.createElement("div");
        noPlayerDiv.classList.add('noPlayer');
        noPlayer.innerHTML = "";
        noPlayerDiv.innerHTML = "Tartalom feltöltés alatt"
        noPlayer.appendChild(noPlayerDiv)
        var elements = document.querySelector('.playersTable');
        elements.innerHTML = "";
    }
    else{
        teams[teamnumber].players.sort(function(a, b){
            if (a.name < b.name) {
                return -1;
            }
            else {
                return 1;
            }
        });
        document.getElementById("playersTable").classList.add('fade');
        document.getElementById("playersTable").classList.remove('.opaciNull');
        var noPlayer = document.querySelector('#noPlayers');
        var noPlayerDiv = document.createElement("div");
        noPlayerDiv.classList.add('noPlayer');
        noPlayer.innerHTML = "";
        noPlayerDiv.innerHTML = ""
        noPlayer.appendChild(noPlayerDiv)
        noPlayerDiv.style.display= 'none';
        var elements = document.querySelector('.playersTable');
        var teamTableName = document.createElement("caption");
        elements.innerHTML = "";
        teamTableName.innerHTML = teams[teamnumber].name
        teamTableName.style.background = 'rgb(40,40,40)'
        teamTableName.style.fontSize = '1.2em'
        elements.appendChild(teamTableName)
        var teamTableRow = document.createElement("tr");
        teamTableRow.innerHTML = "<th>Csapat</th><th class='sortPlayers' onclick='showPlayersByNAT("+ teamnumber +")'>NAT ↑</th><th class='sortPlayers'  onclick='showPlayersByName("+
         teamnumber +")'>Játékos ↑</th class='sortPlayers'><th onclick='showPlayersByAge("+ teamnumber +")' class='sortPlayers'>Született ↑</th><th class='sortPlayers' onclick='showPlayersByPosition("+ teamnumber +")'>Poszt ↑</th>";
        elements.appendChild(teamTableRow)  
        for (var i = 0; i < teams[teamnumber].players.length; i++){
            var playerTableRow = document.createElement("tr");
            playerTableRow.innerHTML = "<td style='text-align: center'>" + teams[teamnumber].code + "</td></td><td><img src=" 
            + teams[teamnumber].players[i].nationality + " style='height:16px; width:22px; display:block; margin: auto'></td><td>" + teams[teamnumber].players[i].name + 
            "</td><td>" + teams[teamnumber].players[i].dateOfBirth + "</td><td>" + teams[teamnumber].players[i].position ;
            elements.appendChild(playerTableRow) 
            console.log(teams[teamnumber].players[i].name)
        }
    }
}

function sortPlayers(teamnumber){
    document.getElementById("playersTable").classList.add('fade');
    document.getElementById("playersTable").classList.remove('.opaciNull');
    var elements = document.querySelector('.playersTable');
    var teamTableName = document.createElement("caption");
    elements.innerHTML = "";
    teamTableName.innerHTML = teams[teamnumber].name
    teamTableName.style.background = 'rgb(40,40,40)'
    teamTableName.style.fontSize = '1.2em'
    elements.appendChild(teamTableName)
    var teamTableRow = document.createElement("tr");
    teamTableRow.innerHTML = "<th>Csapat</th><th class='sortPlayers' onclick='showPlayersByNAT("+ teamnumber +")'>NAT ↑</th><th class='sortPlayers' onclick='showPlayersByName("+
        teamnumber +")'>Játékos ↑</th><th class='sortPlayers' onclick='showPlayersByAge("+ teamnumber +")'>Született ↑</th><th class='sortPlayers' onclick='showPlayersByPosition("+ teamnumber +")'>Poszt ↑</th>";
    elements.appendChild(teamTableRow)  
    for (var i = 0; i < teams[teamnumber].players.length; i++){
        var playerTableRow = document.createElement("tr");
        playerTableRow.innerHTML = "<td style='text-align: center'>" + teams[teamnumber].code + "</td></td><td><img src=" + teams[teamnumber].players[i].nationality + " style='height:16px; width:22px; display:block; margin: auto'></td><td>" + teams[teamnumber].players[i].name + 
        "</td><td>" + teams[teamnumber].players[i].dateOfBirth + "</td><td>" + teams[teamnumber].players[i].position ;
        elements.appendChild(playerTableRow) 
    }
}

function showPlayersByAge(teamnumber){
    numberOfClicks++
    if (teams[teamnumber].players == "no-data"){
        console.log("Tartalom feltöltés alatt")
    }
    else if (numberOfClicks % 2 == 1){
        teams[teamnumber].players.sort(function(a, b){
            if (a.dateOfBirth < b.dateOfBirth) {
                return -1;
            }
            else {
                return 1;
            }
        });
        sortPlayers(teamnumber)
    }
    else {
        teams[teamnumber].players.sort(function(a, b){
            if (a.dateOfBirth > b.dateOfBirth) {
                return -1;
            }
            else {
                return 1;
            }
        });
        sortPlayers(teamnumber)
    }
}
function showPlayersByNAT(teamnumber){
    numberOfClicks++
    if (teams[teamnumber].players == "no-data"){
        console.log("Tartalom feltöltés alatt")
    }
    else if (numberOfClicks % 2 == 1){
        teams[teamnumber].players.sort(function(a, b){
            if (a.nationality < b.nationality) {
                return -1;
            }
            else {
                return 1;
            }
        });
        sortPlayers(teamnumber)
    }
    else {
        teams[teamnumber].players.sort(function(a, b){
            if (a.nationality > b.nationality) {
                return -1;
            }
            else {
                return 1;
            }
        });
        sortPlayers(teamnumber)
    }
}
function showPlayersByPosition(teamnumber){
    numberOfClicks++
    if (teams[teamnumber].players == "no-data"){
        console.log("Tartalom feltöltés alatt")
    }
    else if (numberOfClicks % 2 == 1){
        teams[teamnumber].players.sort(function(a, b){
            if (a.position < b.position) {
                return -1;
            }
            else {
                return 1;
            }
        });
        sortPlayers(teamnumber)
    }
    else {
        teams[teamnumber].players.sort(function(a, b){
            if (a.position > b.position) {
                return -1;
            }
            else {
                return 1;
            }
        });
        sortPlayers(teamnumber)
    }
}
function showPlayersByName(teamnumber){
    numberOfClicks++
    if (teams[teamnumber].players == "no-data"){
        console.log("Tartalom feltöltés alatt")
    }
    else if (numberOfClicks % 2 == 1){
        teams[teamnumber].players.sort(function(a, b){
            if (a.name < b.name) {
                return -1;
            }
            else {
                return 1;
            }
        });
        sortPlayers(teamnumber)
    }
    else {
        teams[teamnumber].players.sort(function(a, b){
            if (a.name > b.name) {
                return -1;
            }
            else {
                return 1;
            }
        });
        sortPlayers(teamnumber)
    }
}
///////////////////////////////////////////////////////////////////
// játékosok keresése
var found = [];
function playerSearch(){
    found = [];
    var input = document.getElementById("searchInput").value.toLowerCase();
    for (i = 0; i < teams.length; i++) {
        if (teams[i].players != "no-data"){
            for (var k = 0; k < teams[i].players.length; k++){
                if (teams[i].players[k].name.toLowerCase().indexOf(input) > -1) {
                found.push(teams[i].players[k]);
                }
            }
        }
    }
    var playersTableByName = document.querySelector('#playersByName')
    playersTableByName.innerHTML = "";
    var teamTableRow = document.createElement("tr");
    teamTableRow.innerHTML = "<th class='sortPlayers'>Játékos</th><th class='sortPlayers'>NAT</th><th class='sortPlayers'>Született</th><th class='sortPlayers'>Poszt ↑</th>";
    playersTableByName.appendChild(teamTableRow) 
    for (var m = 0; m < found.length; m++){
        var playersRow = document.createElement('tr');
         playersRow.innerHTML = "<td>"+found[m].name+"</th><td><img src=" + found[m].nationality + " style='height:16px; width:22px; display:block; margin: auto'></th><td>"+found[m].dateOfBirth+"</th><td>"+found[m].position+"</th>"
         playersTableByName.appendChild(playersRow)
    }
}

function playerSearchByNat(){
    found = [];
    var input = document.getElementById("searchInput").value.toLowerCase();
    for (i = 0; i < teams.length; i++) {
        if (teams[i].players != "no-data"){
            for (var k = 0; k < teams[i].players.length; k++){
                if (teams[i].players[k].nationality.toLowerCase().indexOf(input) > -1) {
                found.push(teams[i].players[k]);
                }
            }
        }
    }
    var playersTableByName = document.querySelector('#playersByName')
    playersTableByName.innerHTML = "";
    var teamTableRow = document.createElement("tr");
    teamTableRow.innerHTML = "<th class='sortPlayers'>Játékos</th><th class='sortPlayers'>NAT</th><th class='sortPlayers'>Született</th><th class='sortPlayers'>Poszt ↑</th>";
    playersTableByName.appendChild(teamTableRow) 
    for (var m = 0; m < found.length; m++){
        var playersRow = document.createElement('tr');
         playersRow.innerHTML = "<td>"+found[m].name+"</th><td><img src=" + found[m].nationality + " style='height:16px; width:22px; display:block; margin: auto'></th><td>"+found[m].dateOfBirth+"</th><td>"+found[m].position+"</th>"
         playersTableByName.appendChild(playersRow)
    }
}

function playerSearchByPos(){
    found = [];
    var input = document.getElementById("searchInput").value.toLowerCase();
    for (i = 0; i < teams.length; i++) {
        if (teams[i].players != "no-data"){
            for (var k = 0; k < teams[i].players.length; k++){
                if (teams[i].players[k].position.toLowerCase().indexOf(input) > -1) {
                found.push(teams[i].players[k]);
                }
            }
        }
    }
    var playersTableByName = document.querySelector('#playersByName')
    playersTableByName.innerHTML = "";
    var teamTableRow = document.createElement("tr");
    teamTableRow.innerHTML = "<th class='sortPlayers'>Játékos</th><th class='sortPlayers'>NAT</th><th class='sortPlayers'>Született</th><th class='sortPlayers'>Poszt ↑</th>";
    playersTableByName.appendChild(teamTableRow) 
    for (var m = 0; m < found.length; m++){
        var playersRow = document.createElement('tr');
         playersRow.innerHTML = "<td>"+found[m].name+"</th><td><img src=" + found[m].nationality + " style='height:16px; width:22px; display:block; margin: auto'></th><td>"+found[m].dateOfBirth+"</th><td>"+found[m].position+"</th>"
         playersTableByName.appendChild(playersRow)
    }
}

