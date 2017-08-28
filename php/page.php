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

$url = $_POST['url'];
echo file_get_contents($url);