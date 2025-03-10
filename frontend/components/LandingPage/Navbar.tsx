import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server";
import ThemeButton from "../ThemeButton";
import { UserButton } from "@clerk/nextjs";

async function Navbar() {
    const user = await currentUser()
  return (
    <nav className="flex items-center justify-between p-4">
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Resumatcher Logo
        </Link>
        <div className="flex items-center gap-4">
            <ThemeButton />
            {user ? (
                <UserButton />
            ) : (
                <>
                    <Link href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</Link>
                    <Link href="/sign-up" className="bg-blue-500 text-white px-4 py-2 rounded-md">Register</Link>
                </>
            )}
        </div>
    </nav>
  )
}

export default Navbar