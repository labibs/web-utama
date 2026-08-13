import { Element, Link as LinkScroll } from "react-scroll";
import { motion } from "framer-motion";
import Button from "../components/Button.jsx";

const Hero = () => {
  return (
    <section className="relative pt-60 pb-40 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32">
      <Element name="hero">
        <div className="container">
          <div className="relative z-2 max-w-512 max-lg:max-w-388">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="caption small-2 uppercase text-p3">
                PT. Satya Karya Technosolution
              </div>
              <h1 className="mb-6 h1 text-p4 uppercase max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-tight">
                Sakte.id
              </h1>
            </motion.div>

            <motion.p
              className="max-w-440 mb-14 body-1 max-md:mb-10 max-md:body-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Menghadirkan solusi dengan karya teknologi. Kami membantu
              transformasi digital bisnis Anda melalui Landing Page, Web Apps,
              dan Aplikasi Android berkualitas.
            </motion.p>

            <motion.div
              className="flex gap-4 max-md:flex-col max-md:items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LinkScroll to="produk" offset={-100} spy smooth>
                <Button icon="/images/zap.svg">Solusi Kami</Button>
              </LinkScroll>
              <LinkScroll to="prototipe" offset={-100} spy smooth>
                <Button icon="/images/magictouch.svg">Prototipe Kami</Button>
              </LinkScroll>
            </motion.div>
          </div>

          <motion.div
            className="absolute -top-32 left-[calc(50%-340px)] w-[1230px] pointer-events-none hero-img_res max-md:relative max-md:top-0 max-md:left-0 max-md:w-full max-md:mt-10 max-md:flex max-md:justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -20, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.6 },
              scale: { duration: 0.8, delay: 0.6 },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <img
              src="/images/hero.png"
              className="size-1230 max-lg:h-auto max-md:size-auto max-md:w-full max-md:scale-125"
              alt="hero"
            />
          </motion.div>
        </div>
      </Element>
    </section>
  );
};

export default Hero;
