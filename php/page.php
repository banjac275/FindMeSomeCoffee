<?php
$raw_str = file_get_contents('php://input');
if($raw_str) {
    foreach (explode('&', $raw_str) as $pair) {
        $keyvalue = explode("=", $pair);
        $key = urldecode($keyvalue[0]);
        $value = urldecode($keyvalue[1]);
        $_POST[$key] = $value;
    }
}
$distanceEnable = $_POST['distance'];
$priceEnable = $_POST['price'];
$userLoc = $_POST['position'];
$clientID = 'P2LDTZ2GOGLQXZ1C2O1MI03NWHY52GHWU3VXUNY14AO4YWXU';
$clientSecret = 'D5KF5OSHQSN1425KTQVILFPURTAKPH31TFEDXTHUUAF5ITB0';
$dateObj= date('Ymd');
$base_url = 'https://api.foursquare.com/v2/';
$end_point_search = 'venues/search?';
$end_point_explore = 'venues/explore?';
$radius = 1000;
$limit = 10;
$intent = "browse";
$category = "4bf58dd8d48988d1e0931735";
$openNow = 1;
$distanceSort = 1;
$section = "coffee";
$auth = "client_id=$clientID&client_secret=$clientSecret&v=$dateObj";
$url;

if($priceEnable == 0 && $distanceEnable == false){
        $url = "$base_url$end_point_explore$auth&ll=$userLoc&radius=$radius&limit=$limit&section=$section&openNow=$openNow";
    }else if($priceEnable != 0 && $distanceEnable == false){
        $url = "$base_url$end_point_explore$auth&ll=$userLoc&radius=$radius&limit=$limit&section=$section&openNow=$openNow&price=$priceEnable";
    }else if($priceEnable == 0 && $distanceEnable == true){
        $url = "$base_url$end_point_explore$auth&ll=$userLoc&radius=$radius&limit=$limit&section=$section&openNow=$openNow&sortByDistance=$distanceSort";
    }else{
        $url = "$base_url$end_point_explore$auth&ll=$userLoc&radius=$radius&limit=$limit&section=$section&openNow=$openNow&price=$priceEnable&sortByDistance=$distanceSort";
    }

    //echo $userLoc;
$results = file_get_contents($url);

$json_results = json_decode($results, true);

$groups = $json_results['response']['groups'];
$items = $groups['0']['items'];
$json = json_encode($items);

print_r($json);

