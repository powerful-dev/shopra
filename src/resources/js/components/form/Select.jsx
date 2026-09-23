import { forwardRef } from 'react';

const baseClassName = 'h-[42px] w-full rounded-[9px] border border-[#ddd5cf] bg-white px-[11px] text-[13px] text-[#3f3934] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]';

const Select = forwardRef(function Select({ className = '', children, ...props }, ref) {
    return <select ref={ref} className={`${baseClassName} ${className}`.trim()} {...props}>{children}</select>;
});

export default Select;
