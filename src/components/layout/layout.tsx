import Footer from './footer'
import Navbar from './navbar'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="p-4 flex-1">
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  )
}
