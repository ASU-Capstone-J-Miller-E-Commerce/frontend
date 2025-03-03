import { forwardRef } from "react";

export const FormField = forwardRef(({ type = "text", title, value, onChange, error, ...restProps }, ref) => {
    const classes = ["form-field"];
    if (value?.length) classes.push("text-within")
    if (error) classes.push("input-error")

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

export const FormSelect = forwardRef(({ title, value, onChange, error, options, displayKey, ...restProps }, ref) => {
    const classes = ["form-field"];
    if (value?.length) classes.push("text-within");
    if (error) classes.push("input-error");

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
                    {options.map((option, index) => (
                        <option key={index} value={option[displayKey]}>
                            {option[displayKey]}
                        </option>
                    ))}
                </select>
                <label className="form-field-title">
                    {title}
                </label>
            </div>
            <p className="form-error-text">{error}</p>
        </div>
    );
});