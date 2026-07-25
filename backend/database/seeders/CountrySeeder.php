<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            ['name' => 'United States', 'code' => 'US', 'currency' => 'USD'],
            ['name' => 'United Kingdom', 'code' => 'GB', 'currency' => 'GBP'],
            ['name' => 'Canada', 'code' => 'CA', 'currency' => 'CAD'],
            ['name' => 'Australia', 'code' => 'AU', 'currency' => 'AUD'],
            ['name' => 'Germany', 'code' => 'DE', 'currency' => 'EUR'],
            ['name' => 'France', 'code' => 'FR', 'currency' => 'EUR'],
            ['name' => 'India', 'code' => 'IN', 'currency' => 'INR'],
            ['name' => 'Brazil', 'code' => 'BR', 'currency' => 'BRL'],
            ['name' => 'Japan', 'code' => 'JP', 'currency' => 'JPY'],
            ['name' => 'Nigeria', 'code' => 'NG', 'currency' => 'NGN'],
            ['name' => 'Philippines', 'code' => 'PH', 'currency' => 'PHP'],
            ['name' => 'Indonesia', 'code' => 'ID', 'currency' => 'IDR'],
            ['name' => 'Pakistan', 'code' => 'PK', 'currency' => 'PKR'],
            ['name' => 'Bangladesh', 'code' => 'BD', 'currency' => 'BDT'],
            ['name' => 'Mexico', 'code' => 'MX', 'currency' => 'MXN'],
            ['name' => 'Turkey', 'code' => 'TR', 'currency' => 'TRY'],
            ['name' => 'Egypt', 'code' => 'EG', 'currency' => 'EGP'],
            ['name' => 'South Africa', 'code' => 'ZA', 'currency' => 'ZAR'],
            ['name' => 'Kenya', 'code' => 'KE', 'currency' => 'KES'],
            ['name' => 'Ghana', 'code' => 'GH', 'currency' => 'GHS'],
        ];

        DB::table('countries')->insert($countries);
    }
}
