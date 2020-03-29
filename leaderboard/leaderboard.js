// <script src="https://raw.githubusercontent.com/CO2ken/demo-frontend/master/leaderboard/index.js"></script>

$(document).ready(function () {

    let ethAddress;
    
    setTimeout( function() {
        ethAddress = $("#eth-user-address").val();
	    console.log(ethAddress);
        $("#current-eth-address").val(ethAddress);
    }, 2000);
    
    let leaderboardPlace = "...";
    let retiredCO2ken = "...";
    let totalDaiSpent = "...";

    $("#leaderboard-place").text(leaderboardPlace);
    $("#total-retired-co2ken").text(retiredCO2ken);
    $("#total-dai-spent").text(totalDaiSpent);

    $("#eth-address-search").click(function () {
        let address = $("#eth-address-search").val();

        $.ajax({
        url: "https://api.thegraph.com/subgraphs/name/benesjan/co2ken",
        contentType: "application/json", type: 'POST',
        data: JSON.stringify({
            query: `{ userBalances(id: \"${address}\") { balance } }`
        }),
        success: function (result) {
            let retiredCO2kenDecimals = result['data']['userBalances'][0]['balance'];
            retiredCO2ken = retiredCO2kenDecimals / 1e18;
            $("#total-retired-co2ken").text(retiredCO2ken);
        }
        });
    });
});