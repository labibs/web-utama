import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import {
  SignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import AdminLayout from "./admin/AdminLayout.jsx";
import PortfolioAdmin from "./admin/PortfolioAdmin.jsx";
import NebengAdmin from "./admin/NebengAdmin.jsx";
import ServicesAdmin from "./admin/ServicesAdmin.jsx";
import FaqAdmin from "./admin/FaqAdmin.jsx";
import TestimonialsAdmin from "./admin/TestimonialsAdmin.jsx";
import FeaturesAdmin from "./admin/FeaturesAdmin.jsx";

const AUTHORIZED_EMAILS = new Set([
  "adminnnn@sakte.id",
  "visioner.lv@gmail.com",
]);

const LoadingScreen = ({ label = "Memuat halaman..." }) => (
  <div className="min-h-screen bg-[#080D27] text-white flex items-center justify-center">
    <div className="flex items-center gap-3 text-p5">
      <span className="h-3 w-3 animate-pulse rounded-full bg-p1" />
      {label}
    </div>
  </div>
);

const ProtectedAdmin = ({ children }) => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <LoadingScreen label="Memverifikasi akun..." />;

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!userEmail || !AUTHORIZED_EMAILS.has(userEmail)) {
    return (
      <div className="min-h-screen bg-[#080D27] text-white flex flex-col items-center justify-center p-10 text-center">
        <h1 className="h3 text-red-500 mb-4">Akses Ditolak</h1>
        <p className="body-1 opacity-70">
          Maaf, akun {userEmail || "ini"} tidak terdaftar sebagai admin.
        </p>
        <div className="mt-8 flex gap-4">
          <a href="/" className="text-p1 underline">
            Kembali ke Beranda
          </a>
          <a href="/sign-in" className="text-p5 underline">
            Gunakan akun lain
          </a>
        </div>
      </div>
    );
  }
  return children;
};

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/admin/services" replace />}
      />
      <Route path="features" element={<FeaturesAdmin />} />
      <Route path="services" element={<ServicesAdmin />} />
      <Route path="portfolio" element={<PortfolioAdmin />} />
      <Route path="faq" element={<FaqAdmin />} />
      <Route path="testimonials" element={<TestimonialsAdmin />} />
      <Route path="numpak" element={<NebengAdmin />} />
      <Route path="*" element={<Navigate to="/admin/services" replace />} />
    </Routes>
  </AdminLayout>
);

const AdminGate = () => {
  const location = useLocation();

  return (
    <>
      <SignedIn>
        <ProtectedAdmin>
          <AdminRoutes />
        </ProtectedAdmin>
      </SignedIn>
      <SignedOut>
        <Navigate
          to="/sign-in"
          replace
          state={{ from: location.pathname }}
        />
      </SignedOut>
    </>
  );
};

const SignInPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#080D27] px-4 py-10">
    <SignedOut>
      <SignIn
        routing="path"
        path="/sign-in"
        forceRedirectUrl="/admin"
        fallbackRedirectUrl="/admin"
        appearance={{
          variables: {
            colorBackground: "#0C1838",
            colorText: "#ffffff",
            colorTextSecondary: "#B8C7E8",
            colorPrimary: "#B9F642",
          },
          elements: {
            card: "border border-[#334679] shadow-2xl",
            headerTitle: "text-white",
            headerSubtitle: "text-[#B8C7E8]",
          },
        }}
      />
    </SignedOut>
    <SignedIn>
      <Navigate to="/admin" replace />
    </SignedIn>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/admin/*" element={<AdminGate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
