import type { Metadata } from "next";
import { NavBar } from "./_components/navbar";

export const metadata: Metadata = {
  title: "Harness Labs | Playground",
  description: "Try out Harness Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-grow lg:grid-cols-[200px_minmax(900px,_1fr)_100px] lg:grid flex-col gap-4 lg:gap-0 text-foreground py-20 px-4 sm:px-6 lg:px-8 h-full">
      {/* magic number 85px is the height of the navbar */}
      <div className="lg:flex-grow flex h-full items-center">
        <div className="lg:fixed lg:top-[calc(50%-85px)] lg:-translate-y-1/2 flex items-center flex-grow">
          <NavBar />
        </div>
      </div>
      <div className="w-full">{children}</div>
    </main>
  );
}
