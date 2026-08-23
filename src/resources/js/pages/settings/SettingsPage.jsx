import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import SettingsIcon from '../../components/icons/SettingsIcon';
import StoreIcon from '../../components/icons/StoreIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
    const { t } = useTranslation();

    const items = [
        {
            title: t('settingsPage.commonSettingsTitle'),
            description: t('settingsPage.commonSettingsDescription'),
            icon: <SettingsIcon />,
            href: '/admin/settings/common',
        },
        {
            title: t('settingsPage.staffAccessTitle'),
            description: t('settingsPage.staffAccessDescription'),
            icon: <StoreIcon />,
            href: '/admin/administrators',
        },
    ];

    return (
        <>
            <section className="mb-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <Breadcrumbs className="max-lg:hidden" />

                    <h1 className="m-0 truncate text-[32px] font-[760] tracking-[-0.05em] max-lg:text-[19px]">
                        {t('settingsPage.title')}
                    </h1>

                    <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">
                        {t('settingsPage.description')}
                    </p>
                </div>
            </section>

            <section className="grid gap-2 pb-8">
                {items.map((item) => (
                    <SettingsItem
                        key={item.title}
                        {...item}
                    />
                ))}
            </section>
        </>
    );
}

function SettingsItem({
    title,
    description,
    icon,
    href,
    onClick,
}) {
    const className =
        'grid min-h-[70px] w-full grid-cols-[38px_minmax(0,1fr)_18px] items-center gap-3 rounded-[13px] border border-[color:var(--color-border)] bg-white p-[12px_14px] text-left text-inherit no-underline shadow-[var(--shadow)] transition hover:border-[#d8c7bc] hover:bg-[#fcfaf8]';

    const content = (
        <>
            <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-[#f9eee7] text-[color:var(--color-accent)]">
                {icon}
            </span>

            <span className="flex min-w-0 flex-col">
                <strong className="text-[13px]">
                    {title}
                </strong>

                <small className="mt-0.5 text-[12px] text-[color:var(--color-secondary)]">
                    {description}
                </small>
            </span>

            <ArrowRightIcon />
        </>
    );

    if (href) {
        return (
            <Link
                to={href}
                className={className}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
        >
            {content}
        </button>
    );
}
