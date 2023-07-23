const TextInput = ({
  label,
  placeholder,
  className,
  value,
  setValue,
  labelClassName,
  type,
}) => {
  return (
    <div className={`textInputDiv flex flex-col space-y-2 w-full ${className}`}>
      <label htmlFor={label} className={`font-semibold ${labelClassName}`}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="p-3 border border-gray-400 border-solid rounded placeholder-gray-500"
        id={label}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};

export const DateInput = ({
  label,
  placeholder,
  className,
  value,
  setValue,
  labelClassName,
  min,
}) => {
  return (
    <div className={`textInputDiv flex flex-col space-y-2 w-full ${className}`}>
      <label htmlFor={label} className={`font-semibold   ${labelClassName}`}>
        {label}
      </label>
      <input
        type="date"
        placeholder={placeholder}
        className="p-3 border border-gray-400 border-solid rounded placeholder-gray-500 text-black"
        id={label}
        value={value}
        min={min}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};

export const SelectInput = ({
  label,
  options,
  className,
  value,
  setValue,
  labelClassName,
}) => {
  return (
    <div className={`textInputDiv flex flex-col space-y-2 w-full ${className}`}>
      <label htmlFor={label} className={`font-semibold ${labelClassName}`}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="p-3 border border-gray-400 border-solid rounded"
        id={label}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TextInput;
