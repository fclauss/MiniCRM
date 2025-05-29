import { useState } from "react";
import { uploadDocument } from "../api/baserow";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

export default function UploadDocumentModal({ 
  contactId, 
  documentType, 
  onClose, 
  onSuccess 
}) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await uploadDocument(contactId, file, documentType, description);
      onSuccess(response.data);
      onClose();
    } catch (err) {
      console.error("Error uploading document:", err);
      setError(err.response?.data?.error || "Failed to upload document. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upload {documentType}</h3>
          <form className="mt-4 text-left" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                Select File *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
                required
              />
              {file && (
                <p className="text-sm text-gray-500 mt-1">Selected: {file.name}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                placeholder="Optional description for this document"
              ></textarea>
            </div>
            
            <ErrorMessage message={error} className="mb-4" />
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 background-transparent font-medium px-4 py-2 text-sm outline-none focus:outline-none mr-2 mb-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !file}
                className="bg-blue-600 text-white active:bg-blue-700 font-medium text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 disabled:opacity-50"
              >
                {loading ? <><LoadingSpinner size="small" className="mr-2" /> Uploading...</> : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
