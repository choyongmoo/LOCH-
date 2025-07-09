import './index.css'
import Navbar from './components/layout/Navbar';
import MainSection from './components/layout/MainSection'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <MainSection />
      </main>
    </>
  );
}