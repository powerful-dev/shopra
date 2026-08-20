<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SiteType extends Model
{
    protected $fillable = [
        'code',
        'name',
    ];

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class);
    }
}