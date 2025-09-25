import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/assets/styles/_global.scss';
import Header from './components/header/Header';
import Home from './pages/home/Home';
import AIPage from './pages/aiPage/AIPage';
import Routine from './pages/routine/Routine';
function App() {
  return (
    <Router>
      <>
        <Header />
        <Home />
        <AIPage />
        <Routine />
      </>
    </Router>
  );
}

export default App;
