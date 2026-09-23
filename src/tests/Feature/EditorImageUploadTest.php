<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EditorImageUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_upload_an_editor_image(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create(['is_active' => true]), 'web');

        $response = $this->post('/api/editor/images', [
            'file' => UploadedFile::fake()->create('content.png', 100, 'image/png'),
        ], ['Accept' => 'application/json']);

        $response
            ->assertCreated()
            ->assertJsonStructure(['location']);

        $location = $response->json('location');

        $this->assertStringStartsWith('/storage/editor/', $location);
        Storage::disk('public')->assertExists(str($location)->after('/storage/')->toString());
    }

    public function test_editor_image_upload_requires_an_image(): void
    {
        $this->actingAs(User::factory()->create(['is_active' => true]), 'web');

        $this->postJson('/api/editor/images', [
            'file' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ])->assertUnprocessable()->assertJsonValidationErrors('file');
    }

    public function test_editor_image_upload_requires_authentication(): void
    {
        $this->postJson('/api/editor/images')->assertUnauthorized();
    }
}
