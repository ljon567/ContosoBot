// For reasons unknown, the table created for this bot suddenly stopped working. 
// In order to get around this problem, the table created for the lectures is being used instead.

// Load modules
var rest = require('../API/Restclient');
var botDialog = require('../controller/chatDisplay');

exports.displayBalance = function showBalance(session, accountNumber) {
    console.log("displayBalance function called")
    var url = 'https://foodbotljon567.azurewebsites.net/tables/FoodBot';
    rest.showBalance(url, session, accountNumber, handleBalanceResponse)
};

exports.deposit = function depositAmount(session, accountNumber, amount) {
    var url = 'https://foodbotljon567.azurewebsites.net/tables/FoodBot';
    rest.showBalance(url, session, accountNumber, function(message, session, accountNumber){
        var allAccounts = JSON.parse(message);
        var found = false;
        var sum;
        var name;
        var balance;
        // Look for right account to deposit into
        for(var index in allAccounts) {
            if (allAccounts[index].accountNumber === accountNumber) {
                found = true;
                console.log(allAccounts[index]);
                sum = +allAccounts[index].balance + +amount;
                balance = '' + sum;
                name = allAccounts[index].name;
                rest.deleteAccount(url, session, accountNumber, allAccounts[index].id, handleDeletedAccountResponse)
                rest.createAccount(url, name, accountNumber, balance);
            }
        }
        if (accountNumber === null) {
            botDialog.sendToChat("ERROR: Not logged in", session); 
        } else if (found === true) {
            botDialog.sendToChat("Transaction complete", session); 
        } else {
            botDialog.sendToChat("ERROR: No account found", session); 
        } 
    });
};

exports.makeAccount = function createAccount(session, name, accountNumber, balance, loggedIn) {
    var url = 'https://foodbotljon567.azurewebsites.net/tables/FoodBot';
    // Only create account if user has logged in
    if (!loggedIn) {
        botDialog.sendToChat("ERROR: Not logged in", session)
    } else {
        rest.createAccount(url, name, accountNumber, balance);
        botDialog.sendToChat("Account successfully created", session)
    }
};

function handleBalanceResponse(message, session, accountNumber) {
    console.log("handleBalanceResponse function called");
    var BalanceResponse = JSON.parse(message);
    var userBalance = null;
    var name = null;
    // Look for right account
    for (var index in BalanceResponse) {
        console.log("Sorting through accounts");
        var nameReceived = BalanceResponse[index].name;
        var accountNumberReceived = BalanceResponse[index].accountNumber;
        var balanceReceived = BalanceResponse[index].balance;
        // Convert to lower case and check if right account
        if (accountNumber == accountNumberReceived) {
            console.log("Account found");
            userBalance = balanceReceived;
            name = nameReceived
        }        
    }
    // Print balance
    if (userBalance === null) {
        botDialog.sendToChat("ERROR: No account found", session); 
    } else {
        botDialog.sendToChat(name + ", your current bank balance is: $" + userBalance, session); 
    }                
}

exports.deleteAccount = function deleteAccount(session, accountNumber){
    var url  = 'https://foodbotljon567.azurewebsites.net/tables/FoodBot';
    rest.showBalance(url, session, accountNumber, function(message, session, accountNumber){
        var allAccounts = JSON.parse(message);
        var found = false;
        // Look for right account to delete
        for(var index in allAccounts) {
            if (allAccounts[index].accountNumber === accountNumber) {
                found = true;
                console.log(allAccounts[index]);
                rest.deleteAccount(url, session, accountNumber, allAccounts[index].id, handleDeletedAccountResponse)
            }
        }
        if (accountNumber === null) {
            botDialog.sendToChat("ERROR: Not logged in", session); 
        } else if (found === true) {
            botDialog.sendToChat("Account successfully deleted", session); 
        } else {
            botDialog.sendToChat("ERROR: No account found", session); 
        } 
    });
};

function handleDeletedAccountResponse(body, session, accountNumber){
    console.log('Done');
}