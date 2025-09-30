import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/assets/styles/_global.scss';
import Header from './components/header/Header';
import Home from './pages/home/Home';
import AIPage from './pages/aiPage/AIPage';
import Routine from './pages/routine/Routine';
import Footer from './components/footer/Footer';
import AboutUs from './pages/aboutUs/AboutUs';
import ChatAi from './pages/chatAi/ChatAi';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';
import BuyProducts from './pages/buyProduc/BuyProducts';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <main>
                <section id="home">
                  <Home />
                </section>
                <section id="aipage">
                  <AIPage />
                </section>
                <section id="routine">
                  <Routine />
                </section>
                <section id="aboutus">
                  <AboutUs />
                </section>
                <section id="buyproducts">
                  <BuyProducts />
                </section>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route path="/chatai" element={<ChatAi />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
