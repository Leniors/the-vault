import About from "@/components/About";
import CartDrawer from "@/components/CartDrawer";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Links from "@/components/Links";
import LogoIcon from "@/components/LogoPage";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Products from "@/components/Products";

export default function HomePage() {
  return (
    <main>
      <LogoIcon />
      <Navbar />
      <CartDrawer />
      <Hero />
      <Links />
      <Events />
      <Products />
      <About />
      <Newsletter />
      <Footer />
    </main>
  );
}
