/*
Author: Li Jong
Contoso Bank Bot
*/

// Load modules
var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');

// Setup Restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('Setting up Restify Server: %s listening to %s', server.name, server.url);
});

// Build chat connector 
var connector = new builder.ChatConnector({
    appId: "f9a0c894-16bd-407f-9a4d-6ee5b0bb91c3",
    appPassword: "qjZLS4-:)*qyshfVLHG5580"
});

// Listen for user inputs
server.post('/api/messages', connector.listen());

// Build chat bot and set default message if unrecognized input received
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// Start LUIS functionality
luis.startDialog(bot);