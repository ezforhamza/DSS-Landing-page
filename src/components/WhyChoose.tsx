import { Award, Users, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Award,
    title: "Expert Training",
    description: "Comprehensive training programs led by industry-certified instructors with decades of experience.",
  },
  {
    icon: Users,
    title: "Ongoing Support",
    description: "Dedicated support throughout your training journey and beyond, ensuring your success.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Training schedules designed to fit your lifestyle, with weekend and evening options available.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Fully accredited programs meeting all UK driving standards and regulations.",
  },
];

const WhyChoose = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="why-choose" className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose DSS?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need to succeed in your driving career
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors"
              >
                <feature.icon className="w-6 h-6 text-accent" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChoose;
