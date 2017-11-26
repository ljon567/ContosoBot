// Load module
var rest = require('../API/Restclient');

exports.displayBalance = function showBalance(session, accountNumber) {
    console.log("displayBalance function called")
    var url = 'http://contosobotlj.azurewebsites.net/tables/ContosoBot';
    rest.showBalance(url, session, accountNumber, handleBalanceResponse)
};

exports.deposit = function depositAmount(session, accountNumber, amount) {
    var url = 'http://contosobotlj.azurewebsites.net/tables/ContosoBot';
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
            session.send("ERROR: Not logged in"); 
        } else if (found === true) {
            session.send("Transaction complete"); 
        } else {
            session.send("ERROR: No account found"); 
        } 
    });
};

exports.makeAccount = function createAccount(session, name, accountNumber, balance, loggedIn) {
    var url = 'http://contosobotlj.azurewebsites.net/tables/ContosoBot';
    // Only create account if user has logged in
    if (!loggedIn) {
        session.send("ERROR: Not logged in")
    } else {
        rest.createAccount(url, name, accountNumber, balance);
        session.send("Account successfully created")
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
        session.send("ERROR: No account found"); 
    } else {
        session.send("%s, your current bank balance is: $%s", name, userBalance); 
    }                
}

exports.deleteAccount = function deleteAccount(session, accountNumber){
    var url  = 'http://contosobotlj.azurewebsites.net/tables/ContosoBot';
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
            session.send("ERROR: Not logged in"); 
        } else if (found === true) {
            session.send("Account successfully deleted"); 
        } else {
            session.send("ERROR: No account found"); 
        } 
    });
};

function handleDeletedAccountResponse(body, session, accountNumber){
    console.log('Done');
}