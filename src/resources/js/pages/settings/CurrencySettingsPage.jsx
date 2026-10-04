import CurrencySettingsForm from '../../components/settings/CurrencySettingsForm';
import { useSettingsSection } from './SettingsSectionsContext';

export default function CurrencySettingsPage() {
    const {
        data,
        errors,
        isLoading,
        isSaving,
        updateData,
    } = useSettingsSection('currencies');

    return (
        <CurrencySettingsForm
            value={data}
            errors={errors}
            disabled={isLoading || isSaving}
            onChange={updateData}
        />
    );
}
