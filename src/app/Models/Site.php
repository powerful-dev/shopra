<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Site extends Model
{
    protected $fillable = [
        'site_type_id',
        'name',
    ];

    public function siteType(): BelongsTo
    {
        return $this->belongsTo(SiteType::class);
    }
}