import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Images from './pages/Images';
import Asidebar from './pages/asidebar';
import Accueil from './pages/Accueil';
import AddTemplate from './pages/AddTemplate';
import Table from './pages/table';
import Pdf from './pages/Pdf';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/images" element={<Images />} />
        <Route exact path="/pdf" element={<Pdf />} />
        <Route exact path="/asidebar" element={<Asidebar />} />
        <Route exact path="/accueil" element={<Accueil />} />
        <Route exact path="/Addtemplate" element={<AddTemplate />} />
        <Route exact path="/table" element={<Table />} />
      </Routes>
    </Router>
  );
}

export default App;
