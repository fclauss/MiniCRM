import ContactForm from "../components/ContactForm";

export default function AddContact() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-lg leading-6 font-medium text-gray-900">Add New Contact</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Fill out the form below to add a new prospect or client.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ContactForm />
      </div>
    </div>
  );
}
