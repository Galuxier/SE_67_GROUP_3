import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const ContactPage = () => {
  const { isDarkMode } = useTheme();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Team members with GitHub links
  const teamMembers = [
    {
      name: "Galuxier",
      role: "Lead Developer",
      github: "https://github.com/Galuxier",
      image: "https://avatars.githubusercontent.com/u/0" // Placeholder
    },
    {
      name: "Waranya",
      role: "Full Stack Developer",
      github: "https://github.com/waranyapr",
      image: "https://avatars.githubusercontent.com/u/0" // Placeholder
    },
    {
      name: "ChawananMu",
      role: "Frontend Developer",
      github: "https://github.com/ChawananMu",
      image: "https://avatars.githubusercontent.com/u/0" // Placeholder
    },
    {
      name: "KasidachT",
      role: "Frontend Developer",
      github: "https://github.com/KasidachT",
      image: "https://avatars.githubusercontent.com/u/0" // Placeholder
    },
    {
      name: "Fangfirst",
      role: "Frontend Developer",
      github: "https://github.com/Fangfirst",
      image: "https://avatars.githubusercontent.com/u/0" // Placeholder
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      formRef.current.reset();
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {/* Hero Section */}
      <div className="relative w-full h-[25vh] z-0 bg-gradient-to-r from-rose-700 to-rose-500  overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1200/600')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get In <span className="text-yellow-300">Touch</span>
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              SE_67_GROUP_3
            </p>
          </motion.div>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-20 py-16">
        {/* Team Section */}
        <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            > 
            <h2 className="text-3xl font-bold text-text mb-6 relative text-center">
                Our Development Team
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary"></span>
            </h2>
            
            {/* <p className="text-text/80 text-text     text-center max-w-3xl mx-auto mb-10">
                Meet the talented developers and designers who brought this platform to life. Feel free to check out their GitHub profiles for more of their amazing work.
            </p> */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {teamMembers.map((member, index) => (
                <motion.div
                    key={index}
                    className="bg-card rounded-xl shadow-md border border-border/30 overflow-hidden text-center hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                    <div className="w-full h-20 bg-background relative">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-card overflow-hidden">
                        <img
                        src={`/api/placeholder/96/96?text=${member.name.charAt(0)}`}
                        alt={member.name}
                        className="w-full h-full object-cover bg-primary text-white"
                        />
                    </div>
                    </div>
                    
                    <div className="pt-16 px-4 pb-6">
                    <h3 className="text-lg font-semibold text-text">{member.name}</h3>
                    <p className="text-text/70 text-text text-sm mb-4">{member.role}</p>
                    
                    <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-text p-2 rounded-full transition-colors"
                    >
                        <FaGithub className="h-5 w-5" />
                    </a>
                    </div>
                </motion.div>
                ))}
            </div>
            </motion.div>
        </div>
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-text mb-6 relative">
              Contact Information
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-primary"></span>
            </h2>

            {/* <p className="text-text/80 mb-8">
              Whether you're looking to join a course, purchase equipment, or have any questions, our team is here to assist you. Feel free to reach out through any of the following channels.
            </p>

            <div className="space-y-6 mt-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MapPinIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Our Location</h3>
                  <p className="text-text/70">123 Muay Thai Street, Bangkok, Thailand</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <PhoneIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Phone Number</h3>
                  <p className="text-text/70">+66 12 345 6789</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="    bg-primary/10 p-3 rounded-full mr-4">
                  <EnvelopeIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Email Address</h3>
                  <p className="text-text/70">contact@muaythai.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ClockIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Business Hours</h3>
                  <p className="text-text/70">Monday - Friday: 8:00 AM - 8:00 PM</p>
                  <p className="text-text/70">Saturday: 9:00 AM - 6:00 PM</p>
                  <p className="text-text/70">Sunday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div> */}

            {/* Social Media Links */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-text mb-4">Link</h3>
              <div className="flex space-x-4">
                {/* <a href="#" className="bg-primary hover:bg-secondary text-white p-3 rounded-full transition-colors">
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-primary hover:bg-secondary text-white p-3 rounded-full transition-colors">
                  <FaLinkedin className="h-5 w-5" />
                </a> */}
                <a 
                    href="https://github.com/Galuxier/SE_67_GROUP_3" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-primary hover:bg-secondary text-white p-3 rounded-full transition-colors"
                    >
                    <FaGithub className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;