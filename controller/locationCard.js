// Load modules
var rest = require('../API/RestClient');
var builder = require('botbuilder');

//Connect to ASB external API
exports.displayLocation = function bankLocation(session){
    console.log("Inside displayLocation function");
    var url = "	https://api.asb.co.nz/public/v1/locations";
    rest.bankLocation(url, session, getBankLocation);
}

function getBankLocation(message, session){
    console.log("Inside getBankLocation function");
    //Parses JSON
    var branches = JSON.parse(message);
    console.log(branches);
    session.send(branches);

    // //Displays nutrition adaptive cards in chat box 
    // session.send(new builder.Message(session).addAttachment({
    //     contentType: "application/vnd.microsoft.card.adaptive",
    //     content: {
    //         "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    //         "type": "AdaptiveCard",
    //         "version": "0.5",
    //         "body": [
    //             {
    //                 "type": "Container",
    //                 "items": [
    //                     {
    //                         "type": "TextBlock",
    //                         "text": foodName.charAt(0).toUpperCase() + foodName.slice(1),
    //                         "size": "large"
    //                     },
    //                     {
    //                         "type": "TextBlock",
    //                         "text": "Nutritional Information"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "Container",
    //                 "spacing": "none",
    //                 "items": [
    //                     {
    //                         "type": "ColumnSet",
    //                         "columns": [
    //                             {
    //                                 "type": "Column",
    //                                 "width": "auto",
    //                                 "items": [
    //                                     {
    //                                         "type": "FactSet",
    //                                         "facts": nutritionItems
    //                                     }
    //                                 ]
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // }));
}