import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import {
  SignIn,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";
import AdminLayout from "./admin/AdminLayout.jsx";
import PortfolioAdmin from "./admin/PortfolioAdmin.jsx";
import NebengAdmin from "./admin/NebengAdmin.jsx";
import ServicesAdmin from "./admin/ServicesAdmin.jsx";
import FaqAdmin from "./admin/FaqAdmin.jsx";
import TestimonialsAdmin from "./admin/TestimonialsAdmin.jsx";
import FeaturesAdmin from "./admin/FeaturesAdmin.jsx";

const AUTHORIZED_EMAILS = ["adminnnn@sakte.id", "visioner.lv@gmail.com"];

const ProtectedAdmin = ({ children }) => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  if (!AUTHORIZED_EMAILS.includes(userEmail)) {
    return (
      <div className="min-h-screen bg-[#080D27] text-white flex flex-col items-center justify-center p-10 text-center">
        <h1 className="h3 text-red-500 mb-4">Akses Ditolak</h1>
        <p className="body-1 opacity-70">
          Maaf, email {userEmail} tidak terdaftar.
        </p>
        <a href="/" className="mt-8 text-p1 underline">
          Kembali ke Beranda
        </a>
      </div>
    );
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/sign-in"
        element={
          <div className="flex justify-center items-center min-h-screen bg-[#080D27]">
            <SignIn routing="path" path="/sign-in" />
          </div>
        }
      />
      <Route
        path="/admin/*"
        element={
          <>
            <SignedIn>
              <ProtectedAdmin>
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
                    <Route
                      path="testimonials"
                      element={<TestimonialsAdmin />}
                    />
                    <Route path="numpak" element={<NebengAdmin />} />
                  </Routes>
                </AdminLayout>
              </ProtectedAdmin>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
};

export default App;
