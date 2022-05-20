import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Components/Header';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/tv" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={< Home />}>
          <Route path="movies/:id" element={< Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
