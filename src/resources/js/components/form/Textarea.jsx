import { forwardRef } from 'react';

const baseClassName = 'h-[92px] w-full resize-y rounded-[9px] border border-[#ddd5cf] bg-white p-[11px] text-[13px] leading-normal outline-none focus:border-[#c77d56]';

const Textarea = forwardRef(function Textarea({ className = '', ...props }, ref) {
    return <textarea ref={ref} className={`${baseClassName} ${className}`.trim()} {...props} />;
});

export default Textarea;
