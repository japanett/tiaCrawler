/* 
Request is used to make HTTP requests
Cheerio is used to parse and select HTML elements on the page
URL is used to parse URLs
*/
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var querystring = require('querystring');
var jar = request.jar();

var tia = 'https://www3.mackenzie.br/tia/';
var index = tia + 'index.php'; //Pagina de login do tia
var verifica = tia + 'verifica.php'; // Post login
var index2 = tia + 'index2.php'; //Index após logado
var horarios = tia + 'horarChamada.php';
var frequencia = tia + 'faltasChamada.php'; 

var alumat = 'xxxxx'; // TIA
var pass = 'xxxxxx'; // password
var unidade = '001';
var globalToken;
var globalCookie;

// function searchForWord($, word) {
//     var bodyText = $('html > body').text();
//     if (bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
//         return true;
//     } else {
//         return false;
//     }
// }

// GET request at index.php to get the token
console.log("Visiting page " + index);
request({
    url: index,
    method: 'GET',
    jar: jar
}, function (error, response, body) {
    if (error) {
        console.log("Error: " + error);
    }
    // Checking status
    console.log("1.Status code(index.php): " + response.statusCode);
    if (response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);
        // Gets the token from the form 
        var token = $('[name=token]').val();
        var payloadLogin = {
            'token': token,
            'alumat': alumat,
            'pass': pass,
            'unidade': unidade
        };
        var loginString = querystring.stringify(payloadLogin);
        var length = loginString.length;
        var optionslogin = {
            method: 'POST',
            followAllRedirects: true,
            jar: jar,
            url: verifica,
            body: loginString,
            headers: {
                'Host': 'www3.mackenzie.br',
                'Referer': 'https://www3.mackenzie.br/tia/index.php',
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': length
            },
        };
        // POST REQUEST AT verifica.php 
        request(optionslogin, function (error, response, body) {
            // console.log(body);
            // GET REQUEST DA PAGINA horarChamada.php
            console.log("3.Visiting page " + horarios);
            request({
                url: horarios,
                jar: jar,
                method: 'GET'
            }, function (error, response, body) {
                if (error) {
                    console.log("Error: " + error);
                }
                // Checking status
                console.log("3.Status code(horarChamada.php): " + response.statusCode);
                if (response.statusCode === 200) {
                    // Parse the document body
                    console.log(body);
                    // var $ = cheerio.load(body);
                }
            });

            //GET REQUEST DA PAGINA faltasChamada.php
            console.log("3.Visiting page " + frequencia);
            request({
                url: frequencia,
                jar: jar,
                method: 'GET'
            }, function (error, response, body) {
                if (error) {
                    console.log("Error: " + error);
                }
                // Checking status
                console.log("3.Status code(faltasChamada.php): " + response.statusCode);
                if (response.statusCode === 200) {
                    // Parse the document body
                    console.log(body);
                    // var $ = cheerio.load(body);
                }
            });
        });
    }
});



