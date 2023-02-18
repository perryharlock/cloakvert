$(document).ready(function() {

    // Variables and Cached Selectors
    var coingeckoURL    = 'https://api.coingecko.com/api/v3/coins/cloakcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false',
        xchangeURL      = 'https://free.currencyconverterapi.com/api/v5/convert?q=USD_GBP&compact=ultra&apiKey=874fb60c8bec11e45910',
        $body           = $('body'),
        storedPriceUSD  = 0;
        storedPriceBTC  = 0;
        storedRateGBP   = 0;
        storedperc1d    = 0;
        storedperc7d    = 0;
        storedperc1m    = 0;
        $priceDollar    = $('#priceDollar'),
        $priceBit       = $('#priceBit'),
        $perc1d         = $('#perc1d'),
        $perc7d         = $('#perc7d'),
        $perc1m         = $('#perc1m'),
        $priceDollar    = $('#priceDollar'),
        $priceDollar    = $('#priceDollar'),
        $valueDollar    = $('#valueDollar'),
        $valueBit       = $('#valueBit'),
        $valuePounds    = $('#valuePounds'),
        $amount         = $('#amount'),
        $refresh        = $('[data-role="refresh"]'),
        $yourStake      = $('#yourStake'),
        $errorContainer = $('#errorContainer'),
        $hideError      = $('#hideError'),
        $progress       = $('[data-role="progress"]'),
        $lastUpdateWrap = $('[data-role="lastUpdateWrap"]'),
        $lastUpdate     = $('[data-role="lastUpdate"]');

    $body.removeClass('no-js');

    // Functions
    function setStorage (){
        localStorage.setItem('cloak-amount', $amount.val());
    }

    function getStorage (){
        $amount.val(localStorage.getItem('cloak-amount'));
    }

    function upOrDown (movement, item) {
        if (movement > 0) {
            item.parent().addClass('list-perc-movement-up');
        }
        else if (movement < 0) {
            item.parent().addClass('list-perc-movement-down');
        }
    }

    function hideError() {
        $errorContainer.addClass('hidden');
    }

    function showError() {
        $errorContainer.removeClass('hidden');
        $lastUpdateWrap.removeClass('hidden');
        $progress.addClass('hidden');
    }

    function populate(i) {
        if(i == 2){
            $lastUpdate.text(moment().format('ddd DD MMM, HH:mm'));
            $valueDollar.text(parseFloat(storedPriceUSD * $amount.val()).toFixed(0));
            $valueBit.text(parseFloat(storedPriceBTC * $amount.val()).toFixed(8));
            $priceDollar.text(parseFloat(storedPriceUSD).toFixed(2));
            $perc1d.text(parseFloat(storedperc1d).toFixed(2));
            $perc7d.text(parseFloat(storedperc7d).toFixed(2));
            $perc1m.text(parseFloat(storedperc1m).toFixed(2));
            upOrDown(storedperc1d, $perc1d);
            upOrDown(storedperc7d, $perc7d);
            upOrDown(storedperc1m, $perc1m);
            $priceBit.text(storedPriceBTC);
            $valuePounds.text(parseFloat(storedRateGBP * $valueDollar.text()).toFixed(0));
            $yourStake.text($amount.val());
            $errorContainer.addClass('hidden');
            $refresh.addClass('btn-refresh-clicked');
            $progress.addClass('hidden');
            $lastUpdateWrap.removeClass('hidden');
        }
    }

    function getAjax(i) {
        $progress.removeClass('hidden');
        $lastUpdateWrap.addClass('hidden');
        $refresh.removeClass('btn-refresh-clicked');
        $.ajax({
            url: coingeckoURL,
        }).done(function(data) {
            var marketData = data;
            storedPriceUSD = marketData.market_data.current_price.usd;
            storedPriceBTC = marketData.market_data.current_price.btc;
            storedperc1d = marketData.market_data.price_change_percentage_24h;
            storedperc7d = marketData.market_data.price_change_percentage_7d;
            storedperc1m = marketData.market_data.price_change_percentage_30d;
            i++;
            populate(i);
        }).error(function(jqXHR, error){
            showError();
        });

        $.ajax({
            url: xchangeURL,
        }).done(function(xchangeData) {
            storedRateGBP = xchangeData.USD_GBP;
            i++;
            populate(i);            
        }).error(function(jqXHR, error){
            showError();
        });
    }

    // Click handlers
    $amount.on('change, keyup', function() {
        populate(2);
        setStorage();
    });

    $body.on('touchmove', function() {
        getAjax(0);
    });

    $refresh.on('click', function() {
        getAjax(0);
    });

    $hideError.on('click', function() {
        hideError();
    });

    // Lets get this party started
    getAjax(0);
    if (localStorage.getItem('cloak-amount')) {
        getStorage();
    }
    else {
        setStorage();
    }
});
