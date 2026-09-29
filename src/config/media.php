<?php

return [
    'image_max_kilobytes' => 5120,
    'video_max_kilobytes' => 15360,
    'webp_quality' => 80,

    'products' => [
        'max_images' => 20,
        'max_videos' => 2,
        'image_extensions' => ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
        'image_mime_types' => [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/heic',
            'image/heif',
            'image/x-heic',
            'image/x-heif',
        ],
        'video_extensions' => ['mp4', 'mov', 'webm'],
        'video_mime_types' => ['video/mp4', 'video/quicktime', 'video/webm'],
    ],
];
