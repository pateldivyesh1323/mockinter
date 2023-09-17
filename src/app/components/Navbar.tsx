import Link from "next/link";

export default function Navbar() {
  return (
    <section className="font-dmsans font-semibold md:px-20 md:py-10 sm:px-10 sm:py-5 px-4 pt-4">
      <span className="sm:text-3xl text-xl">
        <Link href="/">MockInter</Link>
      </span>
      <span className="float-right flex items-center box-border sm:gap-5 gap-2 sm:text-lg text-base">
        <Link href="/login">
          <span className="border-2 border-black md:px-7 md:py-2 sm:px-4 sm:py-1 px-2 py-2 sm:rounded-full rounded-lg bg-white hover:bg-black hover:text-white transition-all duration-300">
            Login
          </span>
        </Link>
        <Link href="/create-account">
          <span className="bg-black border-2 border-black text-white md:px-5 md:py-2 sm:px-3 sm:py-1 px-2 py-2 sm:rounded-full rounded-lg hover:bg-white hover:text-black transition-all duration-300">
            Create Account
          </span>
        </Link>
      </span>
    </section>
  );
}
