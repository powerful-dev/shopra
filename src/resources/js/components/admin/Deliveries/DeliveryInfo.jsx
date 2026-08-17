import InfoIcon from "../../icons/InfoIcon"

export default function DeliveryInfo() {
    return (
        <footer className="col-span-full flex items-start gap-[10px] rounded-[12px] border border-[#e7d2c4] bg-[#fff8f3] p-[12px_14px]">
            <span className="shrink-0 text-[color:var(--color-accent)]">
                <InfoIcon/>
            </span>

            <p className="m-0 text-[11px] leading-[1.45] text-[#776c64]">
                <strong className="block text-[#5c534c]">
                    В заказе видны все данные для отправки
                </strong>

                Откройте заказ, перенесите адрес в кабинет службы и добавьте
                полученный трек-номер.
            </p>
        </footer>
    );
}