type Props = {
  id: string
  label: string
  type: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export default function InputField(props: Props) {
  const {
    id,
    label,
    type,
    value,
    onChange,
    placeholder = '',
    required = false,
  } = props

  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  )
}
