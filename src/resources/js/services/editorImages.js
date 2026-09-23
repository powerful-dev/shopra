import { csrf, request } from './api';

export async function uploadEditorImage(image, filename) {
    const formData = new FormData();
    formData.append('file', image, filename);

    await csrf();

    const response = await request('/api/editor/images', {
        method: 'POST',
        body: formData,
    });

    return response.location;
}
