import { Element } from "react-scroll";
import { useEffect, useRef, useState } from "react";
import { Marker } from "../components/Marker.jsx";
import clsx from "clsx";

const prototypes = [
  {
    id: "0",
    title: "Numpak App",
    subtitle: "Solusi Berbagi Tumpangan",
    description:
      "Inovasi transportasi cerdas yang memudahkan pengguna berbagi tumpangan dengan aman, nyaman, dan efisien. Dirancang dengan UI modern untuk pengalaman mobilitas yang mulus.",
    url: "https://landing-numpak.vercel.app",
    displayUrl: "landing-numpak.vercel.app",
    image: "/images/ss-rutee.PNG", // Menggunakan asset yang tersedia
  },
  {
    id: "1",
    title: "Sakti POS",
    subtitle: "Point of Sale & Inventory",
    description:
      "Sistem kasir cerdas yang memangkas kebutuhan infrastruktur rumit. Cukup dengan smartphone, Anda mendapatkan kendali bisnis real-time yang powerful. Sangat fleksibel untuk retail, resto, hingga jasa, dengan fitur modular yang bisa diaktivasi sesuai kebutuhan unik bisnis Anda.",
    url: "https://sakti-pos.vercel.app/",
    displayUrl: "sakti-pos.vercel.app",
    image: "/images/sakti-yes.png",
  },
  {
    id: "2",
    title: "Satya ERP",
    subtitle: "Business Command Center",
    description:
      "Prototipe ERP terpadu untuk menyatukan insight eksekutif, pengelolaan SDM, portofolio proyek, keuangan, serta CRM dalam satu business command center yang responsif dan mudah digunakan.",
    url: "https://satya-erp.sakte.id/",
    displayUrl: "satya-erp.sakte.id",
    livePreview: true,
  },
  {
    id: "3",
    title: "Saku Santri",
    subtitle: "Keuangan Pesantren Terintegrasi",
    description:
      "Dashboard keuangan pesantren untuk memantau saldo kas, pembayaran SPP, iuran, tabungan, serta status penagihan santri secara terpusat, transparan, dan mudah digunakan.",
    url: "https://saku-santri.sakte.id/",
    displayUrl: "saku-santri.sakte.id",
    livePreview: true,
  },
  {
    id: "4",
    title: "Misykatmart",
    subtitle: "E-Commerce untuk Bisnis",
    description:
      "Konsep toko online profesional untuk UMKM, distributor, reseller, dan brand yang ingin berkembang dari toko tunggal menuju marketplace mini multi-vendor.",
    url: "https://misykatmart.sakte.id/landing",
    displayUrl: "misykatmart.sakte.id/landing",
    livePreview: true,
  },
];

