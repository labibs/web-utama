import { Element } from "react-scroll";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { portfolio as staticPortfolio } from "../constants/index.jsx";
import { databases } from "../lib/appwrite";
import Button from "../components/Button.jsx";

const Portfolio = () => {
  const [activeId, setActiveId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const scrollRef = useRef(null);

  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_PORTFOLIO_COLLECTION_ID;

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID);
      if (response.documents.length > 0) {
        setPortfolio(response.documents);
        setActiveId(response.documents[0].$id);
      } else {
        setPortfolio(staticPortfolio);
        setActiveId(staticPortfolio[0].id);
      }
    } catch (error) {
      console.error("Fetch error, using fallback:", error);
      setPortfolio(staticPortfolio);
      setActiveId(staticPortfolio[0].id);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setSelectedProject(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "unset";
  }, [selectedProject]);

  return (
    <section className="py-24">
      <Element name="portofolio">
        <div className="container">
          <div className="mb-20 max-md:text-center">
            <motion.p
              className="caption"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Karya Kami
            </motion.p>
            <motion.h3
              className="h3 text-p4 max-md:h4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Projek Yang Pernah Dikerjakan
            </motion.h3>
          </div>
          <div
            ref={scrollRef}
            className="scroll-hide flex w-full gap-6 overflow-x-auto pb-10 scroll-snap"
          >
            {portfolio.map((item, index) => {
              const id = item.$id || item.id;
              const isActive = activeId === id;
              return (
                <motion.div
                  key={id}
                  onClick={() => setActiveId(id)}
                  className={clsx(
                    "relative h-[400px] cursor-pointer overflow-hidden rounded-3xl border-2 border-s2 bg-s1 transition-all duration-700 ease-in-out shrink-0",
                    isActive
                      ? "w-[calc(100%_-_40px)] md:w-[calc((100%_-_72px)*3/4_+_48px)] lg:w-[calc((1252px_-_32px_-_72px)*3/4_+_48px)]"
                      : "w-[100px] md:w-[calc((100%_-_72px)/4)] lg:w-[calc((1252px_-_32px_-_72px)/4)]",
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={
                    !isActive ? { scale: 1.02, borderColor: "#2EF2FF" } : {}
                  }
                >
                  <div
                    className={clsx(
                      "absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-500",
                      isActive
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100",
                    )}
                  >
                    <div className="mb-6 size-16 md:size-20 shrink-0 rounded-half border-2 border-s2 p-1.5 bg-s2/30">
                      <img
                        src={item.logo_url || item.logo}
                        alt="logo"
                        className="size-full object-contain"
                      />
                    </div>
                    <h4 className="base-bold text-center text-p4 truncate w-full hidden md:block">
                      {item.title}
                    </h4>
                  </div>
                  <div
                    className={clsx(
                      "absolute inset-0 transition-opacity duration-700 ease-in-out",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none",
                    )}
                  >
                    <img
                      src={item.screenshot_url || item.screenshot}
                      alt="screenshot"
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-s1 via-transparent/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end gap-4">
                      <div className="flex-1">
                        <p className="small-2 mb-2 uppercase text-p1">
                          {item.category}
                        </p>
                        <h4 className="h4 text-p4 max-md:h6">{item.title}</h4>
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(item);
                        }}
                        className="size-12 rounded-full border-2 border-p1 flex items-center justify-center bg-s1/50 hover:bg-p1 transition-all group/btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <img
                          src="/images/magictouch.svg"
                          alt="detail"
                          className="size-6 object-contain group-hover/btn:brightness-0"
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center gap-3">
            {portfolio.map((item) => {
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

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-s1/95 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setSelectedProject(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-s2 rounded-3xl border-2 border-s3 scroll-hide"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-s2/80 backdrop-blur-md border-b border-s3">
                <div>
                  <h2 className="h4 text-p1">{selectedProject.title}</h2>
                  <p className="small-2 uppercase text-s3 mt-1">
                    {selectedProject.category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="size-10 rounded-full border-2 border-s3 flex items-center justify-center hover:border-p1 transition-colors"
                >
                  <img src="/images/close.svg" alt="close" className="size-5" />
                </button>
              </div>
              <div className="p-6 md:p-10">
                <div className="mb-10">
                  <h4 className="body-1 text-p4 mb-4">Tentang Projek</h4>
                  <p className="body-3 text-p5 opacity-80 leading-relaxed">
                    {selectedProject.description ||
                      "Transformasi digital untuk meningkatkan efisiensi dan jangkauan pasar mitra kami."}
                  </p>
                </div>
                <div className="space-y-8">
                  <h4 className="body-1 text-p4">Galeri Projek</h4>
                  <div className="relative w-full rounded-2xl overflow-hidden border-2 border-s3 bg-s1 mb-8">
                    <img
                      src={
                        selectedProject.screenshot_url ||
                        selectedProject.screenshot
                      }
                      alt="Main"
                      className="w-full h-auto object-contain block"
                    />
                  </div>
                  {(
                    selectedProject.gallery_urls ||
                    selectedProject.gallery ||
                    []
                  )
                    .slice(0, 5)
                    .map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-full rounded-2xl overflow-hidden border-2 border-s3 bg-s1"
                      >
                        <img
                          src={img}
                          alt="Gallery"
                          className="w-full h-auto object-contain block"
                        />
                      </div>
                    ))}
                </div>
                <div className="mt-12 flex justify-center">
                  <Button
                    icon="/images/zap.svg"
                    href={
                      "https://wa.me/62895603389395?text=Halo%20Sakte.id,%20saya%20tertarik%20dengan%20projek%20" +
                      selectedProject.title
                    }
                  >
                    Saya tertarik dengan ini
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
