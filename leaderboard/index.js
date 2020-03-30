$(document).ready(function () {

    let address = "0xaa81ca5483020798f1a8834e1fb227e1c02c8ede"
    let contractAddress = "0x93ec2167da2a83fbbe61567f67f71750c13b9c09"

    // Request for the total number of offsetted tokens
    let query = `{ contractBalance(id: "${contractAddress}") { offsetted daiReceived } }`;
    console.log(query);
    $.ajax({
        url: "https://api.thegraph.com/subgraphs/name/benesjan/co2ken",
        contentType: "application/json", type: 'POST',
        data: JSON.stringify({
            query: query
        }),
        success: function (result) {
            console.log("contractBalance", result);
            let contractBalance = result['data']['contractBalance']

            $("#contractOffsetted").html("<h1>Total number of retired CO2ken: " + contractBalance['offsetted'] + "</h1>");
            $("#daiReceived").html("<h1>Total amount of DAI spent: " + contractBalance['daiReceived'] + "</h1>");
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
            console.log(result)
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
            let balances = result['data']['userBalances'],
                content = "<table>"
            balances.forEach(userBalance => {
                content += '<tr><td>' + userBalance['id'] + '</td><td>' + userBalance['balance'] + '</td></tr>'
            })

            content += "</table>"
            $("#leaderboardContainer").append(content);
        }
    });
});