/* 
Request is used to make HTTP requests
Cheerio is used to parse and select HTML elements on the page
URL is used to parse URLs
*/
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var tia = "https://www3.mackenzie.br/tia/";
var index = tia + "index.php" //Pagina de login do tia
var verifica = tia + "verifica.php" //Verifica credenciais
var index2 = tia + "index2.php" //Index após logado
var horarios = tia + "horarChamada.php" //horarios

var alumat = "xxxxxx";
var pass = "xxxxx";
var unidade = "001";

function searchForWord($, word) {
    var bodyText = $('html > body').text();
    if (bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
        console.log("Found the string: " + word);
        return true;
    }
    console.log("Did not find the string: " + word);
    return false;
}

console.log("Visiting page " + index);
request(index, function (error, response, body) {
    if (error) {
        console.log("Error: " + error);
    }
    // Checking status
    console.log("Status code: " + response.statusCode);

    if (response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);
        var token = $('[name=token]').val();
        /* console.log("Token: " + token); */
        // Set the headers
        var headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: verifica,
            method: 'POST',
            headers: headers,
            form: {
                'alumat': alumat,
                'pass': pass,
                'token': token,
                'unidade': unidade
            }
        }
        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
                searchForWord($, "gabriel");
            }
        })
        searchForWord($, "gabriel");
        /*  var cookies = request */
        /* request.post(verifica, data = data, cookies = cookies, headers = headers, allow_redirects = True); */
    }

});
