// Load modules
var builder = require('botbuilder');
var balance = require('../controller/BankBalance');
//var restaurant = require('./RestaurantCard');
var bank = require('../controller/locationCard');
var customVision = require('../controller/CustomVision');
var botDialog = require('../controller/chatDisplay');
//var qna = require('../controller/QnAMaker');

exports.startDialog = function (bot) {
    
    // Link to LUIS app
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/43ff555e-e121-4144-8520-8c123f053760?subscription-key=f78edbe8f5464ef1b55a23b3ed273cc9&verbose=true&timezoneOffset=0&q=');

    // Boolean to check if user has logged in yet or not
    var loggedIn = true;

    // Connect to chat bot
    bot.recognizer(recognizer);

    bot.dialog('HelpIntent', [
        function (session, results, next) {
            if (!isAttachment(session)) {
                botDialog.sendToChat("Hi, I'm a chat bot working for the Contoso Bank!\n\nType 'login' to login to the system\n\nType 'menu' to access the menu\n\nType 'increase font' to increase the font of my replies", session);
            }
        }
    ]).triggerAction({
        matches: 'HelpIntent'
    });

    bot.dialog('ShowBalance', [
        function (session, results, next) {
            if (!isAttachment(session)) {
                botDialog.sendToChat("Showing your balance", session);
                balance.displayBalance(session, session.conversationData["accountNumber"]);  
            }
        }
    ]).triggerAction({
        matches: 'ShowBalance'
    });

    bot.dialog('IncreaseFont', [
        function (session, results, next) {
            if (!isAttachment(session)) {
                // Font size is now bigger
                botDialog.increaseSize();
                botDialog.sendToChat("Font has increased", session);
            }
        }
    ]).triggerAction({
        matches: 'IncreaseFont'
    });

    bot.dialog('DecreaseFont', [
        function (session, results, next) {
            if (!isAttachment(session)) {
                // Font size is now smaller
                botDialog.decreaseSize();
                botDialog.sendToChat("Font has decreased", session);
            }
        }
    ]).triggerAction({
        matches: 'DecreaseFont'
    });


    bot.dialog('Deposit', [
        function (session, args, next) {
            session.dialogData.args = args || {};  
            // Not yet logged in      
            if (!session.conversationData["accountNumber"]) {
                loggedIn = false;     
                next();         
            } else {
                loggedIn = true;
                next(); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                // Add to database entry the specified amount 
                // Extract cash entity
                var cashEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'cash');
                // Checks if cash entity was found
                if (loggedIn) {
                    if (cashEntity) {
                        botDialog.sendToChat('Depositing $' + cashEntity.entity + ' into your account', session);
                        balance.deposit(session, session.conversationData["accountNumber"], cashEntity.entity); 
                    } else {
                        botDialog.sendToChat("Please specify the amount you want to deposit by typing 'deposit ##', where ## refers to the amount", session);
                    }
                } else {
                    botDialog.sendToChat("ERROR: Not logged in", session);
                }             
            }
        }
    ]).triggerAction({
        matches: 'Deposit'
    });

    bot.dialog('DeleteAccount', [
        function (session, results, next) {
            if (!isAttachment(session)) {   
                botDialog.sendToChat("Deleting account", session);
                balance.deleteAccount(session, session.conversationData['accountNumber']); 
            }
        }
    ]).triggerAction({
        matches: 'DeleteAccount'
    });

    bot.dialog('GetLocation', 
        [function (session, args) {   
            if (!isAttachment(session)) {
                botDialog.sendToChat("Looking for banks", session);
                bank.displayLocation(session);
            }     
    }]).triggerAction({
        matches: 'GetLocation'
    });

    bot.dialog('CreateAccount', [
        function (session, args, next) {
            botDialog.sendToChat("Enter a name to setup your account", session);
            session.dialogData.args = args || {};  
            // Can only set up account when logged in      
            if (!session.conversationData["accountNumber"]) {
                loggedIn = false;  
                next();           
            } else {
                loggedIn = true;
                builder.Prompts.text(session, "**Please ensure you input your credentials privately**"); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["name"] = results.response;
                }
                botDialog.sendToChat("Creating account", session);
                // All new accounts start out with a balance of zero
                balance.makeAccount(session, session.conversationData["name"], session.conversationData["accountNumber"], "0", loggedIn); 
            }
        }
    ]).triggerAction({
        matches: 'CreateAccount'
    });

    bot.dialog('Login', [
        function (session, args, next) {
            botDialog.sendToChat("Logging in...", session);
            session.dialogData.args = args || {};    
            // Acquire bank account number if not yet logged in    
            if (!session.conversationData["accountNumber"]) {
                botDialog.sendToChat("Enter your account number", session);
                builder.Prompts.text(session, "**Please ensure you input your credentials privately**");              
            } else {
                botDialog.sendToChat("A user is already logged in", session); 
                next(); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) { 
                if (results.response) {
                    session.conversationData["accountNumber"] = results.response;   
                    botDialog.sendToChat("Successfully logged in", session);               
                }
            } 
        }
    ]).triggerAction({
        matches: 'Login'
    });

    bot.dialog('Logout', 
        function (session, args, next) {
            if (!isAttachment(session)) {
                botDialog.sendToChat("Logging out...", session);
                session.dialogData.args = args || {};    
                // Log out if not already done so    
                if (!session.conversationData["accountNumber"]) {
                    botDialog.sendToChat("Already logged out", session); 
                    next();             
                } else {
                    session.conversationData["accountNumber"] = null;
                    botDialog.sendToChat("Successfully logged out", session); 
                }
            }
        }
    ).triggerAction({
        matches: 'Logout'
    });

    bot.dialog('Withdraw', [
        function (session, args, next) {
            session.dialogData.args = args || {};  
            // Not yet logged in      
            if (!session.conversationData["accountNumber"]) {
                loggedIn = false;     
                next();         
            } else {
                loggedIn = true;
                next(); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                // Remove from database entry the specified amount 
                // Extract cash entity
                var cashEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'cash');
                // Converts cash entity into a negative number then back to string
                var deduct;
                var withdraw;
                // Checks if cash entity was found
                if (loggedIn) {
                    if (cashEntity) {
                        botDialog.sendToChat('Withdrawing $' + cashEntity.entity + ' from your account', session);
                        deduct = 0 - +cashEntity.entity;
                        withdraw = '' + deduct;
                        // Deposit negative amount
                        balance.deposit(session, session.conversationData["accountNumber"], withdraw); 
                    } else {
                        botDialog.sendToChat("Please specify the amount you want to withdraw by typing 'withdraw ##', where ## refers to the amount", session);
                    }
                } else {
                    botDialog.sendToChat("ERROR: Not logged in", session);
                }             
            }
        }
    ]).triggerAction({
        matches: 'Withdraw'
    });

    bot.dialog('None', 
    function (session, args, next) {
        if (!isAttachment(session)) {
            botDialog.sendToChat("Unrecognized input", session);
        }
    }).triggerAction({
        matches: 'None'
    });

    bot.dialog('Menu', 
    function (session, args, next) {
        if (!isAttachment(session)) {
            var attachment = [];   
            var card = new builder.HeroCard(session)
                .title("Do you want to:")
                .buttons([
                    builder.CardAction.imBack(session, 'Help', 'Ask for help'),
                    builder.CardAction.imBack(session, 'Login', 'Login'),
                    builder.CardAction.imBack(session, 'Logout', 'Logout'),
                    builder.CardAction.imBack(session, 'Create Account', 'Create an account'),
                    builder.CardAction.imBack(session, 'Balance', 'See your balance'), 
                    builder.CardAction.imBack(session, 'Bank Location', 'Know branch locations'), 
                    builder.CardAction.imBack(session, 'Increase Font', 'Increase my font'),
                    builder.CardAction.imBack(session, 'Decrease Font', 'Decrease my font'),            
                    builder.CardAction.imBack(session, 'Delete Account', 'Delete your account')
                ]);
            attachment.push(card);     
            // Display in carousel 
            var message = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(attachment);
            session.send(message);
        }
    }).triggerAction({
        matches: 'Menu'
    });

    // Check if there is a URL link to image
    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            //Call Custom Vision
            customVision.retrieveMessage(session);    
            return true;
        }
        else {
            return false;
        }
    }
}