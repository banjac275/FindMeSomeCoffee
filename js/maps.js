//maps
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

    document.getElementById("latt").innerHTML = "Latitude: "+position.coords.latitude;
    document.getElementById("long").innerHTML = "Longitude: "+position.coords.longitude;

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: latlon
    });

    var marker = new google.maps.Marker({
        position: latlon,
        map: map
    });

    var circle = new google.maps.Circle({
        map: map,
        radius: 1000,    // 10 miles in metres
        fillColor: '#B5F3FF'
    });
    circle.bindTo('center', marker, 'position');
    var val = position.coords.latitude+","+position.coords.longitude;
    getCaffeeInfo(val);
}
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x = "Please restart page and enable geolocation. Geolocation is needed in order for this to work.";
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

function lat(callback) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        callback.call(null, lat, lon);
    }, function (error) {
        console.log("Something went wrong: ", error);
    });
}

function getPosition(check) {
    lat(function (latitude, longitude) {
        document.getElementById("latt").innerHTML = "Latitude: "+latitude;
        document.getElementById("long").innerHTML = "Longitude: "+longitude;
        var theDate = Date.now();
        var dateString = theDate.toUTCString();
        document.getElementById("upd").innerHTML = dateString;
        //alert("lat: " + latitude + ", lon: " + longitude);
        var val = latitude+","+longitude;
        getCaffeeInfo(val, check);
    });
}

//sidebar
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

//foursquare
function getDistance(lat, long) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var latLngA = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            var latLngB = new google.maps.LatLng(lat, long);
            var distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
            return distance;
        },
        function() {
            alert("geolocation not supported!!");
        }
    );
}

function getCaffeeInfo(latlon, check){
    var priceEnable = 0;
    var distanceEnable = false;

    document.getElementById("dist").checked = check;
    //var userLoc = latlon;

    if(document.getElementById("pric").checked == true)
    {
        document.getElementById("priceval").style.visibility = 'visible';
        var radios = document.getElementsByName("test");
        for(var i = 0, length = radios.length; i<length; i++){
            if(radios[i].checked){
                priceEnable = radios[i].value;
            }
        }
    }else{
        document.getElementById("priceval").style.visibility = 'hidden';
        priceEnable = 0;
    }

    if(document.getElementById("dist").checked == true){
        distanceEnable = true;
    }
    else{
        distanceEnable = false;
    }

    //var locate = userLoc;

    $.post('php/page.php', { distance: distanceEnable, price: priceEnable, position: latlon  }, function(data) {
        document.getElementById('tab_body').innerHTML = data;
        //var jsonp = JSON.parse(data);
        //alert(data);
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
        origin: pointA,
        destination: pointB,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

$(document).ready(function() {
    getPosition();

    $("#dist").on("click", function(){
        if(distance.checked) {
            alert("Checkbox is checked.");
        } else {
            alert("Checkbox is unchecked.");
        }
    });
});

