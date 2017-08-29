$(document).ready(function() {
    getPosition(true);

    $("#dist").change(function() {
        if(this.checked) {
            $("#tab_body").empty();
            getPosition(true);
        }
        else
        {
            $("#tab_body").empty();
            getPosition(false);
        }
    });

    $("#pric").change(function() {
        if(this.checked) {
            $("#tab_body").empty();
            if($('#dist').is(':checked')){
                getPosition(true);
            }
            else
            {
                getPosition(false);
            }

        }
        else
        {
            $("#tab_body").empty();
            if($('#dist').is(':checked')){
                getPosition(true);
            }
            else
            {
                getPosition(false);
            }
        }
    });

        $("li").on("click",function() {
            for(var i = 0; i<savedMarkers.length; i++){
                if($("li").val() == savedMarkers[i].name){
                    calculateAndDisplayRoute(savedMarkers[i]);
                }
            }

        });


    $("#mark").click(function() {
        for(var i = 0; i<savedMarkers.length; i++){
            if($("#bodyContent").val() == savedMarkers[i].name){
                calculateAndDisplayRoute(savedMarkers[i]);
            }
        }
    });

});

// function toggleTable() {
//     var lTable = document.getElementById("priceval");
//     lTable.style.display = (lTable.style.display == "table") ? "none" : "table";
// }
//maps
var x;
var coords = {};
var savedMarkers = new Array();

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
        var latlon = { lat: latitude, lng: longitude};
        document.getElementById("latt").innerHTML = "Latitude: "+latitude;
        document.getElementById("long").innerHTML = "Longitude: "+longitude;
        coords = {lat: latitude,lng: longitude};
        //alert("lat: " + latitude + ", lon: " + longitude);
        var val = latitude+","+longitude;
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
        getCaffeeInfo(val, check);
    });
}
function showShopPosition(multiple){

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: coords
    });

    var marker1 = new google.maps.Marker({
        position: coords,
        map: map
    });
    var circle = new google.maps.Circle({
        map: map,
        radius: 1000,    // 10 miles in metres
        fillColor: '#B5F3FF'
    });
    circle.bindTo('center', marker1, 'position');

    for (index in multiple)
    {
        savedMarkers[multiple[index].name] = addMarker(map,multiple[index]);
    }

}

function addMarker(map, data) {
    //create the markers
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        title: data.name
    });

    var contentString = '<div id="content" class="infowindow_link">'+'<div id="siteNotice">'+'</div>'+'<div id="bodyContent">'+'<p>'+data.name+'</p>'
    +'<a href="#" id="mark">Directions...</a>'+'</div>'+'</div>';

    var infowindow = new google.maps.InfoWindow({
        enableEventPropagation: true,
        content: contentString
    });

    // Open the infowindow on marker click
    google.maps.event.addListener(marker, "click", function() {
        infowindow.open(map, marker);
    });
    return marker;
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
function getCaffeeInfo(latlon, check){
    var priceEnable = 0;
    var distanceEnable = true;
    document.getElementById("dist").checked == check;
    //var userLoc = latlon;

    if(document.getElementById("pric").checked == true)
    {
        document.getElementById("priceval").style.visibility = 'visible';
        $('#pric').addClass('collapsed');
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
        var jsonp = JSON.parse(data);
        var temp, j = 1, i = 0,arr = [];
        for(var i = 0; i<jsonp.length;i++){
            var photos = jsonp[i].venue.photos.count;
            var name = jsonp[i].venue.name;
            var dist = jsonp[i].venue.location.distance;
            temp ='<tr><th scope="row">'+j+'</th><td>'+photos+'</td><a href="#"><td>'+name+'</td></span></a><td>'+dist+'</td></tr>';
            $("#tab_body").append(temp);
            arr.push({name: name, lat: jsonp[i].venue.location.lat, lng: jsonp[i].venue.location.lng});

            j = j +1;
        }
        $("#result").addClass("show");
        $("#result").removeClass("show");
        showShopPosition(arr);
    });
}

function calculateAndDisplayRoute(endDest){
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    var start = new google.maps.LatLng(coords.lat,coords.lng);
    var stop = new google.maps.LatLng(endDest.lat,endDest.lng);

    var mapOptions = {
        zoom: 16,
        center: start
    };

    var map = new google.maps.Map(document.getElementById("#map"), mapOptions);

    directionsDisplay.setMap(map);

    var request = {
        origin: start,
        destination: stop,
        travelMode: 'DRIVING'
    }

    directionsService.route(request,function (result,status) {
        if(status == "OK"){
            directionsDisplay.setDirections(result);
        }
    })
}

