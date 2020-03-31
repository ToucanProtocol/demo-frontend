// <script src="https://raw.githubusercontent.com/CO2ken/demo-frontend/master/leaderboard/leaderboard.js"></script>

function showUserResults(address) {
  console.log(`Getting results for ${address}`);
  let query = `{ userBalance(id: \"${address.toLowerCase()}\") { id balance } }`;
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
      console.log("Retired CO2ken:", retiredCO2kenDecimals);
      $("#user-retired-co2kens").text(retiredCO2ken);
    }
  });
}

function getContractTotals() {
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

$(document).ready(function () {
  let leaderboardPlace = "...";
  let retiredCO2ken = "...";
  let totalDaiSpent = "...";

  $("#leaderboard-rank").text(1);
  $("#user-retired-co2kens").text(retiredCO2ken);
  $("#user-dai-spent").text(totalDaiSpent);

  getContractTotals();

  window.addEventListener('dappHeroConfigLoaded', ({ detail: dappHero }) => {
    if (dappHero.provider) {
      let userAddress = dappHero.provider.selectedAddress;
      if (userAddress) {
        $("#current-eth-address").val(userAddress);
        console.log("Currently connected user address", userAddress);
        showUserResults(userAddress);
      }
      else {
        console.warn("dappHero.provider non-null but no user address given");
      }
    }
  });

  $("#eth-address-search").click(function () {
    let address = $("#eth-address").val();
    showUserResults(address);
  });
});
