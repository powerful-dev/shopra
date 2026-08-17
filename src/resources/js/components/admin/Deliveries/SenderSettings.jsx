import HouseIcon from "../../icons/Deliveries/HouseIcon"
import InfoIcon from "../../icons/InfoIcon"

export default function SenderSettings() {
    return (
        <article className="rounded-[14px] border border-[color:var(--color-border)] bg-white p-[14px]">
            <header className="mb-3 grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-[9px]">
                <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-[#f9eee7] text-[color:var(--color-accent)]">
                    <HouseIcon/>
                </span>

                <div>
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[.06em] text-[color:var(--color-accent)]">
                        Отправитель · необязательно
                    </p>

                    <h2 className="mb-0 mt-0.5 text-[16px] font-bold">
                        Откуда отправляем
                    </h2>
                </div>

                <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-[11px] font-bold text-[color:var(--color-accent)]"
                >
                    Сохранить
                </button>
            </header>

            <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                <Field label="Тип отправителя" required>
                    <select className="h-[37px] rounded-[8px] border border-[#d8d0ca] bg-white px-[9px] font-normal">
                        <option>Физическое лицо</option>
                        <option>ФОП</option>
                        <option>Компания</option>
                    </select>
                </Field>

                <Field label="Имя отправителя" required>
                    <input
                        defaultValue="Вадим Панасенко"
                        className="h-[37px] rounded-[8px] border border-[#d8d0ca] px-[9px] font-normal"
                    />
                </Field>

                <Field label="Телефон" required>
                    <input
                        defaultValue="+380"
                        className="h-[37px] rounded-[8px] border border-[#d8d0ca] px-[9px] font-normal"
                    />
                </Field>

                <Field label="Город отправки" required>
                    <input
                        defaultValue="Одесса"
                        className="h-[37px] rounded-[8px] border border-[#d8d0ca] px-[9px] font-normal"
                    />
                </Field>

                <label className="col-span-full flex flex-col gap-1 text-[11px] font-bold text-[#70665f] max-sm:col-span-1">
                    <span>
                        Отделение или адрес забора
                        <b className="ml-1 text-red-500">*</b>
                    </span>

                    <input
                        placeholder="Например, отделение № 24"
                        className="h-[37px] rounded-[8px] border border-[#d8d0ca] px-[9px] font-normal"
                    />
                </label>
            </div>

            <p className="mb-0 mt-[9px] flex items-start gap-[6px] rounded-[8px] bg-[#fff5ee] p-2 text-[11px] leading-[1.4] text-[color:var(--color-accent)]">
                <InfoIcon/>
                <span>
                    В простом режиме можно не заполнять. Эти данные нужны для
                    автоматического создания накладной.
                </span>
            </p>
        </article>
    );
}

function Field({ label, required, children }) {
    return (
        <label className="flex flex-col gap-1 text-[11px] font-bold text-[#70665f]">
            <span>
                {label}

                {required && (
                    <b className="ml-1 text-red-500">*</b>
                )}
            </span>

            {children}
        </label>
    );
}