import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">SimpleCRM</span>
          </Link>
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/add-contact" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/add-contact' 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Add Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
