import Footer from "@/components/core/Footer"
import Navbar from "@/components/core/Navbar"
import { GuestProvider } from "@/lib/guest/GuestProvider"
// import GuestIdDisplay from "@/components/guest/GuestIdDisplay"

const template = ({ children }: { children: React.ReactNode }) => {
    return (
        <GuestProvider>
            <div>
                <Navbar />
                {children}
                <Footer />
                {/* <GuestIdDisplay /> */}
            </div>
        </GuestProvider>
    )
}
export default template