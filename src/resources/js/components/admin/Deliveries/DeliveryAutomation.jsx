import BoxIcon from "../../icons/BoxIcon"
import PrintIcon from "../../icons/PrintIcon"
import SendIcon from "../../icons/SendIcon"


export default function DeliveryAutomation() {
    return (
        <article className="col-span-full rounded-[14px] border border-[color:var(--color-border)] bg-white p-[14px]">
            <div className="grid grid-cols-[minmax(210px,.82fr)_minmax(0,1fr)_minmax(0,1fr)] items-stretch gap-2 max-md:grid-cols-1">
                <header className="flex items-center gap-3 pr-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] bg-[#fff3eb] text-[color:var(--color-accent)]">
                        <BoxIcon/>
                    </span>

                    <div>
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.06em] text-[color:var(--color-accent)]">
                            Автоматизация
                        </p>

                        <h2 className="mb-0 mt-0.5 text-[16px] font-bold">
                            После получения заказа
                        </h2>
                    </div>
                </header>

                <AutomationItem
                    title="Создавать накладную"
                    description="Доступно после подключения API"
                    disabled
                    icon={PrintIcon}
                />

                <AutomationItem
                    title="Отправлять добавленный трек-номер"
                    description="Покупатель получит его после отправки"
                    defaultChecked
                    icon={SendIcon}
                />
            </div>
        </article>
    );
}

function AutomationItem({
    title,
    description,
    disabled = false,
    defaultChecked = false,
    icon: Icon,
}) {
    return (
        <div className="grid grid-cols-[38px_minmax(0,1fr)_18px] items-center gap-3 rounded-[10px] border border-[#e5dfda] bg-[#faf8f6] p-3">
            <label className="switch">
                <input
                    className="switch__input"
                    type="checkbox"
                    disabled={disabled}
                    defaultChecked={defaultChecked}
                />

                <span className="switch__track" />
            </label>

            <p className="m-0">
                <strong className="block text-[12px]">
                    {title}
                </strong>

                <small className="text-[11px] text-[#928981]">
                    {description}
                </small>
            </p>

            {Icon && (
                <Icon className="text-[#8b827b]" />
            )}
        </div>
    );
}