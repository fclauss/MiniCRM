import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import UploadDocumentModal from "./UploadDocumentModal";

export default function DocumentList({ 
  documents = [], 
  isLoading = false, 
  documentType, 
  contactId,
  onUploadSuccess
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className="py-8">
        <LoadingSpinner className="mx-auto" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{documentType}s</h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload New {documentType}
        </button>
      </div>
      
      {documents.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">No {documentType.toLowerCase()}s found.</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {doc.FileName}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {doc.DocumentType}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {doc.Description || "No description"}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Uploaded on {formatDate(doc.UploadDate)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <a
                      href={doc.DocumentFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showUploadModal && (
        <UploadDocumentModal
          contactId={contactId}
          documentType={documentType}
          onClose={() => setShowUploadModal(false)}
          onSuccess={onUploadSuccess}
        />
      )}
    </div>
  );
}
