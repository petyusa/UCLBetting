//váltás az oldalak között
var mainPageBtn = document.querySelector('#mainPageBtn');
var databasePageBtn = document.querySelector('#tablePageBtn');
var bettingPageBtn = document.querySelector('#bettingPageBtn');
mainPageBtn.addEventListener('click', showMainPage);
bettingPageBtn.addEventListener('click', showBettingPage);
databasePageBtn.addEventListener('click', showDatabasePage);
function showMainPage() {
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("mainContainer").classList.add('fade');
    document.getElementById("mainContainer").classList.remove('.opaciNull');
    document.getElementById("bettingContainer").style.display = "none";
    document.getElementById("bettingContainer").classList.remove('.fade');
    document.getElementById("bettingContainer").classList.add('opaciNull');
    document.getElementById("databaseContainer").style.display = "none";
    document.getElementById("databaseContainer").classList.add('opaciNull');
    document.getElementById("databaseContainer").classList.remove('.fade');
}
function showBettingPage() {
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("mainContainer").classList.add('opaciNull');
    document.getElementById("mainContainer").classList.remove('.fade');
    document.getElementById("bettingContainer").style.display = "block";
    document.getElementById("bettingContainer").classList.remove('.opaciNull');
    document.getElementById("bettingContainer").classList.add('fade');
    document.getElementById("databaseContainer").style.display = "none";
    document.getElementById("databaseContainer").classList.add('opaciNull');
    document.getElementById("databaseContainer").classList.remove('.fade');
}
function showDatabasePage() {
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("mainContainer").classList.add('opaciNull');
    document.getElementById("mainContainer").classList.remove('.fade');
    document.getElementById("bettingContainer").style.display = "none";
    document.getElementById("bettingContainer").classList.remove('.fade');
    document.getElementById("bettingContainer").classList.add('opaciNull');
    document.getElementById("databaseContainer").style.display = "block";
    document.getElementById("databaseContainer").classList.add('fade');
    document.getElementById("databaseContainer").classList.remove('.opaciNull');
}