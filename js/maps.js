var x;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x = "Geolocation is not supported by this browser.";
        alert(x);
    }
}
function showPosition(position) {
    var latlon = { lat: position.coords.latitude, lng: position.coords.longitude};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: latlon
    });

    var marker = new google.maps.Marker({
        position: latlon,
        map: map
    });

}
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x = "User denied the request for Geolocation.";
            alert(x);
            break;
        case error.POSITION_UNAVAILABLE:
            x = "Location information is unavailable.";
            alert(x);
            break;
        case error.TIMEOUT:
            x = "The request to get user location timed out.";
            alert(x);
            break;
        case error.UNKNOWN_ERROR:
            x = "An unknown error occurred.";
            alert(x);
            break;
    }
}
var resizing = false;
moveNavigation();
$(window).on('resize', function(){
    if( !resizing ) {
        window.requestAnimationFrame(moveNavigation);
        resizing = true;
    }
});

function moveNavigation(){
    var mq = checkMQ(); //this function returns mobile,tablet or desktop

    if ( mq == 'mobile' && topNavigation.parents('.cd-side-nav').length == 0 ) { //topNavigation = $('.cd-top-nav')
        detachElements();
        topNavigation.appendTo(sidebar); //sidebar = $('.cd-side-nav')
        searchForm.prependTo(sidebar);
    } else if ( ( mq == 'tablet' || mq == 'desktop') && topNavigation.parents('.cd-side-nav').length > 0 ) {
        detachElements();
        searchForm.insertAfter(header.find('.cd-logo')); //header = $('.cd-main-header')
        topNavigation.appendTo(header.find('.cd-nav'));
    }
    resizing = false;
}

function detachElements() {
    topNavigation.detach();//topNavigation = $('.cd-top-nav')
    searchForm.detach();//searchForm = $('.cd-search')
}


