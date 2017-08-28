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

    document.getElementById('long').value = position.coords.longitude;
    document.getElementById('latt').value = position.coords.latitude;

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
function initGeolocation()
{
    if( navigator.geolocation )
    {
        // Call getCurrentPosition with success and failure callbacks
        navigator.geolocation.getCurrentPosition( success, fail );
    }
    else
    {
        alert("Sorry, your browser does not support geolocation services.");
    }
}

function success(position)
{
    var loc = position.coords.longitude+","+position.coords.latitude;
    return loc;
}

function fail(data)
{
    alert(data);
}

function getCaffeeInfo(){
    var priceEnable = 0;
    var distanceEnable = false;
    var clientID = 'P2LDTZ2GOGLQXZ1C2O1MI03NWHY52GHWU3VXUNY14AO4YWXU';
    var clientSecret = 'D5KF5OSHQSN1425KTQVILFPURTAKPH31TFEDXTHUUAF5ITB0';
    var dateObj= new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newDate = year + month + day;
    var base_url = 'https://api.foursquare.com/v2/';
    var end_point_search = 'venues/search?';
    var end_point_explore = 'venues/explore?';
    var radius = 1000;
    var userLoc = initGeolocation();
    var limit = 10;
    var intent = "browse";
    var category = "4bf58dd8d48988d1e0931735";
    var openNow = 1;
    var distanceSort = 1;
    var section = "coffee";
    var auth = "client_id="+clientID+"&client_secret="+clientSecret+"&v="+newDate;
    var url, result, jdata;
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

    if(priceEnable == 0 && distanceEnable == false){
        url = base_url+end_point_explore+auth+"&ll="+userLoc+"&radius="+radius+"&limit="+limit+"&section="+section+"&openNow="+openNow;
    }else if(priceEnable != 0 && distanceEnable == false){
        url = base_url+end_point_explore+auth+"&ll="+userLoc+"&radius="+radius+"&limit="+limit+"&section="+section+"&openNow="+openNow+"&price="+priceEnable;
    }else if(priceEnable == 0 && distanceEnable == true){
        url = base_url+end_point_explore+auth+"&ll="+userLoc+"&radius="+radius+"&limit="+limit+"&section="+section+"&openNow="+openNow+"&sortByDistance="+distanceSort;
    }else{
        url = base_url+end_point_explore+auth+"&ll="+userLoc+"&radius="+radius+"&limit="+limit+"&section="+section+"&openNow="+openNow+"&price="+priceEnable+"&sortByDistance="+distanceSort;
    }

    alert(url);

    $.post('php/page.php', { url: url }, function(data) {
        alert(data);
    });
}

