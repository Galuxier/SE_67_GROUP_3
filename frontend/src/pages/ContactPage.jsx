import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ContactPage = () => {
  const { isDarkMode } = useTheme();

  // Team members with GitHub links
  const teamMembers = [
    {
      name: "Galuxier",
      role: "Lead Developer",
      github: "https://github.com/Galuxier",
      image: null
    },
    {
      name: "Waranya",
      role: "Full Stack Developer",
      github: "https://github.com/waranyapr",
      image: null
    },
    {
      name: "Chawanan",
      role: "Frontend Developer",
      github: "https://github.com/ChawananMu",
      image: null
    },
    {
      name: "Kasidach",
      role: "Frontend Developer",
      github: "https://github.com/KasidachT",
      image: null
    },
    {
      name: "Fangfirst",
      role: "Frontend Developer",
      github: "https://github.com/Fangfirst",
      image: null
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient Background */}
      <div className="relative py-20 bg-gradient-to-r from-rose-700 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Pattern overlay for visual interest */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="text-white">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our <span className="text-yellow-300">Team</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              The talented developers behind this Muay Thai platform
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Team Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text relative inline-block pb-2">
              Development Team
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></span>
            </h2>
            <p className="text-text/70 text-text mt-4 max-w-3xl mx-auto">
              SE_67_GROUP_3 - A team of passionate developers building innovative solutions for the Muay Thai community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-xl shadow-lg border border-border/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="h-32 bg-gradient-to-r from-primary/80 to-secondary/80 relative">
                  <div className="absolute -bottom-12 inset-x-0 flex justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-card overflow-hidden bg-primary flex items-center justify-center text-white text-3xl font-bold">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-16 px-4 pb-6 text-center">
                  <h3 className="text-xl font-bold text-text">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
                  
                  <div className="flex justify-center space-x-3">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-full transition-colors text-text"
                      aria-label={`${member.name}'s GitHub profile`}
                    >
                      <FaGithub className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://linkedin.com/in/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-full transition-colors text-text"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Project Repository Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border border-border/30 rounded-xl p-8 text-center max-w-2xl mx-auto shadow-lg"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaGithub className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold text-text mb-4">Project Repository</h2>
          {/* <p className="text-text/70 mb-6">
            Check out our project code and contribute to our open-source Muay Thai platform.
          </p> */}
          
          <a
            href="https://github.com/Galuxier/SE_67_GROUP_3" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition-colors font-medium"
          >
            <FaGithub className="mr-2 h-5 w-5" />
            View on GitHub
          </a>
        </motion.div>
        
        {/* Contact Us CTA */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-text mb-4">Need to get in touch?</h2>
          <p className="text-text/70 mb-6 max-w-2xl mx-auto">
            If you have any questions about our Muay Thai platform or want to collaborate, feel free to reach out to our team.
          </p>
          <a
            href="mailto:contact@muaythai.com"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg transition-all duration-300 hover:shadow-lg font-medium"
          >
            Contact Us
          </a>
        </motion.div> */}
      </div>
    </div>
  );
};

export default ContactPage;