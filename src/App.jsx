import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/assets/styles/_global.scss';
import Header from './components/header/Header';
import Home from './pages/user/home/Home';
import AIPage from './pages/user/aiPage/AIPage';
import Routine from './pages/user/routine/Routine';
import Footer from './components/footer/Footer';
import AboutUs from './pages/user/aboutUs/AboutUs';
import ChatAi from './pages/user/chatAi/ChatAi';
import Login from './pages/user/login/Login';
import Admin from './pages/admin/Admin';
import BuyProducts from './pages/user/buyProduc/BuyProducts';

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
