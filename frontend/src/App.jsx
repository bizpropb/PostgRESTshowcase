import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Authors from './pages/Authors';
import Genres from './pages/Genres';
import Advanced from './pages/Advanced';
import ApiDocs from './pages/ApiDocs';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/advanced" element={<Advanced />} />
          <Route path="/api-docs" element={<ApiDocs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
