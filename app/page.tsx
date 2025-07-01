import About from "@/components/About";
import CartDrawer from "@/components/CartDrawer";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Links from "@/components/Links";
import Logo from "@/components/logo";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Products from "@/components/Products";

export default function HomePage() {
  return (
    <main>
      <Logo />
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
