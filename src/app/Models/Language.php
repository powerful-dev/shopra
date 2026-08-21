<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $fillable = [
        'code',
        'name',
        'is_admin',
        'is_site',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
            'is_site' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
