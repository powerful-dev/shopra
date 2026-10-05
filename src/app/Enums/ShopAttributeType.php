<?php

namespace App\Enums;

enum ShopAttributeType: string
{
    case Select = 'select';
    case Multiselect = 'multiselect';
    case Text = 'text';
    case Number = 'number';
    case Boolean = 'boolean';
}
