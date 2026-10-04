import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { csrf, request } from '../../services/api';

const IMAGE_SIZE_FIELDS = [
    'group_small_image_max_width',
    'group_small_image_max_height',
    'group_large_image_max_width',
    'group_large_image_max_height',
    'product_small_image_max_width',
    'product_small_image_max_height',
    'product_large_image_max_width',
    'product_large_image_max_height',
];

const sectionConfigs = {
    general: {
        endpoint: '/api/settings/general',
        emptyData: {
            site_name: '',
            admin_language_id: '',
            site_language_id: '',
            admin_languages: [],
            site_languages: [],
        },
        payload: ({ site_name, admin_language_id, site_language_id }) => ({
            site_name,
            admin_language_id,
            site_language_id,
        }),
    },
    currencies: {
        endpoint: '/api/settings/currencies',
        emptyData: {
            currency: null,
            currency_rates: [],
        },
        payload: ({ currency, currency_rates }) => ({ currency, currency_rates }),
    },
    catalog: {
        endpoint: '/api/settings/catalog',
        emptyData: {
            low_stock_threshold: 5,
            default_shop_unit_id: '',
            shop_units: [],
        },
        payload: ({ low_stock_threshold, default_shop_unit_id }) => ({
            low_stock_threshold,
            default_shop_unit_id,
        }),
    },
    images: {
        endpoint: '/api/settings/images',
        emptyData: {
            group_small_image_max_width: '',
            group_small_image_max_height: '',
            group_small_image_fit: 'contain',
            group_large_image_max_width: '',
            group_large_image_max_height: '',
            group_large_image_fit: 'contain',
            group_image_format: 'webp',
            product_small_image_max_width: '',
            product_small_image_max_height: '',
            product_small_image_fit: 'contain',
            product_large_image_max_width: '',
            product_large_image_max_height: '',
            product_large_image_fit: 'contain',
            product_image_format: 'webp',
        },
        payload: (data) => ({
            ...data,
            ...Object.fromEntries(IMAGE_SIZE_FIELDS.map((field) => [field, data[field] === '' ? null : data[field]])),
        }),
    },
};

const normalizeData = (section, data) => ({
    ...sectionConfigs[section].emptyData,
    ...data,
});

const createSectionState = (section) => ({
    data: { ...sectionConfigs[section].emptyData },
    savedData: null,
    status: 'idle',
    isSaving: false,
    errors: {},
    message: '',
    messageType: 'success',
});

const SettingsSectionsContext = createContext(null);

export function SettingsSectionsProvider({ children }) {
    const [sections, setSections] = useState(() => Object.fromEntries(
        Object.keys(sectionConfigs).map((section) => [section, createSectionState(section)])
    ));
    const sectionsRef = useRef(sections);
    const requestedSectionsRef = useRef(new Set());

    const updateSections = useCallback((updater) => {
        setSections((current) => {
            const next = updater(current);
            sectionsRef.current = next;

            return next;
        });
    }, []);

    const loadSection = useCallback(async (section) => {
        if (!sectionConfigs[section] || requestedSectionsRef.current.has(section)) {
            return;
        }

        requestedSectionsRef.current.add(section);
        updateSections((current) => ({
            ...current,
            [section]: { ...current[section], status: 'loading', message: '' },
        }));

        try {
            const { data } = await request(sectionConfigs[section].endpoint);
            const normalizedData = normalizeData(section, data);

            updateSections((current) => ({
                ...current,
                [section]: {
                    ...current[section],
                    data: normalizedData,
                    savedData: normalizedData,
                    status: 'loaded',
                    errors: {},
                },
            }));
        } catch (error) {
            requestedSectionsRef.current.delete(section);
            updateSections((current) => ({
                ...current,
                [section]: {
                    ...current[section],
                    status: 'error',
                    message: error.message || 'loadError',
                    messageType: 'error',
                },
            }));
        }
    }, [updateSections]);

    const updateSection = useCallback((section, fields) => {
        updateSections((current) => {
            const clearedFields = Object.keys(fields);
            const errors = Object.fromEntries(
                Object.entries(current[section].errors).filter(([field]) => (
                    !clearedFields.some((changedField) => (
                        field === changedField || field.startsWith(`${changedField}.`)
                    ))
                ))
            );

            return {
                ...current,
                [section]: {
                    ...current[section],
                    data: { ...current[section].data, ...fields },
                    errors,
                    message: '',
                },
            };
        });
    }, [updateSections]);

    const saveSection = useCallback(async (section) => {
        const config = sectionConfigs[section];
        const currentSection = sectionsRef.current[section];

        if (
            !config
            || currentSection.status !== 'loaded'
            || currentSection.isSaving
            || JSON.stringify(currentSection.data) === JSON.stringify(currentSection.savedData)
        ) {
            return;
        }

        updateSections((current) => ({
            ...current,
            [section]: {
                ...current[section],
                isSaving: true,
                errors: {},
                message: '',
            },
        }));

        try {
            await csrf();
            const { data } = await request(config.endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config.payload(currentSection.data)),
            });
            const normalizedData = normalizeData(section, data);

            updateSections((current) => ({
                ...current,
                [section]: {
                    ...current[section],
                    data: normalizedData,
                    savedData: normalizedData,
                    isSaving: false,
                    errors: {},
                    message: 'saved',
                    messageType: 'success',
                },
            }));
        } catch (error) {
            updateSections((current) => ({
                ...current,
                [section]: {
                    ...current[section],
                    isSaving: false,
                    errors: error.errors ?? {},
                    message: error.message || 'saveError',
                    messageType: 'error',
                },
            }));
        }
    }, [updateSections]);

    return (
        <SettingsSectionsContext.Provider value={{ loadSection, saveSection, sections, updateSection }}>
            {children}
        </SettingsSectionsContext.Provider>
    );
}

export function useSettingsSections() {
    const context = useContext(SettingsSectionsContext);

    if (!context) {
        throw new Error('useSettingsSections must be used within SettingsSectionsProvider');
    }

    return context;
}

export function useSettingsSection(section) {
    const { loadSection, sections, updateSection } = useSettingsSections();
    const state = sections[section];

    useEffect(() => {
        loadSection(section);
    }, [loadSection, section]);

    const updateField = ({ target }) => {
        updateSection(section, { [target.name]: target.value });
    };

    return {
        ...state,
        isDirty: state.savedData !== null && JSON.stringify(state.data) !== JSON.stringify(state.savedData),
        isLoading: state.status !== 'loaded',
        updateData: (fields) => updateSection(section, fields),
        updateField,
    };
}
