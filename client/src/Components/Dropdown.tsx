import { type SelectorProps } from "../utils/types";

function Dropdown ({ label, id, options }: SelectorProps) {
    
    return (
        <div>
            <select id={id}>
                <option value=''>{label}</option>
                {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    )
}

export default Dropdown;