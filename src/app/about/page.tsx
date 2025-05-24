import { Button } from "@/components/ui/button";
import AboutSeperator from "./_componets/about-seperator";

export default function About() {
  const teamMembers = [
    {
      name: "Colin Roberts, PhD",
      link: "https://x.com/Autoparallel",
    },
    { name: "Jason Stock, PhD", link: "https://x.com/itsstock" },
    { name: "Zach Adams, MS", link: "https://x.com/_OuterProduct" },
    {
      name: "Waylon Jepsen, MS",
      link: "https://x.com/0xjepsen",
    },
    { name: "Parker Smith", link: "https://x.com/parkersm1th" },
  ];

  const values = [
    {
      id: "1",
      title: "Mathematical Excellence",
      description:
        "We believe that deep mathematical understanding leads to better software. By combining ideas across fields, we value systems grounded in precision, scale, and interpretability.",
    },
    {
      id: "2",
      title: "Community Building",
      description:
        "We're committed to fostering a vibrant community of: (a) mathematicians and researchers, (b) software developers and engineers, and (c) general students and learners.",
    },
    {
      id: "3",
      title: "Open Source Philosophy",
      description:
        "We embrace the power of open source to accelerate innovation, share knowledge, and build better software together. It fosters a culture of learning, collaboration, and opportunity for everyone involved.",
    },
    {
      id: "4",
      title: "Intellectual Honesty",
      description:
        "Seeking truth, learning from mistakes, and sharing what we learn. By understanding our strengths and weaknesses, we grow, improve, and act with integrity.",
    },
  ];

  return (
    <div className="flex flex-grow flex-col items-center text-gray-800 py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-16">
        {/* About Harness Labs Section */}
        <section className="text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
            Harness Labs
          </p>
          <h1 className="text-4xl sm:text-5xl mb-12">Who are we?</h1>
          <div className="max-w-3xl mx-auto space-y-4 text-lg text-left text-justify text-gray-700">
            <p>
              We are a technology organization dedicated to building innovative
              software solutions grounded in mathematical principles. For us,
              mathematics is more than a tool&mdash;it is the foundation upon
              which all meaningful technology is built.{" "}
              <b>This is our vision</b>: to center mathematical thinking in
              software development, where elegant solutions are preferred over
              brute force approaches, and where technology serves to enhance
              human understanding rather than replace it.
            </p>
          </div>
        </section>

        <div className="hidden md:block">
          <AboutSeperator />
        </div>

        {/* Our Values Section */}
        <section className="py-12">
          <div className="mx-auto flex flex-col md:flex-row md:space-x-8">
            <div className="md:w-1/3 mb-10 md:mb-0">
              <h2 className="text-4xl sm:text-5xl text-center md:text-left">
                Our values
              </h2>
            </div>
            <div className="md:w-2/3 space-y-10">
              {values.map((value) => (
                <div
                  key={value.id}
                  className="flex items-start space-x-6 border-t pt-2"
                >
                  <div className="text-6xl font-bold text-gray-800 w-12 text-left ml-4 mr-8">
                    {value.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-12">
          <div className="mx-auto flex flex-col md:flex-row md:space-x-8">
            <div className="md:w-1/3 mb-10 md:mb-0">
              <h2 className="text-4xl sm:text-5xl text-center md:text-left">
                Our team
              </h2>
            </div>
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 mx-16 sm:mx-0 font-semibold">
                {teamMembers.map((member) => (
                  <a
                    key={member.name}
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl pl-0 md:pl-4 group border-t pt-2 text-center md:text-left cursor-pointer transition-colors duration-200 hover:text-blue-600 flex items-center justify-center md:justify-start gap-2"
                  >
                    <span>{member.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us CTA Section */}
        <section className="py-16 text-center bg-gray-50 rounded-lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl mb-4">Contact</h2>
            <p className="text-lg text-gray-700 mb-8 text-left text-justify mx-8 md:mx-0">
              Get involved by contributing to our open source projects,
              participating in community discussions, and attending events. Have
              questions or want to connect?
            </p>
            <Button size="lg">
              <a href="mailto:contact@harnesslabs.xyz">Get in touch</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
