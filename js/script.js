$(document).ready(function() {

    // Variables and Cached Selectors
    var cloakURL        = 'https://api.coinmarketcap.com/v1/ticker/cloakcoin/',
        xchangeURL      = 'https://api.fixer.io/latest?base=USD',
        $body           = $('body'),
        storedPriceUSD  = 0;
        storedPriceBTC  = 0;
        storedRateGBP   = 0;
        storedperc1h    = 0;
        storedperc1d    = 0;
        storedperc7d    = 0;
        $priceDollar    = $('#priceDollar'),
        $priceBit       = $('#priceBit'),
        $perc1h         = $('#perc1h'),
        $perc1d         = $('#perc1d'),
        $perc7d         = $('#perc7d'),
        $priceDollar    = $('#priceDollar'),
        $priceDollar    = $('#priceDollar'),
        $valueDollar    = $('#valueDollar'),
        $valueBit       = $('#valueBit'),
        $valuePounds    = $('#valuePounds'),
        $amount         = $('#amount'),
        $refresh        = $('#refresh'),
        $yourStake      = $('#yourStake'),
        $errorContainer = $('#errorContainer'),
        $hideError      = $('#hideError'),
        $lastUpdate     = $('[data-role="lastUpdate"]');

    $body.removeClass('no-js');

    function hideError () {
        $errorContainer.addClass('hidden');
    }

    function populate() {
        $valueDollar.text(parseFloat(storedPriceUSD * $amount.val()).toFixed(0));
        $valueBit.text(parseFloat(storedPriceBTC * $amount.val()).toFixed(8));
        $priceDollar.text(parseFloat(storedPriceUSD).toFixed(2));
        $perc1h.text(parseFloat(storedperc1h).toFixed(2));
        $perc1d.text(parseFloat(storedperc1d).toFixed(2));
        $perc7d.text(parseFloat(storedperc7d).toFixed(2));
        $priceBit.text(storedPriceBTC);
        $valuePounds.text(parseFloat(storedRateGBP * $valueDollar.text()).toFixed(0));
        $yourStake.text($amount.val());
        $errorContainer.addClass('hidden');
    }

    function getAjax() {
        $refresh.removeClass('btn-refresh-clicked');
        $.ajax({
            url: cloakURL,
        }).done(function(data) {
            var marketData = data[0];
            storedPriceUSD = marketData.price_usd;
            storedPriceBTC = marketData.price_btc;
            storedperc1h = marketData.percent_change_1h;
            storedperc1d = marketData.percent_change_24h;
            storedperc7d = marketData.percent_change_7d;
            populate();
        }).error(function(jqXHR, error){
            $errorContainer.removeClass('hidden');
        });

        $.ajax({
            url: xchangeURL,
        }).done(function(xchangeData) {
            storedRateGBP = xchangeData.rates.GBP;
            populate();
            setTimeout(
              function() 
              {
                $refresh.addClass('btn-refresh-clicked');
              }, 1000);
            
        }).error(function(jqXHR, error){
            $errorContainer.removeClass('hidden');
        });
        $lastUpdate.text(moment().format('ddd DD MMM, HH:mm'));
    }

    $amount.on('change, keyup', function() {
        populate();
    });

    $body.on('touchmove', function() {
        getAjax();
    });

    $refresh.on('click', function() {
        getAjax();
    });

    $hideError.on('click', function() {
        hideError();
    });

    getAjax();
});
