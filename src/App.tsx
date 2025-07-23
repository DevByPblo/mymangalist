 
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import AddMangaPage from './pages/AddMangaPage.tsx';
import MangaDetailsPage from './pages/MangaDetailsPage.tsx';
import SearchPage from './pages/Search.tsx';
import NotFound from './pages/NotFound.tsx';
import Genres from './pages/Genres.tsx';
import './App.css';
import Navbar from './components/Navbar.tsx';
import GenreMangaList from './pages/GenreMangaList.tsx';


export default function App() {
  return (

    <main >
      <div className='mb-10'>
           
<Navbar />

      </div>
            
        <Routes>
              <Route path="/" element={<Home />} />       
              <Route path="/addManga" element={<AddMangaPage />} />       
              <Route path="/search" element={<SearchPage />} />       
              <Route path="/manga/:id" element={<MangaDetailsPage />} />         
              <Route path="*" element={<NotFound />} />
              <Route path="/Genres" element={<Genres/>} />
               <Route path="/genre/:id" element={<GenreMangaList />} />
            </Routes>
    </main>
   
  );
}
