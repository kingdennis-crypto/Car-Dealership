import Image from 'next/image'

type Props = {
  image: File
  onChange: (value: any) => void
}

export default function ImagePreview({ image, onChange }: Props) {
  return (
    <div className="relative overflow-hidden bg-white border-2 w-44 h-44 flex-none flex items-center justify-center rounded-md">
      <Image
        src={URL.createObjectURL(image)}
        alt={image.name}
        sizes="100%"
        fill
        style={{ objectFit: 'cover' }}
      />
      <button
        onClick={(e) => onChange(image)}
        type="button"
        className="bg-red-500 p-2 rounded-bl-lg absolute top-0 right-0"
      >
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </button>
    </div>
  )
}
