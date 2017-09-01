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
$end_point_photos = 'venues/';
$photo_tag = '/photos?';
$radius = 1000;
$limit = 10;
$intent = "browse";
$category = "4bf58dd8d48988d1e0931735";
$openNow = 1;
$distanceSort = 1;
$section = "coffee";
$auth = "client_id=$clientID&client_secret=$clientSecret&v=$dateObj";
$url;
$url_photo;

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
//$json = json_encode($items);

//pravi niz dobijenih id-jeva
$id_array = array();
foreach ($items as $item)
{
    $id_array[] = $item['venue']['id'];
}
//uzima fotografije
$photo_array = array();
foreach ($id_array as $id)
{
    $url_photo = "$base_url$end_point_photos$id$photo_tag$auth&limit=$limit";
    $photo_res = file_get_contents($url_photo);
    $dec_res = json_decode($photo_res, true);
    $photo_array[] = $dec_res['response']['photos']['items'];
}
//pravi novi json sa potrebnim podacima
$return_new_array = array();
foreach ($items as $item)
{
    $photos_ex = array();
    foreach ($photo_array['0'] as $photos)
    {
        $photos_ex[] = array ("prefix" => $photos['prefix'],
            "suffix" => $photos['suffix'],
            "width" => $photos['width'],
            "height" => $photos['height']);
    }
    $return_new_array[] = array("name" => $item['venue']['name'],
        "photos" => $photos_ex,
        "price" => $item['venue']['price'],
        "lat" => $item['venue']['location']['lat'],
        "lng" => $item['venue']['location']['lng'],
        "distance" => $item['venue']['location']['distance'],
        "tips" => $item['tips']);
}
//print_r($json);
//print_r($items);
print_r(json_encode($return_new_array));
