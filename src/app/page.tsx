import React from "react";
import NavbarOne from "./components/NavbarOne";

export default function Home(): React.ReactNode {
  return (
    <>
      <NavbarOne />
      <main className="flex items-center justify-center md:p-10 p-4 font-dmsans flex-col h-[80vh]">
        <div className="mb-5 font-extrabold xl:text-8xl lg:text-6xl md:text-5xl text-3xl text-center">
          Platform for{" "}
          <span className="bg-black text-white rounded whitespace-nowrap">
            Mock Interviews
          </span>
        </div>
        <div className="md:w-[80%] font-semibold text-zinc-600 text-center xl:text-2xl lg:text-xl">
          This platform is targetted towards students or working professionals
          who are seeking to get a job. Here you can find mock interview
          according to your job role and book your slot so that you can practice
          for your interviews. This also gives a chance to those professionals
          who wants to take an Interview for a Particular role.
        </div>
      </main>
    </>
  );
}
