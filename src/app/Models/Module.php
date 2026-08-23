<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Module extends Model
{
    protected $fillable = [
        'code',
        'admin_path',
        'icon',
        'show_in_menu',
        'is_required'
    ];

    public function siteTypes(): BelongsToMany
    {
        return $this->belongsToMany(SiteType::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}