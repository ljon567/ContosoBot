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
        // function (session, args, next) {
        //     session.dialogData.args = args || {};        
        //     if (!session.conversationData["username"]) {
        //         builder.Prompts.text(session, "Enter a username to setup your account.");                
        //     } else {
        //         next(); // Skip if we already have this info.
        //     }
        // },
        function (session, results, next) {
            if (!isAttachment(session)) {

                // if (results.response) {
                //     session.conversationData["username"] = results.response;
                // }
                // Pulls out the food entity from the session if it exists
                //var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
    
                // Checks if the food entity was found
                // if (foodEntity) {
                //     session.send('Thanks for telling me that \'%s\' is your favourite food', foodEntity.entity);
                //     food.sendFavouriteFood(session, session.conversationData["username"], foodEntity.entity); // <-- LINE WE WANT
    
                // } else {
                    session.send("Depositing into your account");
                //}
            }
        }
    ]).triggerAction({
        matches: 'Deposit'
    });

    bot.dialog('DeleteAccount', [
        // function (session, args, next) {
        //     session.dialogData.args = args || {};
        //     if (!session.conversationData["username"]) {
        //         builder.Prompts.text(session, "Enter a username to setup your account.");
        //     } else {
        //         next(); // Skip if we already have this info.
        //     }
        // },
        function (session, results,next) {
        if (!isAttachment(session)) {

            // if (results.response) {
            //     session.conversationData["username"] = results.response;
            // }    

            session.send("You want to delete an account");

            // Pulls out the food entity from the session if it exists
            //var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');

            // Checks if the for entity was found
            // if (foodEntity) {
            //     session.send('Deleting \'%s\'...', foodEntity.entity);
            //     food.deleteFavouriteFood(session,session.conversationData['username'],foodEntity.entity); //<--- CALLL WE WANT
            // } else {
            //     session.send("No food identified! Please try again");
            // }
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

    bot.dialog('CreateAccount', 
        function (session, args) {
            if (!isAttachment(session)) {

                // Pulls out the food entity from the session if it exists
                //var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

                // Checks if the for entity was found
                // if (foodEntity) {
                //     session.send('Calculating calories in %s...', foodEntity.entity);
                //     nutrition.displayNutritionCards(foodEntity.entity, session);
                // } else {
                    session.send("You want to create an account");
                //}
            }
    }).triggerAction({
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

    bot.dialog('Withdraw', 
    function (session, args) {
        if (!isAttachment(session)) {

            // Pulls out the food entity from the session if it exists
            //var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            // if (foodEntity) {
            //     session.send('Calculating calories in %s...', foodEntity.entity);
            //     nutrition.displayNutritionCards(foodEntity.entity, session);
            // } else {
                session.send("Withdrawing from your account");
            //}
        }
    }).triggerAction({
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