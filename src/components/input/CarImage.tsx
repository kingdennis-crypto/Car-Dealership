import Image from 'next/image'

type Props = {
  url: string
  clickHandler: (url: string) => void
}

export default function CarImage({ url, clickHandler }: Props) {
  return (
    <button
      onClick={() => clickHandler(url)}
      className="w-full aspect-square relative rounded-md overflow-hidden hover:scale-95 cursor-pointer"
    >
      <Image
        src={url}
        alt="Image Name"
        sizes="100%"
        fill
        style={{ objectFit: 'cover' }}
      />
    </button>
  )
}
