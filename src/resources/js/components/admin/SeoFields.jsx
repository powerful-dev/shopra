import Field from '../form/Field';
import Input from '../form/Input';
import Textarea from '../form/Textarea';

const fieldWrapperClass = '[&.form-field]:gap-[7px] [&>.form-label]:text-[12px] [&>.form-label]:leading-normal [&>.form-label]:text-[#554e48]';

export default function SeoFields({
    title,
    description,
    url,
    titleLabel,
    descriptionLabel,
    titleName,
    descriptionName,
    disabled = false,
    onTitleChange,
    onDescriptionChange,
}) {
    return (
        <>
            <Field label={titleLabel} className={fieldWrapperClass}>
                <Input
                    type="text"
                    name={titleName}
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    disabled={disabled}
                />
            </Field>
            <div className="mt-[13px]">
                <Field label={descriptionLabel} className={fieldWrapperClass}>
                    <Textarea
                        name={descriptionName}
                        value={description}
                        onChange={(event) => onDescriptionChange(event.target.value)}
                        disabled={disabled}
                    />
                </Field>
            </div>
            <div className="mt-[13px] rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-3">
                <small className="text-[11px] text-[color:var(--color-success)]">{url}</small>
                <strong className="mt-[3px] block text-[12px] text-[#375b8b]">{title}</strong>
                <p className="mb-0 mt-[3px] text-[11px] text-[#7c746e]">{description}</p>
            </div>
        </>
    );
}
