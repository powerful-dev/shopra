export function formatMediaExtensions(extensions) {
    const normalized = extensions.map((extension) => extension.toLowerCase() === 'jpeg' ? 'jpg' : extension.toLowerCase());

    return [...new Set(normalized)]
        .map((extension) => ({ webp: 'WebP', webm: 'WebM' })[extension] ?? extension.toUpperCase())
        .join(', ');
}
