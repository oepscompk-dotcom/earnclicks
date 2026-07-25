<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$u = App\Models\User::where('email','admin@earnclicks.app')->first();
echo $u ? $u->email . ' | ' . $u->role . ' | ' . $u->password : 'NOT FOUND';