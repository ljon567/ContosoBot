// Load module
var builder = require('botbuilder');

// Font size, initially at normal
var largeFont = false;

exports.increaseSize = function increaseSize() {
    largeFont = true;
}

exports.decreaseSize = function decreaseSize() {
    largeFont = false;
}

// All Chat Bot replies as cards
exports.sendToChat = function sendToChat(message, session) {
    var attachment = [];
    if (largeFont) {
        // Put message as large title
        var card = new builder.HeroCard(session)
            .title(message)
        attachment.push(card);
    } else {
        // Put message as small text
        var card = new builder.HeroCard(session)
            .text(message)
        attachment.push(card);
    }
    // Display in carousel 
    var messageToSend = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(messageToSend);
}