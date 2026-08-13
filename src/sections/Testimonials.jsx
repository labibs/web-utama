import { testimonials as staticTestimonials } from "../constants/index.jsx";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { Element } from "react-scroll";
import { databases } from "../lib/appwrite";
import { motion, AnimatePresence } from "framer-motion";

const Testimonials = () => {
  const [activeId, setActiveId] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const scrollRef = useRef(null);

  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID);
      if (response.documents.length > 0) {
        setTestimonials(response.documents);
        setActiveId(response.documents[0].$id);
      } else {
        setTestimonials(staticTestimonials);
        setActiveId(staticTestimonials[0].id);
      }
    } catch (error) {
      setTestimonials(staticTestimonials);
      setActiveId(staticTestimonials[0].id);
    }
  };

  return (
    <section className="relative z-2 py-24 md:py-28 lg:py-40">
      <Element name="testimoni">
        <div className="container">
          <div className="testimonials_head-res relative z-2 mb-20 max-md:text-center">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="caption mb-5"
            >
              Apa Kata Mereka
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="h3 max-md:h5 text-p4"
            >
              Testimoni dari mitra dan pengguna kami
            </motion.h3>
          </div>
          <div
            ref={scrollRef}
            className="scroll-hide flex w-full gap-6 overflow-x-auto pb-10"
          >
            {testimonials.map((testimonial, index) => {
              const id = testimonial.$id || testimonial.id;
              const isActive = activeId === id;
              return (
                <motion.div
                  key={id}
                  layout
                  onClick={() => setActiveId(id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    layout: { duration: 0.6, ease: "easeInOut" },
                  }}
                  whileHover={
                    !isActive ? { scale: 1.02, borderColor: "#2EF2FF" } : {}
                  }
                  className={clsx(
                    "relative h-[350px] cursor-pointer overflow-hidden rounded-3xl border-2 border-s2 bg-s1/50 transition-colors duration-500 shrink-0",
                    isActive
                      ? "w-[calc(100%_-_40px)] md:w-[calc((100%_-_72px)*3/4_+_48px)] lg:w-[calc((1252px_-_32px_-_72px)*3/4_+_48px)]"
                      : "w-[100px] md:w-[calc((100%_-_72px)/4)] lg:w-[calc((1252px_-_32px_-_72px)/4)]",
                  )}
                >
                  <AnimatePresence mode="wait">
                    {!isActive ? (
                      <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-4"
                      >
                        <div className="mb-6 size-16 md:size-20 shrink-0 rounded-half border-2 border-s2 p-1.5 bg-s2/30">
                          <img
                            src={
                              testimonial.avatar_url || testimonial.avatarUrl
                            }
                            alt={testimonial.name}
                            className="size-full object-cover rounded-full"
                          />
                        </div>
                        <h4 className="base-bold text-center text-p1 truncate w-full hidden md:block">
                          {testimonial.name}
                        </h4>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-0 flex flex-col justify-center p-6 md:p-12"
                      >
                        <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                          <div className="size-16 md:size-20 shrink-0 rounded-half border-2 border-s2 p-1.5 bg-s2/30">
                            <img
                              src={
                                testimonial.avatar_url || testimonial.avatarUrl
                              }
                              alt={testimonial.name}
                              className="size-full object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <h4 className="h6 text-p1 max-md:text-base">
                              {testimonial.name}
                            </h4>
                            <p className="small-compact uppercase text-s3">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <blockquote className="h5 italic text-p4 max-md:text-lg">
                          &quot;{testimonial.comment}&quot;
                        </blockquote>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center gap-3">
            {testimonials.map((item) => {
              const id = item.$id || item.id;
              return (
                <motion.div
                  key={id}
                  onClick={() => setActiveId(id)}
                  className={clsx(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    activeId === id ? "bg-p1 w-8" : "bg-s3 w-2",
                  )}
                  whileHover={{ scale: 1.5 }}
                />
              );
            })}
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Testimonials;
