// <script src="https://raw.githubusercontent.com/CO2ken/demo-frontend/master/leaderboard/leaderboard.js"></script>

function showContractTotals() {
  let contractAddress = "0x93ec2167da2a83fbbe61567f67f71750c13b9c09";

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
      if (!contractBalance) {
        console.warn("Failed to get totals for contract");
        return;
      }
      let offset = contractBalance['offsetted'] / 1e18;
      let daiReceived = contractBalance["daiReceived"] / 1e18;
      $("#contract-retired-co2kens").text(offset);
      $("#contract-dai-received").text(daiReceived);
    }
  })
}

function showUserResults(address) {
  console.log(`Getting results for ${address}`);
  let query = `{ userBalance(id: \"${address.toLowerCase()}\") { id balance daiSpent } }`;
  console.log(query);
  $.ajax({
    url: "https://api.thegraph.com/subgraphs/name/benesjan/co2ken",
    contentType: "application/json", type: 'POST',
    data: JSON.stringify({ query: query }),
    success: function (result) {
      console.log(result);
      let userBalance = result['data']['userBalance'];
      if (!userBalance) {
        console.log(`No events found for user ${address}`);
        return;
      }
      let retiredCO2kenDecimals = userBalance['balance'];
      retiredCO2ken = retiredCO2kenDecimals / 1e18;
      let daiSpent = userBalance['daiSpent'] / 1e18;
      // let totalDaiSpent = ...;
      console.log("Retired CO2ken:", retiredCO2kenDecimals);
      $("#user-retired-co2kens").text(retiredCO2ken);
      $("#user-dai-spent").text(daiSpent);
    }
  });
}

function showLeaderBoard(userAddress) {
  // Request for top 20 addresses
  $.ajax({
    url: "https://api.thegraph.com/subgraphs/name/benesjan/co2ken",
    contentType: "application/json", type: 'POST',
    data: JSON.stringify({
      query: `{ userBalances(orderBy: balance, orderDirection: desc) { id balance daiSpent } }`
    }),
    success: function (result) {
      console.log("userBalances", result);
      let balances = result['data']['userBalances'];
      let content = `
        <table id="leaderboard">
          <tr>
            <th class="userRank" align="left">Rank</th>
            <th class="userAddress" align="left">Wallet address</th>
            <th class="userBalance">Tonnes of <br/>CO2 offset</th>
            <th class="userDAI">DAI spent</th>
          </tr>`;
      balances.forEach((userBalance, i) => {
        let balance = (userBalance["balance"] / 1e18).toFixed(2);
        let daiSpent = (userBalance["daiSpent"] / 1e18).toFixed(2);
        let address = userBalance["id"];
        let currentUser = address == userAddress;
        if (currentUser) {
          $("#leaderboard-rank").text(i + 1);
        }
        if (i < 20) {
          content += `
            <tr${currentUser ? ' class="current-user"' : ''}>
              <td class="userRank" align="left">#${i + 1}</td>
              <td class="userAddress">${address}</td>
              <td class="userBalance" align="right">${balance}</td>
              <td class="userDAI" align="right">${daiSpent}</td>
            </tr>`;
        }
      })

      content += "</table>"
      $("#leaderboard-container").html(content);
    }
  });
}

$(document).ready(function () {
  $("#leaderboard-rank").text("...");
  $("#user-retired-co2kens").text("...");
  $("#user-dai-spent").text("...");

  showContractTotals();

  window.addEventListener('dappHeroConfigLoaded', ({ detail: dappHero }) => {
    if (dappHero.provider) {
      let userAddress = dappHero.provider.selectedAddress;
      window.userAddress = userAddress;
      if (userAddress) {
        $("#eth-address").val(userAddress);
        console.log("Currently connected user address", userAddress);
        showUserResults(userAddress);
        showLeaderBoard(userAddress);
      }
      else {
        console.warn("dappHero.provider non-null but no user address given");
      }
    }
  });

  $("#eth-address-search").click(function () {
    let address = $("#eth-address").val();
    showUserResults(address);
    showLeaderBoard(address);
  });

  $("#reset-wallet-address").click(function () {
    $("#eth-address").val(window.userAddress);
    showUserResults(window.userAddress);
    showLeaderBoard(window.userAddress);
  });
});
