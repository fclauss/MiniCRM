import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getContact, getDocuments } from "../api/baserow";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import DocumentList from "../components/DocumentList";

export default function ContactDetail() {
  const { contactId } = useParams();
  const [contact, setContact] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [docsLoading, setDocsLoading] = useState(true);
  
  useEffect(() => {
    const fetchContactData = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await getContact(contactId);
        setContact(response.data);
      } catch (err) {
        console.error("Error fetching contact:", err);
        setError("Failed to load contact details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchContactData();
  }, [contactId]);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!contactId) return;
      
      setDocsLoading(true);
      
      try {
        // Fetch quotations
        const quotationsResponse = await getDocuments(contactId, "Quotation");
        setQuotations(quotationsResponse.data.results || []);
        
        // Fetch invoices
        const invoicesResponse = await getDocuments(contactId, "Invoice");
        setInvoices(invoicesResponse.data.results || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
        // We don't set the main error here to avoid blocking the whole page
      } finally {
        setDocsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [contactId]);
  
  const handleDocumentUpload = async () => {
    // Refresh documents after upload
    setDocsLoading(true);
    try {
      const quotationsResponse = await getDocuments(contactId, "Quotation");
      setQuotations(quotationsResponse.data.results || []);
      
      const invoicesResponse = await getDocuments(contactId, "Invoice");
      setInvoices(invoicesResponse.data.results || []);
    } catch (err) {
      console.error("Error refreshing documents:", err);
    } finally {
      setDocsLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} className="mt-4" />;
  }
  
  if (!contact) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Contact not found. <Link to="/" className="font-medium underline text-yellow-700 hover:text-yellow-600">Return to dashboard</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg leading-6 font-medium text-gray-900">
            Contact Details
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal and contact information.
          </p>
        </div>
        <div>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {contact.Status}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.FullName}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Company</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.CompanyName || "N/A"}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <a href={`mailto:${contact.EmailAddress}`} className="text-blue-600 hover:text-blue-800">
                {contact.EmailAddress}
              </a>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Phone number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {contact.PhoneNumber ? (
                <a href={`tel:${contact.PhoneNumber}`} className="text-blue-600 hover:text-blue-800">
                  {contact.PhoneNumber}
                </a>
              ) : "N/A"}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {contact.StreetAddress ? (
                <>
                  {contact.StreetAddress}<br />
                  {contact.City && `${contact.City}, `}
                  {contact.StateProvince && `${contact.StateProvince} `}
                  {contact.PostalCode && contact.PostalCode}<br />
                  {contact.Country && contact.Country}
                </>
              ) : "N/A"}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {contact.Notes || "No notes available."}
            </dd>
          </div>
        </dl>
      </div>
      
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Documents</h2>
        
        <div className="space-y-6">
          <DocumentList
            documents={quotations}
            isLoading={docsLoading}
            documentType="Quotation"
            contactId={contactId}
            onUploadSuccess={handleDocumentUpload}
          />
          
          <DocumentList
            documents={invoices}
            isLoading={docsLoading}
            documentType="Invoice"
            contactId={contactId}
            onUploadSuccess={handleDocumentUpload}
          />
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Link
          to="/"
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
