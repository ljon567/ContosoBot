// Load modules
var request = require('request'); 
var botDialog = require('../controller/chatDisplay');

// Connect to Custom Vision prediction API
exports.retrieveMessage = function (session){
    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/6ee9c6d0-f242-4661-9d9d-a80278958ebf/url?iterationId=dda3085a-0c91-4027-bad7-40fc559b3512',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '2470ae283d364813a0e2854a5d09e524'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        botDialog.sendToChat(validResponse(body), session);
    });
}

// Give appropriate response depending on whether image is a cheque, card or neither
function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag) {
        if (body.Predictions[0].Tag === "cheque") {
            return "Scanning cheque and depositing into your account"
        } else {
            return "Verifying card and opening your account"
        }
    } else {
        console.log('Unrecognized input');
    }
}