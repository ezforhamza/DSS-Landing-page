import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Comprehensive training programs",
  "Flexible payment options",
  "Job placement assistance",
  "Modern training vehicles",
  "Theory test support",
  "Practical test preparation",
];

const About = () => {
  return (
    <section id="about" className="section-padding bg-gradient-to-b from-secondary/30 to-background">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-accent/10 rounded-full">
              <span className="text-sm font-semibold text-accent">About DSS</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Your Partner in Professional Driving
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              At Driver Staffing Solutions, we've been training professional drivers for over a decade. Our mission is simple: provide world-class training that prepares you for a successful career on the road.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              We understand that every driver's journey is unique. That's why we offer personalized training programs tailored to your specific needs and career goals.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-6xl md:text-8xl font-bold text-primary mb-4"
                >
                  10+
                </motion.div>
                <div className="text-2xl font-semibold text-foreground mb-2">Years of Excellence</div>
                <div className="text-muted-foreground">Training Britain's best drivers</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
