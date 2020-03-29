$(document).ready(function () {

    let address = "0xaa81ca5483020798f1a8834e1fb227e1c02c8ede"
    let contractAddress = "0x6a1b0c693dd4aa99ba8e93247aa221fb30525cfe"

    // Request for the total number of offsetted tokens
    $.ajax({
        url: "https://api.thegraph.com/subgraphs/name/benesjan/co2ken",
        contentType: "application/json", type: 'POST',
        data: JSON.stringify({
            query: `{ contractBalances(id: \"${contractAddress}\") { offsetted } }`
        }),
        success: function (result) {
            let contractOffsetted = result['data']['contractBalances'][0]['offsetted']
            $("#contractOffsetted").html("<h1>Total number of retired CO2ken: " + contractOffsetted + "</h1>");
        }
    });

    // Request for one address
    $.ajax({
        url: "https://api.thegraph.com/subgraphs/name/benesjan/co2ken",
        contentType: "application/json", type: 'POST',
        data: JSON.stringify({
            query: `{ userBalances(id: \"${address}\") { balance } }`
        }),
        success: function (result) {
            let userBalance = result['data']['userBalances'][0]['balance']
            $("#userBalanceContainer").html("<h1>User Balance: " + userBalance + "</h1>");
        }
    });

    // Request for top 20 addresses
    $.ajax({
        url: "https://api.thegraph.com/subgraphs/name/benesjan/co2ken",
        contentType: "application/json", type: 'POST',
        data: JSON.stringify({
            query: `{ userBalances(first: 20) { id, balance } }`
        }),
        success: function (result) {
            let balances = result['data']['userBalances']
            console.log(balances)
            let content = "<table>"
            balances.forEach(userBalance => {
                console.log(userBalance)
                content += '<tr><td>' + userBalance['id'] + '</td><td>' + userBalance['balance'] + '</td></tr>'
            })

            content += "</table>"
            $("#leaderboardContainer").append(content);
        }
    });
});