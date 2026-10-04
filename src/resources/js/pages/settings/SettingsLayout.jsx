import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CheckIcon from '../../components/icons/CheckIcon';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import ControlsIcon from '../../components/icons/ControlsIcon';
import CurrencyIcon from '../../components/icons/CurrencyIcon';
import ImageIcon from '../../components/icons/ImageIcon';
import ProductsIcon from '../../components/icons/ProductsIcon';
import SaveIcon from '../../components/icons/SaveIcon';
import { SettingsSectionsProvider, useSettingsSections } from './SettingsSectionsContext';

function SettingsShell() {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const { saveSection, sections } = useSettingsSections();
    const routeSection = pathname.split('/').filter(Boolean).at(-1);
    const activeSection = Object.hasOwn(sections, routeSection) ? routeSection : 'general';
    const section = sections[activeSection];
    const isDirty = section.savedData !== null
        && JSON.stringify(section.data) !== JSON.stringify(section.savedData);
    const isDisabled = section.status !== 'loaded' || section.isSaving || !isDirty;
    const message = ['saved', 'loadError', 'saveError'].includes(section.message)
        ? t(`commonSettingsPage.${section.message}`)
        : section.message;
    const navigationItems = [
        ['/admin/settings/general', t('commonSettingsPage.tabs.general'), <ControlsIcon size="18" key="general" />],
        ['/admin/settings/currencies', t('commonSettingsPage.tabs.currency'), <CurrencyIcon key="currency" />],
        ['/admin/settings/catalog', t('commonSettingsPage.tabs.catalog'), <ProductsIcon key="catalog" />],
        ['/admin/settings/images', t('commonSettingsPage.tabs.images'), <ImageIcon size="18" key="images" />],
    ];

    return (
        <>
            <section className="mb-7 flex w-full flex-wrap items-end gap-x-6 gap-y-4">
                <div className="min-w-0 flex-1">
                    <p className="mb-3 text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)] max-lg:hidden">
                        {t('commonSettingsPage.storeLabel')}
                    </p>
                    <h1 className="m-0 text-[32px] font-[760] leading-none tracking-[-0.05em] text-[color:var(--color-primary)] max-lg:text-[24px]">
                        {t('commonSettingsPage.pageTitle')}
                    </h1>
                    <p className="mt-2 text-[14px] text-[color:var(--color-secondary)]">
                        {t('commonSettingsPage.pageDescription')}
                    </p>
                </div>

                <div className="ml-auto flex shrink-0 items-center justify-end">
                    <button
                        className="button button--primary h-[40px] shrink-0 whitespace-nowrap px-[18px]"
                        type="submit"
                        form="settings-section-form"
                        disabled={isDisabled}
                    >
                        <SaveIcon />
                        {section.isSaving ? t('commonSettingsPage.saving') : t('common.save')}
                    </button>
                </div>
            </section>

            {message && (
                <div className={`alert alert--${section.messageType} mb-5 h-[40px] py-0`} role="status" aria-live="polite">
                    <span className="alert__icon"><CheckIcon /></span>
                    <span>{message}</span>
                </div>
            )}

            <form
                id="settings-section-form"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    saveSection(activeSection);
                }}
            >
                <div className="grid grid-cols-[225px_minmax(0,1fr)] items-start gap-9 pb-8 max-lg:grid-cols-1 max-lg:gap-5">
                    <nav className="flex min-w-0 flex-col gap-1 max-lg:flex-row max-lg:overflow-x-auto max-lg:pb-1" aria-label={t('commonSettingsPage.tabsLabel')}>
                        {navigationItems.map(([path, label, icon]) => (
                            <NavLink
                                key={path}
                                to={path}
                                end
                                className={({ isActive }) => `flex min-h-[46px] w-full items-center gap-3 rounded-[11px] border px-[14px] text-left text-[14px] no-underline transition-colors max-lg:w-auto max-lg:min-w-max ${isActive ? 'border-[#efb58f] bg-[#fff1e7] font-[650] text-[#9b3f14]' : 'border-transparent bg-transparent font-[400] text-[#756d67] hover:bg-white'}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="grid h-5 w-5 shrink-0 place-items-center">{icon}</span>
                                        <span>{label}</span>
                                        {isActive && <span className="ml-auto max-lg:hidden"><ChevronRightIcon /></span>}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="min-w-0">
                        <Outlet />
                    </div>
                </div>
            </form>
        </>
    );
}

export default function SettingsLayout() {
    return (
        <SettingsSectionsProvider>
            <SettingsShell />
        </SettingsSectionsProvider>
    );
}
