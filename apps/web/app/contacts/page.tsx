'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '../../components/context/UserContext';
import { Modal } from '@shared/components/ui/Modal';
import { ContactForm } from '../../components/forms/ContactForm';
import { ContactItem, Contact } from '../../components/contacts/ContactItem';
import { MainLayout } from '../../components/layout/MainLayout';

export default function ContactsPage() {
  const { user, loading } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchContacts();
  }, [user]);

  const fetchContacts = (search = '') => {
    const isSearch = search.trim().length > 0;
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setContactLoading(true);
    }

    const url = search.trim()
      ? `/api/contact?search=${encodeURIComponent(search.trim())}`
      : '/api/contact';

    fetch(url, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch contacts');
        }
        return res.json();
      })
      .then((data) => {
        setContacts(data || []);
        setContactError('');
      })
      .catch((err) => {
        setContactError(err.message || 'Failed to fetch contacts');
      })
      .finally(() => {
        if (isSearch) {
          setSearchLoading(false);
        } else {
          setContactLoading(false);
        }
      });
  };

  const handleContactClick = (contact: Contact) => {
    setEditContact(contact);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchContacts();
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!contactId || !confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contact?id=${contactId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete contact');
      }

      // Refresh contacts list
      fetchContacts();
      setEditContact(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete contact');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-[#581C87] mb-2">Contacts</h1>
              <p className="text-gray-600">
                Manage your professional network and job search contacts
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Search Box */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or company..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <div className="flex">
                    <button
                      type="submit"
                      disabled={searchLoading}
                      className="px-4 py-2 bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                    >
                      {searchLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      )}
                    </button>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="px-3 py-2 bg-gray-500 text-white rounded-r-lg hover:bg-gray-600"
                        title="Clear search"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </form>
              <button
                className="px-4 py-2 bg-primary text-accent rounded shadow hover:bg-secondary hover:text-accent border border-primary"
                onClick={() => setModalOpen(true)}
              >
                Add New Contact
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                {contacts.length === 0
                  ? `No contacts found for "${searchQuery}"`
                  : `Found ${contacts.length} contact${
                      contacts.length === 1 ? '' : 's'
                    } for "${searchQuery}"`}
                {contacts.length > 0 && (
                  <button
                    onClick={handleClearSearch}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Show all contacts
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10B981]">{contacts.length}</div>
                <div className="text-sm text-gray-600">Total Contacts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3B82F6]">
                  {contacts.filter((c) => c.company).length}
                </div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8B5CF6]">
                  {contacts.filter((c) => c.url).length}
                </div>
                <div className="text-sm text-gray-600">With LinkedIn</div>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          {contactLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10B981]"></div>
            </div>
          ) : contactError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {contactError}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
              <p className="text-gray-600 mb-4">
                Start building your professional network by adding your first contact
              </p>
              <button
                className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"
                onClick={() => setModalOpen(true)}
              >
                Add Your First Contact
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <ContactItem
                  key={contact.id || contact.email}
                  contact={contact}
                  onClick={handleContactClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Contact Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Contact">
          <ContactForm
            onSuccess={() => {
              setModalOpen(false);
              fetchContacts();
            }}
          />
        </Modal>

        {/* Edit Contact Modal */}
        <Modal isOpen={!!editContact} onClose={() => setEditContact(null)} title="Edit Contact">
          {editContact && (
            <ContactForm
              initial={editContact}
              onSuccess={() => {
                setEditContact(null);
                fetchContacts();
              }}
              onCancel={() => setEditContact(null)}
              onDelete={() => editContact.id && handleDeleteContact(editContact.id)}
              showDeleteButton={true}
            />
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
