$(document).ready(function() {

    // Variables and Cached Selectors
    var cloakURL        = 'https://api.coinmarketcap.com/v1/ticker/cloakcoin/',
        xchangeURL      = 'https://api.fixer.io/latest?base=USD',
        $body           = $('body'),
        storedPriceUSD  = 0;
        storedPriceBTC  = 0;
        storedRateGBP   = 0;
        $priceDollar    = $("#priceDollar"),
        $priceBit       = $("#priceBit"),
        $valueDollar    = $("#valueDollar"),
        $valueBit       = $("#valueBit"),
        $valuePounds    = $("#valuePounds"),
        $amount         = $("#amount"),
        $refresh        = $("#refresh"),
        $yourStake      = $("#yourStake"),
        $lastUpdate     = $("#lastUpdate");

    $body.removeClass("no-js");

    function populate() {
        $valueDollar.text(parseFloat(storedPriceUSD * $amount.val()).toFixed(2));
        $valueBit.text(parseFloat(storedPriceBTC * $amount.val()).toFixed(8));
        $priceDollar.text(parseFloat(storedPriceUSD).toFixed(2));
        $priceBit.text(storedPriceBTC);
        $valuePounds.text(parseFloat(storedRateGBP * $valueDollar.text()).toFixed(2));
        $yourStake.text($amount.val());
    }

    function getAjax() {
        $refresh.removeClass("btn-clicked");
        $.ajax({
            url: cloakURL,
        }).done(function(data) {
            var marketData = data[0];
            storedPriceUSD = marketData.price_usd;
            storedPriceBTC = marketData.price_btc;
            populate();
        }).error(function(jqXHR, error){
            console.log(error);
        });

        $.ajax({
            url: xchangeURL,
        }).done(function(xchangeData) {
            storedRateGBP = xchangeData.rates.GBP;
            populate();
            setTimeout(
              function() 
              {
                $refresh.addClass("btn-clicked");
              }, 1000);
            
        }).error(function(jqXHR, error){
            console.log(error);
        });
        $lastUpdate.text(moment().format('ddd DD MMM, hh:mm'));
    }

    $amount.on('change, keyup', function() {
        populate();
    });

    $(window).scroll(function() {
        getAjax();
    });

    $refresh.on('click', function() {
        getAjax();
    });

    getAjax();
});
