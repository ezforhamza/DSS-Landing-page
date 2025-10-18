import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/logo (1).png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4 md:pt-6">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 border ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl shadow-lg border-border/60'
            : 'bg-background/60 backdrop-blur-md shadow-md border-border/40'
        }`}
      >
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="DSS - Driver Staffing Solutions"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {['why-choose', 'about', 'contact'].map((section, index) => (
              <motion.button
                key={section}
                onClick={() => scrollToSection(section)}
                className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {section === 'why-choose' ? 'Why Choose Us' : section.charAt(0).toUpperCase() + section.slice(1)}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent group-hover:w-3/4 transition-all duration-300"></span>
              </motion.button>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              variant="accent"
              size="default"
              onClick={() => scrollToSection("contact")}
              className="rounded-full px-6"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-foreground p-2 hover:bg-accent/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-6 space-y-1 border-t border-border/50">
                {[
                  { id: 'why-choose', label: 'Why Choose Us' },
                  { id: 'about', label: 'About' },
                  { id: 'contact', label: 'Contact' }
                ].map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-3 text-foreground hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <Button
                    variant="accent"
                    size="default"
                    className="w-full rounded-full"
                    onClick={() => scrollToSection("contact")}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Navbar;
