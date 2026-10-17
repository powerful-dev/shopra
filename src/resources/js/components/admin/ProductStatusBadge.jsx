import { useTranslation } from 'react-i18next';

const labelKeys = {
    active: 'productsPage.statuses.active',
    draft: 'productsPage.statuses.draft',
    archived: 'productsPage.statuses.archived',
};

export default function ProductStatusBadge({ status, label }) {
    const { t } = useTranslation();
    const normalizedStatus = labelKeys[status] ? status : 'archived';

    return (
        <span className={`status-badge status-badge--${normalizedStatus}`}>
            {label ?? t(labelKeys[normalizedStatus])}
        </span>
    );
}
