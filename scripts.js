var header;
var resultBox;
var nomBox;
var searchBar;
var results;
var nominations;
var footer;

var request;
var mov;
var search;

var aWidth;
var aHeight;

var noms = [];
var nomsOut = [];

window.addEventListener('load',init);
window.addEventListener('resize',layoutPage);
document.addEventListener('input',call);

function init(){
	header = document.getElementById('header');
	searchBar = document.getElementById('searchBar');
	resultBox = document.getElementById('resultBox');
	resultText = document.getElementById('resultText');
	results = document.getElementById('results');
	nomBox = document.getElementById('nomBox');
	nomText = document.getElementById('nomText');
	nominations = document.getElementById('nominations');
	footer = document.getElementById('footer');
	
	layoutPage();
}

function layoutPage(){
	aWidth = innerWidth;
	aHeight = innerHeight;
	
	header.style.top = "0px";
	header.style.left = "0px";
	header.style.width = aWidth - 10 + "px";
	header.style.height = "100px";
	
	resultBox.style.top = "100px";
	resultBox.style.left = "0px";
	resultBox.style.width = aWidth/2 - 10 + "px";
	resultBox.style.height = "auto";//*/aHeight - 120 + "px";
	
	nomBox.style.top = "100px";
	nomBox.style.left = aWidth/2 + "px";
	nomBox.style.width = aWidth/2 - 10 + "px";
	nomBox.style.height = "auto";//*/aHeight - 120 + "px";
	
	footer.style.top = aHeight - 68 +"px"
	footer.style.left = "-8px";
	footer.style.width = aWidth + "px";
	footer.style.height = "60px";
}

function call(){
	send();
	setTimeout(function(){send();}, 500);
	resultText.innerHTML = 'Showing Results for "' + searchBar.value + '"';
	if (searchBar.value == "") {
		resultText.innerHTML = "Search Results";
		results.innerHTML = "";
	}
}

function send(){
	var link = 'http://www.omdbapi.com/?type=movie&apikey=330ff9dc&s=' + searchBar.value;
	request = new XMLHttpRequest();
	request.open('GET',link,true);
	request.onload = function(){search = JSON.parse(this.response);};
	request.send();
	
	var str = "";
	if (search.Error == null){
		for (var i = 0; i < search.Search.length; i++){
			str += search.Search[i].Title.replace(/['"]+/g, "") + " (";
			str += search.Search[i].Year + ") ";
			str += "&nbsp; <button ";
			str += "onclick='add(" + '"' + search.Search[i].imdbID + '"';
			str += ',"' + search.Search[i].Title.replace(/['"]+/g, ""); 
			str += " (" + search.Search[i].Year + ')"' + ")'";
			
			for (let j = 0;j < noms.length; j++){
				if(search.Search[i].imdbID == noms[j]||noms.length == 5){
					str += "disabled ";
				}
			}
			
			str+=">Nominate</button> <br><br>";
		}
	} else if (searchBar.value == "" || search.Error == "Incorrect IMDb ID.") {
		str = "";
	} else {
		str = search.Error;
	}
	
	results.innerHTML = str;
	
	nomText.innerHTML = "Nominations (" + noms.length + "/5)";
	
	str = "";
	
	for (let i = 0; i < nomsOut.length; i++){
		str += "<button ";
		str += "onclick='remove(" + '"' + noms[i] +'")' + "'";
		str+=">X</button> &nbsp &nbsp &nbsp &nbsp &nbsp";
		str += nomsOut[i] + " <br><br>";
	}
	
	nominations.innerHTML = str;
	
	if (nomsOut.length == 0) {nominations.innerHTML = "";}
	
	if (noms.length == 5){
		footer.style.opacity = 1;
	} else
	{
		footer.style.opacity = 0;
	}
	
}

function add(movID,name) {
	noms.push(movID);
	nomsOut.push(name);
	
	send();
}

function remove(movID){
	var index = noms.indexOf(movID);
	
	if (index == -1) {return;}
	
	noms.splice(index,1);
	nomsOut.splice(index,1);

	send();
}

function finished() {
	// code that sends noms to a database
	
	noms = [];
	nomsOut = [];
	searchBar.value = "";
	call();
}