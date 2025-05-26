export default function ContainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col flex-grow container mx-auto max-w-7xl h-full my-8 px-4">
      {children}
    </main>
  );
}
