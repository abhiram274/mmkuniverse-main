
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import CommunityTimestamp from "@/components/community/CommunityTimestamp";

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
}

const About = () => {
  const [currentTime] = useState(new Date());

  const teamMembers: TeamMember[] = [
    {
      name: "Mohith Kumar ",
      position: "CEO & Founder",
      bio: "Mohith founded MMK Universe in 2020 with the vision of creating a collaborative learning ecosystem where individuals could grow, share, and thrive together.",
      image: "/src/pages/ABOUT-MOHITH.jpg"
    },
    {
      name: "----",
      position: "CTO",
     bio:"",
      // bio: "With over 15 years in tech leadership, Sarah oversees all technical aspects of MMK Universe, ensuring our platform uses cutting-edge technologies.",
      // image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
      image: ""

    },
    {
      name: "----",
      position: "CFO",
     bio:"",
      // bio: "David brings 12+ years of financial expertise to MMK Universe, managing our fiscal strategy and sustainable growth initiatives.",
      // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
      image: ""

    },
    {
      name: "----",
      position: "Operations Manager",
      bio:"",
      // bio: "Priya ensures smooth day-to-day operations across all MMK Universe programs, communities, and initiatives with exceptional attention to detail.",
      // image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
      image: ""
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Timestamp */}
          <div className="mb-6">
            <CommunityTimestamp currentTime={currentTime} />
          </div>

          {/* About Header */}
          <div className="glass-card p-8 rounded-xl mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-gradient-primary">MMK Universe</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Building a world where knowledge sharing, skill development, and community collaboration create unparalleled opportunities for growth.
            </p>
          </div>

          {/* Motto & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-gradient-primary">Our Motto</h2>
              <p className="text-lg">
                "Explore. Share. Grow. Together."
              </p>
              <p className="mt-4 text-gray-300">
                At MMK Universe, we believe that true growth happens when knowledge is shared openly and skills are developed collaboratively. Our community-driven approach empowers individuals to learn from each other and succeed together.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-gradient-primary">Founder's Vision</h2>
              <p className="text-gray-300">
                "I created MMK Universe because I saw a fundamental disconnect in how people learn and grow professionally. Traditional education systems and professional development often lack community, practical application, and real-world relevance.
              </p>
              <p className="mt-4 text-gray-300">
                MMK Universe bridges this gap by fostering an ecosystem where learning is collaborative, knowledge is freely shared, and opportunities are abundant. Our goal is to help individuals not just learn, but truly thrive in their chosen fields through the power of community."
              </p>
              <p className="mt-4 italic text-right">- Mohith Kumar, Founder</p>
            </div>
          </div>

          {/* Team Section */}
          <h2 className="text-3xl font-bold mb-8">Our <span className="text-gradient-primary">Leadership Team</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 center lg:grid-cols-4 gap-6 mb-12 ">



            {teamMembers.map((member) => (
              <Card key={member.name} className="bg-white/5 border-white/10 overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-mmk-purple font-medium mb-3">{member.position}</p>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>


          {/* Community Values */}
          <div className="glass-card p-8 rounded-xl mb-10">
            <h2 className="text-3xl font-bold mb-6">Community <span className="text-gradient-primary">Values</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-mmk-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mmk-purple">
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path>
                    <path d="m14 7 3 3"></path>
                    <path d="M5 6v4"></path>
                    <path d="M19 14v4"></path>
                    <path d="M10 2v2"></path>
                    <path d="M7 8H3"></path>
                    <path d="M21 16h-4"></path>
                    <path d="M11 3H9"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                <p className="text-gray-300">We believe the best ideas emerge when diverse minds work together</p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-mmk-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mmk-purple">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Growth</h3>
                <p className="text-gray-300">Continuous improvement is at the core of everything we do</p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-mmk-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mmk-purple">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Knowledge Sharing</h3>
                <p className="text-gray-300">We're committed to free exchange of ideas and expertise</p>
              </div>
            </div>
          </div>

            {/* Contact Us Section */}
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Contact <span className="text-gradient-primary">Us</span>
            </h2>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
