<?php

require 'vendor/autoload.php';

date_default_timezone_set('Asia/Bangkok');

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;
$capsule->addConnection([
    'driver'=>'mysql',
    'host'=>'localhost',
    'database'=>'myscript_slim',
    'username'=>'narukawin',
    'password'=>'qwerty',
    'charset'=>'utf8',
    'collation'=>'utf8_general_ci',
    'prefix'=>''
]);

$capsule->setAsGlobal();

$capsule->bootEloquent();