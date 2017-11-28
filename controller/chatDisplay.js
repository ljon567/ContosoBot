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

exports.sendToChat = function sendToChat(message, session) {
    var attachment = [];
    if (largeFont) {
        var card = new builder.HeroCard(session)
            .title(message)
        attachment.push(card);
    } else {
        var card = new builder.HeroCard(session)
            .text(message)
        attachment.push(card);
    }
    // Display bank branch hero card carousel 
    var messageToSend = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(messageToSend);
}