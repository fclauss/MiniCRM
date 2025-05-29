import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddContact from "./pages/AddContact";
import ContactDetail from "./pages/ContactDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-contact" element={<AddContact />} />
            <Route path="/contact/:contactId" element={<ContactDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
