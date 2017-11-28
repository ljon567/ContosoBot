// Load module
var request = require('request');

// exports.bankLocation = function getData(url, session, callback) {
//     console.log("Inside bankLocation function"); 
//     request.get(url, function(err, res, body) {
//         if(err) {
//             console.log(err);
//         } else {
//             callback(body, session);
//         }
//     });
// };

// Acquire bank location from external API
exports.bankLocation = function getData(url, bearer, session, callback){
    request.get(url, {'auth': { 'bearer': bearer}}, function(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, session);
        }
    });
};

// Display balance of specified account from database
exports.showBalance = function getData(url, session, accountNumber, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, accountNumber);
        }
    });
};

// Create account with post method
exports.createAccount = function getData(url, name, accountNumber, balance){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "name" : name,
            "accountNumber" : accountNumber,
            "balance" : balance
        }
    };      
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else {
            console.log(error);
        }
    });
};

// Delete account with delete method
exports.deleteAccount = function deleteData(url, session, accountNumber, id, callback) {
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };
    request(options, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            console.log(body);
            callback(body, session, accountNumber);
        } else {
            console.log(err);
            console.log(res);
        }
    })
};

// exports.postQnAResults = function getData(url, session, question, callback){
//     var options = {
//         url: url,
//         method: 'POST',
//         headers: {
//             'Ocp-Apim-Subscription-Key': '6819661b215942da961febcbf5f88c99',
//             'Content-Type':'application/json'
//         },
//         json: {
//             "question" : question
//         }
//       };
  
//       request(options, function (error, response, body) {
//         if (!error && response.statusCode === 200) {
//             callback(body, session, question);
//         }
//         else{
//             console.log(error);
//         }
//       });
//   };