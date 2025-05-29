import axios from 'axios';

// Replace with your Baserow API endpoint and API key
const BASEROW_API_URL = "https://api.baserow.io/api/database/rows/table/";
const BASEROW_API_KEY = "YOUR_API_KEY";

// Table IDs - replace with your actual table IDs from Baserow
const CONTACTS_TABLE_ID = "your_contacts_table_id";
const DOCUMENTS_TABLE_ID = "your_documents_table_id";

// Configure axios instance for Baserow
const baserowApi = axios.create({
  headers: {
    'Authorization': `Token ${BASEROW_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// API Functions for Contacts
export async function createContact(data) {
  // For development/testing, simulate API call
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => setTimeout(() => resolve({ data: { id: Math.floor(Math.random() * 10000) } }), 1000));
  }
  
  // Map form fields to Baserow fields
  const baserowData = {
    FullName: data.fullName,
    CompanyName: data.companyName,
    EmailAddress: data.emailAddress,
    PhoneNumber: data.phoneNumber,
    StreetAddress: data.streetAddress,
    City: data.city,
    StateProvince: data.stateProvince,
    PostalCode: data.postalCode,
    Country: data.country,
    Status: data.status,
    Notes: data.notes
  };
  
  return baserowApi.post(`${BASEROW_API_URL}${CONTACTS_TABLE_ID}/`, baserowData);
}

export async function getContact(contactId) {
  // For development/testing, simulate API call
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => setTimeout(() => resolve({
      data: {
        id: contactId,
        FullName: "John Doe",
        CompanyName: "Acme Inc",
        EmailAddress: "john@example.com",
        PhoneNumber: "555-123-4567",
        StreetAddress: "123 Main St",
        City: "Anytown",
        StateProvince: "CA",
        PostalCode: "12345",
        Country: "USA",
        Status: "Active Client",
        Notes: "Sample contact for development"
      }
    }), 800));
  }
  
  return baserowApi.get(`${BASEROW_API_URL}${CONTACTS_TABLE_ID}/${contactId}/`);
}

export async function searchContact(contactId) {
  // For development/testing, simulate API call
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => setTimeout(() => resolve({
      data: {
        results: [
          {
            id: contactId,
            FullName: "John Doe",
            CompanyName: "Acme Inc",
            Status: "Active Client"
          }
        ]
      }
    }), 800));
  }
  
  // In real implementation, you'd use Baserow's filter functionality
  return baserowApi.get(`${BASEROW_API_URL}${CONTACTS_TABLE_ID}/`, {
    params: {
      filter__field_id: 'ContactID',
      filter__equal: contactId
    }
  });
}

// API Functions for Documents
export async function getDocuments(contactId, documentType = null) {
  // For development/testing, simulate API call
  if (process.env.NODE_ENV === 'development') {
    const mockDocuments = [
      {
        id: "doc1",
        DocumentType: "Quotation",
        FileName: "Quote_2023_001.pdf",
        Description: "Initial project quote",
        UploadDate: "2023-05-15T10:30:00Z",
        DocumentFile: "https://example.com/files/quote.pdf"
      },
      {
        id: "doc2",
        DocumentType: "Invoice",
        FileName: "Invoice_2023_001.pdf",
        Description: "First payment invoice",
        UploadDate: "2023-06-01T14:45:00Z",
        DocumentFile: "https://example.com/files/invoice.pdf"
      }
    ];
    
    if (documentType) {
      const filtered = mockDocuments.filter(doc => doc.DocumentType === documentType);
      return new Promise(resolve => setTimeout(() => resolve({ data: { results: filtered } }), 800));
    }
    
    return new Promise(resolve => setTimeout(() => resolve({ data: { results: mockDocuments } }), 800));
  }
  
  let params = {
    filter__field_id: 'LinkedContact',
    filter__equal: contactId
  };
  
  if (documentType) {
    params = {
      ...params,
      filter__field_id2: 'DocumentType',
      filter__equal2: documentType
    };
  }
  
  return baserowApi.get(`${BASEROW_API_URL}${DOCUMENTS_TABLE_ID}/`, { params });
}

export async function uploadDocument(contactId, file, documentType, description = "") {
  // For development/testing, simulate API call
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => setTimeout(() => resolve({
      data: {
        id: Math.floor(Math.random() * 10000),
        DocumentType: documentType,
        FileName: file.name,
        Description: description,
        UploadDate: new Date().toISOString()
      }
    }), 1500));
  }
  
  // In real implementation, you'd use FormData to upload the file
  const formData = new FormData();
  formData.append('LinkedContact', contactId);
  formData.append('DocumentType', documentType);
  formData.append('DocumentFile', file);
  formData.append('FileName', file.name);
  formData.append('Description', description);
  
  return baserowApi.post(`${BASEROW_API_URL}${DOCUMENTS_TABLE_ID}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
