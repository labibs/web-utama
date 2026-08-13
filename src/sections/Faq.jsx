import { Element } from "react-scroll";
import { useState, useEffect } from "react";
import { faq as staticFaq } from "../constants/index.jsx";
import { databases } from "../lib/appwrite";
import FaqItem from "../components/FaqItem.jsx";
import { Query } from "appwrite";

const Faq = () => {
  const [faq, setFaq] = useState([]);
  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_FAQ_COLLECTION_ID;

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID, [Query.orderAsc("order")]);
      if (response.documents.length > 0) setFaq(response.documents);
      else setFaq(staticFaq);
    } catch (error) {
      setFaq(staticFaq);
    }
  };

  const halfLength = Math.floor(faq.length / 2);

  return (
    <section>
      <Element name="tanya jawab" className="relative">
        <div className="container relative z-2 py-28 max-md:py-16">
          <div className="max-md:text-center">
            <h3 className="h3 max-md:h5 max-w-640 max-lg:max-w-md mb-7 text-p4 mx-auto">Punya Pertanyaan? Kami Punya Jawabannya.</h3>
            <p className="body-1 max-lg:max-w-sm mx-auto max-md:body-3">Temukan informasi lengkap seputar layanan dan solusi teknologi dari Sakte.id di sini.</p>
          </div>
          <div className="faq-line_after w-0.5 h-full absolute left-[calc(50%_-_1px)] top-0 -z-1 bg-s2 max-lg:hidden" />
        </div>

        <div className="faq-glow_before relative z-2 border-2 border-s2 bg-s1">
          <div className="container flex gap-10 max-lg:block">
            <div className="rounded-half absolute -top-10 left-[calc(50%_-_40px)] z-4 flex size-20 items-center justify-center border-2 border-s2 bg-s1"><img src="/images/faq-logo.svg" alt="logo" className="size-1/2" /></div>
            <div className="relative flex-1 pt-24 max-md:pt-16">{faq.slice(0, halfLength).map((item, index) => (<FaqItem key={item.$id || item.id} item={item} index={index} />))}</div>
            <div className="relative flex-1 lg:pt-24">{faq.slice(halfLength).map((item, index) => (<FaqItem key={item.$id || item.id} item={item} index={halfLength + index} />))}</div>
          </div>
          <div className="faq-line_after absolute left-[calc(50%_-_1px)] top-0 -z-1 h-full w-0.5 bg-s2 max-lg:hidden" />
        </div>
      </Element>
    </section>
  );
};

export default Faq;
