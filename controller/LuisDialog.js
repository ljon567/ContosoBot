// Load modules
var builder = require('botbuilder');
var balance = require('../controller/BankBalance');
//var restaurant = require('./RestaurantCard');
//var nutrition = require('./NutritionCard');
//var customVision = require('../controller/CustomVision');
//var qna = require('../controller/QnAMaker');

exports.startDialog = function (bot) {
    
    // Link to LUIS app
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/734b3a52-2213-4887-a556-655bd873422e?subscription-key=64c3a8d306a14b47a6f6c38e2f4e339f&verbose=true&timezoneOffset=0&q=');

    // Boolean to check if user has logged in yet or not
    var loggedIn = true;

    // Connect to chat bot
    bot.recognizer(recognizer);

    bot.dialog('ShowBalance', [
        function (session, results, next) {
            if (!isAttachment(session)) {
                session.send("Showing your balance");
                balance.displayBalance(session, session.conversationData["accountNumber"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            }
        }
    ]).triggerAction({
        matches: 'ShowBalance'
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
                        session.send('Depositing $%s into your account', cashEntity.entity);
                        balance.deposit(session, session.conversationData["accountNumber"], cashEntity.entity); 
                    } else {
                        session.send("Please specify the amount you want to deposit")
                    }
                } else {
                    session.send("ERROR: Not logged in");
                }             
            }
        }
    ]).triggerAction({
        matches: 'Deposit'
    });

    bot.dialog('DeleteAccount', [
        function (session, results, next) {
            if (!isAttachment(session)) {   
                session.send("Deleting account");
                balance.deleteAccount(session, session.conversationData['accountNumber']); 
            }
        }
    ]).triggerAction({
        matches: 'DeleteAccount'
    });

    bot.dialog('GetLocation', 
        [function (session, args) {
        
            if (!isAttachment(session)) {
                // Pulls out the food entity from the session if it exists
                //var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');
        
                // Checks if the for entity was found
                // if (foodEntity) {
                //     session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                //     restaurant.displayRestaurantCards(foodEntity.entity, "auckland", session);
                // } else {
                    session.send("Getting bank locations");
                //}
            }
        
    }]).triggerAction({
        matches: 'GetLocation'
    });

    bot.dialog('CreateAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};  
            // Not yet logged in      
            if (!session.conversationData["accountNumber"]) {
                loggedIn = false;  
                next();           
            } else {
                loggedIn = true;
                builder.Prompts.text(session, "Enter a name to setup your account"); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["name"] = results.response;
                }
                session.send("Creating account");
                balance.makeAccount(session, session.conversationData["name"], session.conversationData["accountNumber"], "0", loggedIn); 
            }
        }
    ]).triggerAction({
        matches: 'CreateAccount'
    });

    bot.dialog('Login', [
        function (session, args, next) {
            session.send("Logging in...");
            session.dialogData.args = args || {};    
            // Acquire name and bank account number if not yet logged in    
            if (!session.conversationData["accountNumber"]) {
                builder.Prompts.text(session, "Enter your account number");              
            } else {
                session.send("A user is already logged in"); 
                next(); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) { 
                if (results.response) {
                    session.conversationData["accountNumber"] = results.response;   
                    session.send("Successfully logged in");               
                }
            } 
        }
    ]).triggerAction({
        matches: 'Login'
    });

    bot.dialog('Logout', 
        function (session, args, next) {
            session.send("Logging out...");
            session.dialogData.args = args || {};    
            // Log out if not already done so    
            if (!session.conversationData["accountNumber"]) {
                session.send("Already logged out"); 
                next();             
            } else {
                session.conversationData["accountNumber"] = null;
                session.send("Successfully logged out"); 
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
                // Converts amount into a negative number
                var deduct;
                var withdraw;
                // Checks if cash entity was found
                if (loggedIn) {
                    if (cashEntity) {
                        session.send('Withdrawing $%s from your account', cashEntity.entity);
                        deduct = 0 - +cashEntity.entity;
                        withdraw = '' + deduct;
                        balance.deposit(session, session.conversationData["accountNumber"], withdraw); 
                    } else {
                        session.send("Please specify the amount you want to withdraw")
                    }
                } else {
                    session.send("ERROR: Not logged in");
                }             
            }
        }
    ]).triggerAction({
        matches: 'Withdraw'
    });

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