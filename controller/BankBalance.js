// Load module
var rest = require('../API/Restclient');

exports.displayBalance = function showBalance(session, accountNumber){
    console.log("displayBalance function called")
    var url = 'http://contosobotlj.azurewebsites.net/tables/ContosoBot';
    rest.showBalance(url, session, accountNumber, handleBalanceResponse)
};

// exports.sendFavouriteFood = function postFavouriteFood(session, username, favouriteFood){
//     var url = 'https://foodbotljon567.azurewebsites.net/tables/FoodBot';
//     rest.postFavouriteFood(url, username, favouriteFood);
// };

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

// exports.deleteFavouriteFood = function deleteFavouriteFood(session,username,favouriteFood){
//     var url  = 'https://foodbotljon567.azurewebsites.net/tables/FoodBot';

//     rest.getFavouriteFood(url,session, username,function(message,session,username){
//      var   allFoods = JSON.parse(message);

//         for(var i in allFoods) {
//             if (allFoods[i].favouriteFood === favouriteFood && allFoods[i].username === username) {
//                 console.log(allFoods[i]);

//                 rest.deleteFavouriteFood(url,session,username,favouriteFood, allFoods[i].id ,handleDeletedFoodResponse)

//             }
//         }


//     });


// };

// function handleDeletedFoodResponse(body,session,username, favouriteFood){
//     console.log('Done');
// }