import { Mail, Phone, MapPin } from "lucide-react";
import logo from "/logo.png";

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-4">
              <img
                src={logo}
                alt="DSS - Driver Staffing Solutions"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Training the drivers who keep Britain moving.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("why-choose")}
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  Why Choose Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="w-4 h-4 text-accent" />
                <span>0800 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="w-4 h-4 text-accent" />
                <span>info@dss-training.co.uk</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Monday - Friday: 8am - 6pm</li>
              <li>Saturday: 9am - 4pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Driver Staffing Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
