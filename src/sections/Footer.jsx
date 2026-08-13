import { socials } from "../constants/index.jsx";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer>
      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-md:flex-col"
        >
          <div className="small-compact flex flex-1 flex-wrap items-center justify-center gap-5">
            <p className="opacity-70">
              © 2026 PT. Satya Karya Technosolution. All Rights Reserved.
            </p>
          </div>
          <div className="flex items-center justify-center sm:ml-auto">
            <p className="legal-after relative mr-9 text-p5 transition-all duration-500 hover:text-p1 cursor-pointer">
              Privacy Policy
            </p>
            <p className="text-p5 transition-all duration-500 hover:text-p1 cursor-pointer">
              Terms of Use
            </p>
          </div>

          <ul className="flex flex-1 justify-center gap-3 max-md:mt-10 md:justify-end">
            {socials.map(({ id, url, icon, title }) => (
              <li key={id}>
                <motion.a
                  href={url}
                  className="social-icon"
                  whileHover={{ scale: 1.1, backgroundColor: "#2EF2FF" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img
                    src={icon}
                    alt={title}
                    className="size-1/3 object-contain"
                  />
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </footer>
  );
};
export default Footer;