const Download = () => {
  const [activeProto, setActiveProto] = useState(prototypes[0]);
  const prototypeNavRef = useRef(null);
  const activeIndex = prototypes.findIndex(
    (proto) => proto.id === activeProto.id,
  );

  useEffect(() => {
    const activeButton = prototypeNavRef.current?.querySelector(
      `[data-prototype-id="${activeProto.id}"]`,
    );

    activeButton?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeProto.id]);

  const selectPrototype = (index) => {
    if (index >= 0 && index < prototypes.length) {
      setActiveProto(prototypes[index]);
    }
  };

  return (
    <section>
      <Element
        name="prototipe"
        className="g7 relative pb-32 pt-24 max-lg:pb-24 max-md:py-16"
      >
        <div className="container">
          <div className="flex items-center gap-16 max-lg:flex-col lg:flex-row max-lg:items-start">
            <div className="relative flex-1 lg:w-1/2 w-full">
              <div className="mb-10 text-left">
                <h2 className="h2 text-p1 mb-4 max-md:h4">Prototipe Kami</h2>
                <p className="body-3 uppercase tracking-widest text-s3">
                  Inovasi Digital Sedang Dikerjakan
                </p>
              </div>

              <div className="mb-10">
                <div
                  ref={prototypeNavRef}
                  className="scroll-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 scroll-smooth touch-pan-x"
                >
                  {prototypes.map((proto) => (
                    <button
                      key={proto.id}
                      data-prototype-id={proto.id}
                      onClick={() => setActiveProto(proto)}
                      className={clsx(
                        "base-bold shrink-0 snap-start rounded-2xl border-2 px-5 py-2.5 transition-all duration-300 text-sm",
                        activeProto.id === proto.id
                          ? "border-p1 bg-p1/10 text-p1"
                          : "border-s3 text-p5 hover:border-p1/50",
                      )}
                    >
                      {proto.title}
                    </button>
                  ))}
                </div>

                <div className="mt-1 flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-2"
                    role="group"
                    aria-label="Pilih halaman prototype"
                  >
                    {prototypes.map((proto, index) => (
                      <button
                        key={proto.id}
                        type="button"
                        onClick={() => selectPrototype(index)}
                        aria-label={`Tampilkan ${proto.title}`}
                        aria-current={activeIndex === index ? "true" : undefined}
                        className={clsx(
                          "h-2 rounded-full transition-all duration-300",
                          activeIndex === index
                            ? "w-7 bg-p1"
                            : "w-2 bg-s3 hover:bg-p5",
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="mr-1 text-xs font-semibold tracking-widest text-p5/70">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(prototypes.length).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => selectPrototype(activeIndex - 1)}
                      disabled={activeIndex === 0}
                      aria-label="Prototype sebelumnya"
                      className="flex size-9 items-center justify-center rounded-full border-2 border-s3 text-p4 transition-all hover:border-p1 hover:text-p1 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <span aria-hidden="true">←</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => selectPrototype(activeIndex + 1)}
                      disabled={activeIndex === prototypes.length - 1}
                      aria-label="Prototype berikutnya"
                      className="flex size-9 items-center justify-center rounded-full border-2 border-p1 bg-p1/10 text-p1 transition-all hover:bg-p1 hover:text-s1 disabled:cursor-not-allowed disabled:border-s3 disabled:bg-transparent disabled:text-p5 disabled:opacity-30"
                    >
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>

                <p className="small-compact mt-3 text-s3 md:hidden">
                  Geser pilihan untuk melihat prototype lainnya →
                </p>
              </div>

              <div className="min-h-[160px] transition-all duration-500 mb-8 text-left">
                <h4 className="h4 text-p4 mb-3 max-md:h5">
                  {activeProto.title}
                </h4>
                <p className="body-1 opacity-80 leading-relaxed max-md:body-3">
                  {activeProto.description}
                </p>
              </div>

              <div className="flex items-center gap-6 max-md:flex-row max-md:gap-4">
                <a
                  href={activeProto.url}
                  target="_blank"
                  rel="noreferrer"
                  className="size-20 download_tech-icon_before relative flex items-center justify-center rounded-half border-2 border-s3 bg-s1 transition-borderColor duration-500 hover:border-p1 shrink-0"
                >
                  <span className="absolute -top-2 rotate-90">
                    <Marker />
                  </span>
                  <img
                    src="/images/lines.svg"
                    alt="lines"
                    className="absolute size-13/20 object-contain"
                  />
                  <span className="h6 text-p1 z-2 uppercase font-black">
                    Go
                  </span>
                </a>
                <div className="flex flex-col items-start">
                  <p className="small-2 uppercase tracking-widest text-p5">
                    Lihat Prototipe
                  </p>
                  <p className="small-compact text-s3">
                    {activeProto.displayUrl}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex-1 lg:w-1/2 w-full flex justify-center perspective-[2000px] max-md:mt-16 overflow-hidden py-10">
              <div
                className="relative transition-all duration-1000 ease-in-out transform shadow-500"
                style={{
                  transform: "rotateY(-25deg) rotateX(15deg) rotateZ(5deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative w-[260px] h-[520px] sm:w-[300px] sm:h-[600px] md:w-[330px] md:h-[580px] bg-[#111] rounded-[40px] sm:rounded-[50px] p-2 border-[4px] sm:border-[6px] border-[#333] shadow-[20px_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 sm:w-32 sm:h-7 bg-[#111] rounded-b-2xl z-20 flex items-center justify-center">
                    <div className="w-8 h-1 sm:w-10 sm:h-1 bg-[#222] rounded-full" />
                  </div>
                  <div className="relative size-full overflow-hidden rounded-[30px] sm:rounded-[40px] bg-black">
                    {activeProto.livePreview ? (
                      <iframe
                        key={activeProto.id}
                        src={activeProto.url}
                        title={`Preview interaktif ${activeProto.title}`}
                        loading="lazy"
                        className="absolute inset-0 size-full border-0 bg-white"
                      />
                    ) : (
                      <img
                        key={activeProto.id}
                        src={activeProto.image}
                        alt={activeProto.title}
                        className="absolute inset-0 size-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Download;
