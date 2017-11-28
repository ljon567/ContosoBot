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
    // Limit carousel to 7 cards so they can show up on Skype
    for (var index = 0; limit = 7, index < limit; index++) {
        var branch = branches.branchesAndCentresList[index];
        var name = branch.landmark;
        var address = branch.address;
        var postalCode = branch.postalCode;
        var hours = branch.openingHours;
        // Create card with information
        var card = new builder.HeroCard(session)
            .title(name)
            .subtitle(hours)
            .text(address + '\n\n' + postalCode)
        attachment.push(card);
    }
    // Display bank branch hero card carousel 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}