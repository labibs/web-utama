import { Element, Link as LinkScroll } from "react-scroll";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { details, features as staticFeatures } from "../constants/index.jsx";
import { databases } from "../lib/appwrite";
import Button from "../components/Button.jsx";

const Features = () => {
  const [features, setFeatures] = useState([]);
  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_FEATURES_COLLECTION_ID;

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID);
      if (response.documents.length > 0) setFeatures(response.documents);
      else setFeatures(staticFeatures);
    } catch (error) {
      setFeatures(staticFeatures);
    }
  };

  return (
    <section>
      <Element name="layanan">
        <div className="container">
          <div className="relative flex md:flex-wrap flex-nowrap border-2 border-s3 rounded-7xl md:overflow-hidden max-md:flex-row max-md:overflow-x-auto max-md:pb-10 scroll-hide scroll-snap feature-after md:g7 max-md:border-none max-md:rounded-none max-md:gap-5">
            {features.map((item, index) => {
              const id = item.$id || item.id;
              const button = item.button || {
                title: item.button_title,
                icon: item.button_icon,
                href: "https://wa.me/62895603389395",
                target: item.id === "1" ? "portofolio" : null,
              };

              return (
                <motion.div
                  key={id}
                  className="relative z-2 md:px-10 px-5 md:pb-10 pb-5 md:flex-50 max-md:g7 max-md:border-2 max-md:border-s3 max-md:rounded-3xl max-md:min-w-[85vw] max-md:flex-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="w-full flex justify-start items-start">
                    <div className="-ml-3 mb-12 flex items-center justify-center flex-col max-md:mb-8">
                      <div className="w-0.5 h-16 bg-s3" />
                      <img
                        src={item.icon || item.icon_url}
                        className="size-28 object-contain max-md:size-20"
                        alt="icon"
                      />
                    </div>
                  </div>
                  <p className="caption mb-5 max-md:mb-4">{item.caption}</p>
                  <h2 className="max-w-400 mb-7 h3 text-p4 max-md:mb-6 max-md:h5">
                    {item.title}
                  </h2>
                  <p className="mb-11 body-1 max-md:mb-8 max-md:body-3">
                    {item.text}
                  </p>
                  <div className="flex justify-start">
                    {button.target ? (
                      <LinkScroll to={button.target} offset={-100} spy smooth>
                        <Button icon={button.icon}>{button.title}</Button>
                      </LinkScroll>
                    ) : (
                      <Button icon={button.icon} href={button.href}>
                        {button.title}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}

            <ul className="relative flex justify-around flex-grow px-[5%] border-2 border-s3 rounded-7xl max-md:hidden">
              <div className="absolute bg-s3/20 top-[38%] left-0 right-0 w-full h-[1px] z-10" />
              {details.map(({ id, icon, title }, index) => (
                <motion.li
                  key={id}
                  className="relative pt-16 px-4 pb-14"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute top-8 bottom-0 left-1/2 bg-s3/20 w-[1px] h-full z-10" />
                  <motion.div
                    className="flex items-center justify-center mx-auto mb-3 border-2 border-s2 rounded-full hover:border-s4 transition-all duration-500 shadow-500 size-20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <img
                      src={icon}
                      alt={title}
                      className="size-17/20 object-contain z-20"
                    />
                  </motion.div>
                  <h3 className="relative z-2 max-w-36 mx-auto my-0 base-small text-center uppercase">
                    {title}
                  </h3>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Element>
    </section>
  );
};
export default Features;
