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
        $refresh        = $('[data-role="refresh"]'),
        $yourStake      = $('#yourStake'),
        $errorContainer = $('#errorContainer'),
        $hideError      = $('#hideError'),
        $progress       = $('[data-role="progress"]'),
        $lastUpdateWrap = $('[data-role="lastUpdateWrap"]'),
        $lastUpdate     = $('[data-role="lastUpdate"]');

    $body.removeClass('no-js');

    // Functions
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
            $perc1h.text(parseFloat(storedperc1h).toFixed(2));
            $perc1d.text(parseFloat(storedperc1d).toFixed(2));
            $perc7d.text(parseFloat(storedperc7d).toFixed(2));
            upOrDown(storedperc1h, $perc1h);
            upOrDown(storedperc1d, $perc1d);
            upOrDown(storedperc7d, $perc7d);
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
            url: cloakURL,
        }).done(function(data) {
            var marketData = data[0];
            storedPriceUSD = marketData.price_usd;
            storedPriceBTC = marketData.price_btc;
            storedperc1h = marketData.percent_change_1h;
            storedperc1d = marketData.percent_change_24h;
            storedperc7d = marketData.percent_change_7d;
            i = i + 1;
            populate(i);
        }).error(function(jqXHR, error){
            showError();
        });

        $.ajax({
            url: xchangeURL,
        }).done(function(xchangeData) {
            storedRateGBP = xchangeData.rates.GBP;
            i = i + 1;
            populate(i);            
        }).error(function(jqXHR, error){
            showError();
        });
    }

    // Click handlers
    $amount.on('change, keyup', function() {
        populate(2);
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
});
