import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "James Mitchell",
    role: "HGV Driver",
    company: "Royal Mail",
    content: "DSS gave me the confidence and skills I needed to pass my test first time. The instructors are patient, knowledgeable, and truly care about your success. Best investment I ever made.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=12",
    initials: "JM",
  },
  {
    name: "Sarah Thompson",
    role: "Delivery Driver",
    company: "Amazon Logistics",
    content: "Best decision I ever made. The flexible scheduling meant I could train while working my current job. Now I'm earning more than I ever thought possible.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=47",
    initials: "ST",
  },
  {
    name: "Michael O'Brien",
    role: "Coach Driver",
    company: "National Express",
    content: "Professional, thorough, and results-driven. DSS doesn't just teach you to pass a test - they prepare you for a real career on the road.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=33",
    initials: "MO",
  },
];

const Testimonials = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="section-padding bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-accent/10 rounded-full">
            <span className="text-sm font-semibold text-accent">Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            What Our Drivers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of successful drivers who transformed their careers with DSS
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <div className="bg-card rounded-3xl border border-border p-8 hover:border-accent/50 transition-all duration-300 shadow-lg hover:shadow-2xl h-full flex flex-col">
                {/* Quote icon */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  <Quote className="w-8 h-8 text-accent-foreground" />
                </div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-6 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-accent text-accent" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-foreground leading-relaxed mb-8 text-base flex-grow">
                  "{testimonial.content}"
                </p>
                
                {/* Author info */}
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-accent/30 overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-lg">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-accent font-medium mt-0.5">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm">
            <div className="flex -space-x-3">
              {[
                "https://i.pravatar.cc/150?img=12",
                "https://i.pravatar.cc/150?img=47",
                "https://i.pravatar.cc/150?img=33",
                "https://i.pravatar.cc/150?img=68",
                "https://i.pravatar.cc/150?img=59"
              ].map((img, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full ring-2 ring-background overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Driver ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-1">
              <span className="font-semibold text-foreground">500+</span> drivers trained with{" "}
              <span className="font-semibold text-accent">95% success rate</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
