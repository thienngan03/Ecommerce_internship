
import Hero from "../Components/Hero/Hero";

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <div className="home-content">
        <h1>Welcome to Home Page</h1>
        <p>This is the home page of our e-commerce application.</p>
        <p>Explore our products and shop now!</p>
        <p>Sign up or log in to get started.</p>
      </div>
      
    </div>
  );
};

export default Home;