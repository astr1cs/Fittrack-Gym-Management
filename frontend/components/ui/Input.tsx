import { InputHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`px-3 py-2 border rounded-lg text-sm outline-none transition-all
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${props.className ?? ''}`}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  )
}