export default function PickupCard({
    enabled = false,
    onToggle,
}) {
    return (
        <article className="grid min-h-[67px] grid-cols-[37px_minmax(0,1fr)_auto] items-center gap-[9px] rounded-[12px] border border-dashed border-[#dcd4ce] bg-[#fcfbfa] p-[10px_12px]">
            <span className="grid h-[37px] w-[37px] place-items-center rounded-[9px] bg-[#f2eeeb] text-[#7a7068]">
                ⬜
            </span>

            <p className="m-0 flex flex-col">
                <strong className="text-[12px]">
                    Самовывоз
                </strong>

                <small className="mt-0.5 text-[11px] text-[#948b84]">
                    Покупатель забирает заказ по вашему адресу
                </small>
            </p>

            <label className="switch">
                <input
                    className="switch__input"
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) => onToggle?.(event.target.checked)}
                />

                <span className="switch__track" />
            </label>
        </article>
    );
}