import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-mirage-950">
      <section className="flex flex-col max-w-screen-lg lg:min-w-96 justify-center items-center bg-slate-700 p-4 md:p-8 rounded-md">
        <div className="container mx-auto flex flex-col justify-between max-w-screen-lg flex-wrap p-5 items-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">Request for Quote</h1>
          <Link href="/rfq" className="w-full">
            <Button className="mt-4 w-full py-6 bg-mirage-800 hover:bg-mirage-900 text-lg">Request Quote</Button>
          </Link>
        </div>
      </section>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">{/*  */}</main>
    </div>
  );
}
