<?php

namespace App\Services;

use App\Models\Language;
use App\Models\Site;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CommonSettingsService
{
    /** @return array<string, mixed> */
    public function get(User $user): array
    {
        $site = Site::query()->firstOrFail();

        return [
            'site_name' => $site->name,
            'admin_language_id' => $user->admin_language_id,
            'site_language_id' => $site->site_language_id,
            'admin_languages' => $this->languagesFor('is_admin'),
            'site_languages' => $this->languagesFor('is_site'),
        ];
    }

    /** @param array{site_name: string, admin_language_id: int, site_language_id: int} $data */
    public function update(User $user, array $data): array
    {
        DB::transaction(function () use ($user, $data): void {
            $site = Site::query()->firstOrFail();
            $site->update([
                'name' => $data['site_name'],
                'site_language_id' => $data['site_language_id'],
            ]);

            $user->update([
                'admin_language_id' => $data['admin_language_id'],
            ]);
        });

        return $this->get($user->refresh());
    }

    private function languagesFor(string $column): array
    {
        return Language::query()
            ->where($column, true)
            ->orderBy('code')
            ->get(['id', 'code', 'name'])
            ->toArray();
    }
}
