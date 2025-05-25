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
    <main className="flex flex-grow flex-row text-foreground py-20 px-4 sm:px-6 lg:px-8 h-full">
      <div className="flex-grow flex">
        <NavBar />
      </div>
      <div className="w-full space-y-16">{children}</div>
    </main>
  );
}
