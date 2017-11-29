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
    if (largeFont) {
        // Put message as large text
        var messageToSend = "**" + message + "**"
    } else {
        // Put message as normal text
        var messageToSend = message;
    }
    session.send(messageToSend);
}