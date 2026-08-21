<?php

namespace Tests\Feature;

use App\Models\Language;
use App\Models\Module;
use App\Models\Site;
use App\Models\SiteType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommonSettingsApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Site $site;

    protected function setUp(): void
    {
        parent::setUp();

        $siteType = SiteType::query()->create([
            'code' => 'test',
            'name' => 'Test',
        ]);
        $this->site = Site::query()->create([
            'site_type_id' => $siteType->getKey(),
            'name' => 'Initial site',
        ]);
        $this->user = User::factory()->create(['is_active' => true]);

        $settingsModule = Module::query()->create([
            'code' => 'settings',
            'name' => 'Настройки',
            'admin_path' => '/admin/settings',
            'icon' => 'settings',
            'sorting' => 100,
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $this->user->modules()->attach($settingsModule);

        $this->actingAs($this->user, 'sanctum');
    }

    public function test_common_settings_can_be_loaded_with_sorted_language_lists(): void
    {
        $russian = Language::query()->create($this->language('ru', 'Русский'));
        Language::query()->create($this->language('uk', 'Українська'));
        $english = Language::query()->create($this->language('en', 'English'));
        Language::query()->create($this->language('de', 'Deutsch', false, true));

        $this->user->update(['admin_language_id' => $russian->getKey()]);
        $this->site->update(['site_language_id' => $english->getKey()]);

        $response = $this->getJson('/api/settings/common');

        $response->assertOk()
            ->assertJsonPath('data.site_name', 'Initial site')
            ->assertJsonPath('data.admin_language_id', $russian->getKey())
            ->assertJsonPath('data.site_language_id', $english->getKey())
            ->assertJsonPath('data.admin_languages.0.code', 'en')
            ->assertJsonPath('data.admin_languages.1.code', 'ru')
            ->assertJsonPath('data.admin_languages.2.code', 'uk')
            ->assertJsonCount(3, 'data.admin_languages')
            ->assertJsonCount(4, 'data.site_languages');
    }

    public function test_common_settings_update_the_site_and_current_user(): void
    {
        $adminLanguage = Language::query()->create($this->language('en', 'English', true, false));
        $siteLanguage = Language::query()->create($this->language('uk', 'Українська', false, true));

        $response = $this->putJson('/api/settings/common', [
            'site_name' => 'Updated site',
            'admin_language_id' => $adminLanguage->getKey(),
            'site_language_id' => $siteLanguage->getKey(),
        ]);

        $response->assertOk()
            ->assertJsonPath('data.site_name', 'Updated site')
            ->assertJsonPath('data.admin_language_id', $adminLanguage->getKey())
            ->assertJsonPath('data.site_language_id', $siteLanguage->getKey());

        $this->assertDatabaseHas('sites', [
            'id' => $this->site->getKey(),
            'name' => 'Updated site',
            'site_language_id' => $siteLanguage->getKey(),
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $this->user->getKey(),
            'admin_language_id' => $adminLanguage->getKey(),
        ]);
    }

    /** @return array<string, mixed> */
    private function language(string $code, string $name, bool $isAdmin = true, bool $isSite = true): array
    {
        return [
            'code' => $code,
            'name' => $name,
            'is_admin' => $isAdmin,
            'is_site' => $isSite,
            'is_active' => true,
        ];
    }
}
