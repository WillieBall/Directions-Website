/////////////////////////////

var fuzzyStarting = '';
var fuzzyEnding = '';
var routeType = '';
var travelMode = '';
var hilliness = '';
var gps1 = '';
var gps2 = '';
var routingLocation = '';
var URL;

var dataToUpload = '';

var mapUrl1 = 'https://api.tomtom.com/map/1/staticimage?layer=basic&style=main&format=png&zoom=12&center=';
var mapUrl2 = '&width=512&height=512&view=Unified&key=nAIqpniAvjObcrQcxY9SkzuFqtuFQssN';
// this function is for setting the variables from the form to be used later
function setVariables () {
    fuzzyStarting = document.getElementById("startingAddress").value;
    fuzzyEnding = document.getElementById("endingAddress").value;
    routeType = document.getElementById('routeType').value;
    travelMode = document.getElementById('travelMode').value;
    hilliness = document.getElementById('hilliness').value;

    getFuzzyStarting(fuzzyStarting);
    getFuzzyEnding(fuzzyEnding);

    
    
    // format info for api call
    routeType = "routeType=" + routeType;
    travelMode = "travelMode=" + travelMode;
    hilliness = "hilliness=" + hilliness;

    // if thrilling is selected we need to add hilliness
    URL = 'https://api.tomtom.com/routing/1/calculateRoute/' + routingLocation + '/json?instructionsType=text&routeType=thrilling' + '&' + travelMode + '&' + hilliness + '&key=nAIqpniAvjObcrQcxY9SkzuFqtuFQssN';
    getDirections(URL);
    postInformation();
}


// this function gets the json data from the api call for the starting and ending searches using "fuzzy" search
function getFuzzyStarting (info) {
    a=$.ajax({
        url: 'https://api.tomtom.com/search/2/search/' + info + '.json?limit=1&lat=37.337&lon=-121.89&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=off&key=nAIqpniAvjObcrQcxY9SkzuFqtuFQssN',
        method: "GET",
        async: false,
    }).done(function(data) {
        routingLocation = (data.results[0].position.lat).toString() + ',' + (data.results[0].position.lon).toString();
    }).fail(function(errors) {
        
    });
}

function getFuzzyEnding (info) {
    a=$.ajax({
        url: 'https://api.tomtom.com/search/2/search/' + info + '.json?limit=1&lat=37.337&lon=-121.89&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=off&key=nAIqpniAvjObcrQcxY9SkzuFqtuFQssN',
        method: "GET",
        async: false,
    }).done(function(data) {
        routingLocation += ":" + (data.results[0].position.lat).toString() + ',' + (data.results[0].position.lon).toString();
        
    }).fail(function(errors) {

    });
}

function getDirections () {
    $.ajax({
        url: URL,
        method: "GET",
        async: false,
    }).done(function(data) {
            $("#travelInfo").append(
                ("Total Distance: " + data.routes[0].legs[0].summary.lengthInMeters) + " meters" + "<br>" +
                ("Total time: " + data.routes[0].legs[0].summary.travelTimeInSeconds) + " seconds" + "<br>" +
                ("Current Traffic Delay Time: " + data.routes[0].legs[0].summary.trafficDelayInSeconds) + " seconds" + "<br>" +
                ("Current Traffic Delay Length: " + data.routes[0].legs[0].summary.trafficLengthInMeters) + " meters"
            );
            var legs = data.routes[0].guidance.instructions;
            for (let i = 0; i < legs.length; i++) {
                $("#directionInfo").append (
                    "<tr> <th scope='row'>" + (i + 1) + "</th>" + "<td>" + data.routes[0].guidance.instructions[i].message + "</td><td>" + data.routes[0].guidance.instructions[i].routeOffsetInMeters + "</td><td>" + data.routes[0].guidance.instructions[i].travelTimeInSeconds + "</td><td> <img src='" + mapUrl1 + data.routes[0].guidance.instructions[i].point.longitude + "," + data.routes[0].guidance.instructions[i].point.latitude + mapUrl2 + "' style='width:100px;heigh:100px;' decoding='auto'> </td></tr>"
                );
            }
            dataToUpload = data;
    }).fail(function(errors) {
        console.log("error", data.detailedError.message);
    });
}
function postInformation () {
    a=$.ajax({
        url: 'http://172.17.13.136/final.php?method=setLookup&location=45056&sensor=web&value=' + dataToUpload,
        method: "POST",
        async: false,
    }).done(function(data) {
        
        
    }).fail(function(errors) {

    });
}