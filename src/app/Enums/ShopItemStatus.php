<?php

namespace App\Enums;

enum ShopItemStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Archived = 'archived';
}
