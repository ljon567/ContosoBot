// Load modules
var rest = require('../API/RestClient');
var builder = require('botbuilder');

//Connect to OCBC external API
exports.displayLocation = function bankLocation(session){
    // For demo, country is Singapore
    var url = "	https://api.ocbc.com:8243/branch_locator/1.1?category=2&country=SG";
    var auth = "3fe2a92847a7cf0a7a820069dba636ed";
    rest.bankLocation(url, auth, session, getBankLocation);
}

function getBankLocation(message, session){
    // For displaying the bank locations as cards
    var attachment = [];
    // Parses JSON
    var branches = JSON.parse(message);

    // For each bank branch, add card with branch name, address, postal code and opening hours in attachment
    for (var index in branches.branchesAndCentresList) {
        var branch = branches.branchesAndCentresList[index];
        var name = branch.landmark;
        var address = branch.address;
        var postalCode = branch.postalCode;
        var hours = branch.openingHours;

        var card = new builder.HeroCard(session)
            .title(name)
            .subtitle(hours)
            .text(address + '\n\n' + postalCode)
        attachment.push(card);

    }

    //Displays bank branch hero card carousel 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}