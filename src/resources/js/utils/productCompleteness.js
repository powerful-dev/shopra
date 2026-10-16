const descriptionMinimumLength = 50;

const criteria = [
    { id: 'name', sectionId: 'main', points: 15, isComplete: ({ name }) => hasText(name) },
    { id: 'price', sectionId: 'price', points: 15, isComplete: ({ price }) => isValidPrice(price) },
    { id: 'category', sectionId: 'main', points: 10, isComplete: ({ categoryCount }) => categoryCount > 0 },
    { id: 'first-photo', sectionId: 'photo', points: 10, isComplete: ({ photoCount }) => photoCount > 0 },
    { id: 'photo-gallery', sectionId: 'photo', points: 10, isComplete: ({ photoCount }) => photoCount >= 3 },
    {
        id: 'description',
        sectionId: 'description',
        points: 15,
        isComplete: ({ description }) => textFromHtml(description).length >= descriptionMinimumLength,
    },
    { id: 'attributes', sectionId: 'features', points: 10, isComplete: ({ hasFilledAttribute }) => hasFilledAttribute },
    { id: 'seo-title', sectionId: 'seo', points: 5, isComplete: ({ seoTitle }) => hasText(seoTitle) },
    { id: 'seo-description', sectionId: 'seo', points: 10, isComplete: ({ seoDescription }) => hasText(seoDescription) },
];

function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isValidPrice(value) {
    if (value === '' || value === null || value === undefined) return false;

    const normalizedPrice = String(value).replace(/\s/g, '').replace(',', '.');
    if (normalizedPrice === '') return false;

    const price = Number(normalizedPrice);

    return Number.isFinite(price) && price >= 0;
}

function textFromHtml(value) {
    if (!hasText(value)) return '';

    return value
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/&[a-z\d#]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export default function calculateProductCompleteness({
    name = '',
    price = '',
    categoryCount = 0,
    photoCount = 0,
    description = '',
    hasFilledAttribute = false,
    seoTitle = '',
    seoDescription = '',
} = {}) {
    const product = {
        name,
        price,
        categoryCount,
        photoCount,
        description,
        hasFilledAttribute,
        seoTitle,
        seoDescription,
    };
    const missingCriteria = [];
    let score = 0;

    for (const criterion of criteria) {
        if (criterion.isComplete(product)) {
            score += criterion.points;
        } else {
            missingCriteria.push({
                id: criterion.id,
                sectionId: criterion.sectionId,
                points: criterion.points,
            });
        }
    }

    return {
        score,
        level: score < 50 ? 'low' : score < 80 ? 'medium' : 'high',
        missingCriteria,
    };
}
