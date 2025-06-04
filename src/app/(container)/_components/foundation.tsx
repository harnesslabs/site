import Link from "next/link";

export default function Foundation() {
  return (
    <section className="mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 hidden lg:flex justify-center items-center">
          <svg
            className="w-40 h-40"
            fill="currentColor"
            viewBox="18 26 92 84"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="20,28 108,28 64,108"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="99"
              cy="100"
              r="10"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="lg:col-span-2 relative z-10 text-left lg:text-right">
          <div>
            <h2 className="text-4xl md:text-5xl">Our Foundation</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl ml-auto">
              We are a growing team of mathematicians, physicists, computer scientists, and
              engineers. Explore the philosophy, values, and people behind our mission.
            </p>
          </div>

          <div className="mt-4">
            <Link href="/about" className="group relative inline-block">
              <div className="relative rounded-xl flex items-center gap-3 font-medium transition-all duration-300">
                <span className="transform transition-all duration-300 group-hover:translate-x-1 /70 group-hover:">
                  →
                </span>
                <span>Learn more</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
