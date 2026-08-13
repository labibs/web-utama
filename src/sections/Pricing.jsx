import { Element } from "react-scroll";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { plans as staticPlans } from "../constants/index.jsx";
import { databases } from "../lib/appwrite";
import CountUp from "react-countup";
import Button from "../components/Button.jsx";
import { motion, AnimatePresence } from "framer-motion";

const Pricing = () => {
  const [isCorporate, setIsCorporate] = useState(false);
  const [plans, setPlans] = useState([]);

  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID;

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID);
      if (response.documents.length > 0) {
        // Group by ID or format to match expected structure
        setPlans(response.documents);
      } else {
        setPlans(staticPlans);
      }
    } catch (error) {
      setPlans(staticPlans);
    }
  };

  const currentPlans = plans.filter((p) => p.isCorporate === isCorporate);
  // If we're using static fallback, the structure is slightly different, but the map works if we're careful.
  const displayPlans =
    currentPlans.length > 0
      ? currentPlans
      : plans.length > 0
        ? plans
        : staticPlans;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -12,
      scale: 1.03,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <section>
      <Element name="produk">
        <div className="container">
          <div className="pricing-head_res relative z-2 border-2 border-s2 bg-s1/50 pb-40 pt-28 max-xl:max-w-4xl max-lg:border-none max-lg:bg-transparent max-lg:pb-32 max-lg:pt-16 mx-auto">
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h3 max-lg:h4 max-md:h5 z-3 relative mx-auto mb-14 max-w-lg text-center text-p4 max-md:mb-11 max-sm:max-w-sm"
            >
              Layanan & Solusi Teknologi
            </motion.h3>
            <div className="relative z-4 mx-auto flex w-[375px] rounded-3xl border-[3px] border-s4/25 bg-s1/50 p-2 backdrop-blur-[6px] max-md:w-[310px]">
              <button
                className={clsx("pricing-head_btn", !isCorporate && "text-p4")}
                onClick={() => setIsCorporate(false)}
              >
                Individu
              </button>
              <button
                className={clsx("pricing-head_btn", isCorporate && "text-p4")}
                onClick={() => setIsCorporate(true)}
              >
                Corporate
              </button>
              <div
                className={clsx(
                  "g4 rounded-14 before:h-100 pricing-head_btn_before absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(50%-8px)] overflow-hidden shadow-400 transition-transform duration-500",
                  isCorporate && "translate-x-full",
                )}
              />
            </div>
            <div className="pricing-bg max-md:hidden">
              <img
                src="/images/bg-outlines.svg"
                width={960}
                height={380}
                alt="outline"
                className="relative z-2"
              />
              <img
                src="/images/bg-outlines-fill.png"
                width={960}
                height={380}
                alt="outline"
                className="absolute inset-0 mix-blend-soft-light opacity-5"
              />
            </div>
          </div>

          <div className="flex flex-col items-center -mt-12 max-lg:-mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative z-2 flex items-start max-lg:flex-row max-lg:overflow-x-auto max-lg:w-full max-lg:pb-16 max-lg:pt-10 max-lg:gap-5 scroll-hide scroll-snap"
            >
              <AnimatePresence mode="wait">
                {displayPlans.map((plan, index) => {
                  const title =
                    plan.isCorporate !== undefined
                      ? plan.title
                      : isCorporate
                        ? plan.titleCorporate
                        : plan.title;
                  const caption =
                    plan.isCorporate !== undefined
                      ? plan.caption
                      : isCorporate
                        ? plan.captionCorporate
                        : plan.caption;
                  const price =
                    plan.isCorporate !== undefined
                      ? plan.price
                      : isCorporate
                        ? plan.priceYearly
                        : plan.priceMonthly;
                  const originalPrice =
                    plan.isCorporate !== undefined
                      ? plan.priceOriginal
                      : isCorporate
                        ? plan.priceYearlyOriginal
                        : plan.priceOriginal;
                  const features =
                    plan.isCorporate !== undefined
                      ? plan.features
                      : isCorporate
                        ? plan.featuresCorporate
                        : plan.features;

                  const waUrl =
                    "https://wa.me/62895603389395?text=Halo%20Sakte.id,%20saya%20tertarik%20memesan%20layanan%20" +
                    title +
                    ".";

                  return (
                    <motion.div
                      key={`${isCorporate}-${plan.$id || plan.id}`}
                      variants={cardVariants}
                      whileHover="hover"
                      className={clsx(
                        "relative border-2 p-12 max-xl:p-10 max-lg:min-w-[85vw] lg:w-[400px] max-lg:rounded-3xl shrink-0 transition-colors duration-500",
                        index === 0 && "pricing-plan_first pricing-plan_odd",
                        index === 1 && "pricing-plan_even z-2",
                        index === 2 && "pricing-plan_last pricing-plan_odd",
                      )}
                    >
                      {index === 1 && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 whitespace-nowrap">
                          <div className="bg-p1 text-s1 base-bold px-6 py-2 rounded-full shadow-500 uppercase tracking-wider text-[10px]">
                            Terlaris
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="g4 absolute h-330 left-0 right-0 top-0 z-1 rounded-tl-3xl rounded-tr-3xl" />
                      )}
                      <div
                        className={clsx(
                          "relative z-2 flex flex-col items-center",
                          index === 1 ? "pt-24" : "pt-12",
                        )}
                      >
                        <div
                          className={clsx(
                            "small-2 rounded-20 relative z-2 mx-auto mb-6 border-2 px-4 py-1 uppercase",
                            index === 1
                              ? "border-p3 text-p3"
                              : "border-p1 text-p1",
                          )}
                        >
                          {title}
                        </div>
                        <div className="relative z-2 flex flex-col items-center justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={clsx(
                                "line-through opacity-50 text-xl font-medium",
                                index === 1 ? "text-p3" : "text-p4",
                              )}
                            >
                              Rp {originalPrice} Jt
                            </span>
                            <span className="bg-p1/20 text-p1 text-[10px] px-2 py-0.5 rounded-full border border-p1/30">
                              SAVE{" "}
                              {Math.round(
                                ((originalPrice - price) / originalPrice) * 100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div
                              className={clsx(
                                "h-num flex items-start max-md:text-5xl",
                                index === 1 ? "text-p3" : "text-p4",
                              )}
                            >
                              Rp{" "}
                              <CountUp
                                start={0}
                                end={price}
                                duration={0.4}
                                decimals={price % 1 !== 0 ? 1 : 0}
                                useEasing={false}
                                preserveValue
                              />
                            </div>
                            <div className="small-1 ml-1 uppercase">jt</div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={clsx(
                          "body-1 relative z-2 mb-10 w-full border-b-s2 pb-9 text-center text-p4 max-md:body-3",
                          index === 1 && "border-b",
                        )}
                      >
                        {caption}
                      </div>
                      <ul className="mx-auto space-y-4 xl:px-7">
                        {features.map((f, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="relative flex items-center gap-5"
                          >
                            <img
                              src="/images/check.png"
                              alt="check"
                              className="size-10 object-contain"
                            />
                            <p className="flex-1 max-md:body-3">{f}</p>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="mt-10 flex w-full justify-center">
                        <Button
                          icon={plan.icon || "/images/zap.svg"}
                          href={waUrl}
                          containerClassName="w-full"
                        >
                          Pesan Sekarang
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
            <div className="w-full flex justify-center mt-12">
              <p className="text-center text-p5 body-3 italic opacity-80 max-w-3xl px-4">
                * Investasi teknologi Anda bersifat fleksibel dan terbuka untuk
                negosiasi. Kami mendukung "Bespoke Development" — bebas
                kustomisasi fitur tanpa batas untuk memastikan solusi yang
                dibangun benar-benar presisi menjawab tantangan bisnis Anda.
              </p>
            </div>
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Pricing;
