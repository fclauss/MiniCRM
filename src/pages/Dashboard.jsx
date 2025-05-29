import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { searchContact } from "../api/baserow";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (contactId) => {
    setError("");
    setLoading(true);
    
    try {
      const response = await searchContact(contactId);
      const results = response.data.results;
      
      if (results && results.length > 0) {
        setSearchResults(results);
        // If only one result, navigate directly to it
        if (results.length === 1) {
          navigate(`/contact/${results[0].id}`);
        }
      } else {
        setSearchResults([]);
        setError("No contacts found with that ID.");
      }
    } catch (err) {
      console.error("Error searching for contact:", err);
      setError("Failed to search for contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Search</h1>
      
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Enter Prospect/Client Number" 
        />
        <p className="mt-2 text-sm text-gray-500">
          Enter a contact ID to find and view their details.
        </p>
      </div>
      
      <ErrorMessage message={error} className="mb-4" />
      
      {loading && (
        <div className="py-8">
          <LoadingSpinner className="mx-auto" />
        </div>
      )}
      
      {searchResults && searchResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Search Results</h2>
          <ul className="divide-y divide-gray-200">
            {searchResults.map((contact) => (
              <li key={contact.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.FullName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.CompanyName || "No company"}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {contact.Status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate(`/contact/${contact.id}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <div className="flex-1 min-w-0">
              <a href="/add-contact" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true"></span>
                <p className="text-sm font-medium text-gray-900">Add New Contact</p>
                <p className="text-sm text-gray-500">Create a new prospect or client record</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
