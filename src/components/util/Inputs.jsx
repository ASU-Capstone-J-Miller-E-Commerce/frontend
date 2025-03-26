import React, { forwardRef, useState, useRef } from 'react';
import { useOutsideClick } from '../../util/hooks';

/**
 * Single line input field with floating label
 * 
 * @param {Object} props
 * @param {string} [props.type="text"] - Input type (text, password, email, etc.)
 * @param {string} props.title - Label text
 * @param {string} props.value - Current input value
 * @param {function} props.onChange - onChange handler function
 * @param {string} [props.error] - Error message to display
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} Styled input field with floating label
 */
export const FormField = forwardRef(({ type = "text", title, value, onChange, error, disabled, ...restProps }, ref) => {
    const classes = ["form-field"];
    if (value !== undefined && value !== null && value !== '') classes.push("text-within");
    if (error) classes.push("input-error");

    return (
        <div>     
            <div className={classes.join(" ")}>
                <input
                    type={type}
                    ref={ref}
                    autoCapitalize="off"
                    autoCorrect="off"
                    className="form-field-input"
                    onChange={onChange}
                    value={value}
                    disabled={disabled}
                    {...restProps}
                />
                <label className="form-field-title">
                    {title}
                </label>
            </div>
            <p className="form-error-text">{error}</p>
        </div>
    );
});

/**
 * Multi-line textarea with floating label
 * 
 * @param {Object} props
 * @param {string} props.title - Label text
 * @param {string} props.value - Current textarea content
 * @param {function} props.onChange - onChange handler function
 * @param {string} [props.error] - Error message to display
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} Styled textarea with floating label
 */
export const FormTextArea = forwardRef(({ title, value, onChange, error, ...restProps }, ref) => {
    const classes = ["form-field"];
    if (error) classes.push("input-error");
    if (value?.length) classes.push("text-within");

    return (
        <div>
            <div className={classes.join(" ")}>
                <textarea
                    ref={ref}
                    autoCapitalize="off"
                    autoCorrect="off"
                    className="form-field-textarea"
                    onChange={onChange}
                    {...restProps}
                />
                <label className="form-field-textarea-title">
                    {title}
                </label>
            </div>
            <p className="form-error-text">{error}</p>
        </div>
    );
});

/**
 * Select dropdown with floating label and custom styling
 * 
 * @param {Object} props
 * @param {string} props.title - Label text
 * @param {string} props.value - Currently selected value
 * @param {function} props.onChange - onChange handler function
 * @param {string} [props.error] - Error message to display
 * @param {Array} props.options - Array of option objects to render
 * @param {string} props.displayKey - Key in option object to display as text
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} Styled select dropdown with floating label
 */
export const FormSelect = forwardRef(({ 
    title, 
    value, 
    onChange, 
    error, 
    options, 
    displayKey = "label",
    valueKey = "value",
    ...restProps 
}, ref) => {
    const classes = ["form-field"];
    if (value !== undefined && value !== null && value !== '') classes.push("text-within");
    if (error) classes.push("input-error");

    const handleClick = () => {
        if (ref.current) {
            ref.current.click();
        }
    };

    return (
        <div>
            <div className={classes.join(" ")}>
                <select
                    ref={ref}
                    className="form-field-input"
                    onChange={onChange}
                    value={value}
                    {...restProps}
                >
                    <option value={""}/>
                    {options?.map((option, index) => (
                        <option key={index} value={option[valueKey]}>
                            {option[displayKey]}
                        </option>
                    ))}
                </select>
                <label className="form-field-title">
                    {title}
                </label>
                <i 
                    className={'fa-solid form-select-chevron fa-chevron-down'}
                    style={{ pointerEvents: 'none' }}
                    onClick={handleClick}
                />
            </div>
            <p className="form-error-text">{error}</p>
        </div>
    );
});

/**
 * Custom multi-select dropdown with selected items displayed as tags
 * 
 * @param {Object} props
 * @param {string} props.title - Label text
 * @param {Array<string>} props.value - Array of selected values
 * @param {function} props.onChange - onChange handler function
 * @param {string} [props.error] - Error message to display
 * @param {Array} props.options - Array of option objects to render
 * @param {string} props.displayKey - Key in option object to display as text
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} Custom multi-select dropdown with tags for selected values
 */
export const FormMultiSelect = forwardRef(({ title, value = [], onChange, error, options, displayKey, ...restProps }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    const classes = ["form-field"];
    if (value?.length || isOpen) classes.push("text-within");
    if (isOpen) classes.push("focus");
    if (error) classes.push("input-error");

    useOutsideClick(selectRef, () => {
        setIsOpen(false);
    });

    const handleChange = (e) => {
        const selectedValue = e.target.value;
        const newValue = value.includes(selectedValue)
            ? value.filter(v => v !== selectedValue)
            : [...value, selectedValue];

        if (onChange) {
            const event = {
                target: {
                    value: newValue,
                    name: restProps.name // This is passed from register
                }
            };
            onChange(event);
        }
    };

    const handleClear = (e) => {
        e.stopPropagation(); // Prevent dropdown from opening
        if (onChange) {
            onChange({
                target: {
                    value: [],
                    name: restProps.name
                }
            });
        }
    };

    return (
        <div>
            <div className={classes.join(" ")}>
                <div
                    ref={selectRef}
                    className="form-field-input multi-select-input"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="selected-options">
                        {value.map((selectedValue, index) => {
                            const option = options?.find(opt => opt.value === selectedValue);
                            return (
                                <div key={index} className="selected-option">
                                    {option?.[displayKey]}
                                </div>
                            );
                        })}
                    </div>
                    <div className="multi-select-dropdown" style={{ display: isOpen ? 'block' : 'none' }}>
                        {options?.map((option, index) => (
                            <div
                                key={index}
                                className={`multi-select-option ${value.includes(option.value) ? 'selected' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChange({ target: { value: option.value } });
                                }}
                            >
                                {option[displayKey]}
                            </div>
                        ))}
                    </div>
                    <div className="multi-select-icon-container">
                        {value.length > 0 && (
                            <i 
                                className="fa-solid fa-xmark clear-icon"
                                onClick={handleClear}
                            />
                        )}
                        <i className="fa-solid fa-chevron-down form-select-chevron" />
                    </div>
                </div>
                <label className="form-field-title">
                    {title}
                </label>
            </div>
            <p className="form-error-text">{error}</p>
        </div>
    );
});

/**
 * Toggle switch with customizable text for on/off states
 * 
 * @param {Object} props
 * @param {string} props.titleOn - Text to display when toggle is on
 * @param {string} props.titleOff - Text to display when toggle is off
 * @param {function} props.onChange - Callback function that receives boolean indicating new state
 * @returns {JSX.Element} Styled toggle switch with text
 */
export function DefaultToggle({ titleOn, titleOff, onChange }) {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        const newIsOn = !isOn;
        setIsOn(newIsOn);
        if (onChange) {
            onChange(newIsOn);
        }
    };

    return (
        <div className="toggle-container" onClick={handleToggle}>
            <div className={`toggle-switch ${isOn ? 'on' : 'off'}`}>
                <div className="toggle-circle"></div>
            </div>
            <div className="toggle-title">
                {isOn ? titleOn : titleOff}
            </div>
        </div>
    );
};