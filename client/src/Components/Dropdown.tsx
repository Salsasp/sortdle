import { type SelectorProps } from "../utils/types";

function Dropdown ({ id, options, value, onChange }: SelectorProps) {
    return (
        <div className="dropdown-wrapper">
            <select id={id} value={value} onChange={(e) => onChange(e.target.value as string)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    )
}

export default Dropdown;