<?php

require __DIR__.'/../../bootstrap.php';

use Illuminate\Database\Capsule\Manager as Capsule;

class CreateEmployeeTable {
    public function run() {
        Capsule::schema()->dropIfExists('employees');
        Capsule::schema()->create('employees',function($table){
            $table->increments('id');
            $table->string('name');
            $table->integer('age');
            $table->timestamps();
        });
    }
}

$createEmployeeTable = new CreateEmployeeTable();
$createEmployeeTable->run();
