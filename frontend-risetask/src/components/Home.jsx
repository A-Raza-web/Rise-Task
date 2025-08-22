
import "bootstrap/dist/css/bootstrap.min.css";
import Hero from "./Homepages/Hero";
import Features from "./Homepages/Features";
import About from "./Homepages/About";
import Testimonial  from "./Homepages/Testimonial";
import Pricing from "./Homepages/Pricing"
import Footer from "./Homepages/Footer"

function MainHome (){
  return (
    <>
      {/* Sections */}
        <Hero />
        <Features />
        <About />
        <Testimonial/>
        <Pricing/>
        <Footer/>
    </>
  );
};

export default MainHome;
