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

const tia = 'https://www3.mackenzie.br/tia/';
const index = tia + 'index.php'; //Pagina de login do tia
const verifica = tia + 'verifica.php'; // Post login
const index2 = tia + 'index2.php'; //Index após logado
const horarios = tia + 'horarChamada.php';
const frequencia = tia + 'faltasChamada.php';

var aluno = {
    'matricula': '41427475',
    'password': '123gabi',
    'unidade': '001',
    'nome': '',
    'curso': ''
}

// GET request at index.php to get the token
// console.log("Visiting page " + index);
request({
    url: index,
    method: 'GET',
    jar: jar
}, function (error, response, body) {
    if (error) {
        console.log("Error: " + error);
    }

    console.log("1.Status code(index.php): " + response.statusCode);
    if (response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);
        // Getting the token from the form 
        var token = $('[name=token]').val();
        var payloadLogin = {
            'token': token,
            'alumat': aluno.matricula,
            'pass': aluno.password,
            'unidade': aluno.unidade
        };

        var loginString = querystring.stringify(payloadLogin);
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
                'Content-Length': loginString.length
            },
        };
        // POST REQUEST AT verifica.php 
        request(optionslogin, function (error, response, body) {
            var $ = cheerio.load(body);
            var authenticate = $('[name=mensagem]').val();
            if (typeof authenticate == 'undefined') { //authenticate is undefined when login is sucessfull
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
                    if (response.statusCode === 200) {
                        // console.log(body);
                        var $ = cheerio.load(body);
                        aluno.nome = $('h2').text().split('- ').pop();
                        console.log('nome: ' + aluno.nome);
                    }
                });
            } else {
                console.log(authenticate);
            }

            //GET REQUEST DA PAGINA faltasChamada.php
            // console.log("3.Visiting page " + frequencia);
            // request({
            //     url: frequencia,
            //     jar: jar,
            //     method: 'GET'
            // }, function (error, response, body) {
            //     if (error) {
            //         console.log("Error: " + error);
            //     }
            //     console.log("3.Status code(faltasChamada.php): " + response.statusCode);
            //     if (response.statusCode === 200) {
            //         console.log(body);
            //         var $ = cheerio.load(body);
            //     }
            // });
        });
    }
});
