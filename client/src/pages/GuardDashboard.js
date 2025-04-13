import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { AuthContext } from '../context/AuthContext';
import { getAllItems, deleteItem } from '../services/itemService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import EditItemModal from '../components/EditItemModal';
import EditClaimedItemModal from '../components/EditClaimedItemModal';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';
import { formatDate } from '../utils/dateUtils';
import SearchBar from '../components/SearchBar';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const GuardDashboard = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClaimedModalOpen, setEditClaimedModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getAllItems(true);
        
        // Log a sample of the data to verify foundDate
        if (data && data.length > 0) {
          console.log('Sample item:', data[0]);
          console.log('Item foundDate:', data[0].foundDate);
          console.log('Formatted foundDate:', formatDate(data[0].foundDate));
        }
        
        setItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.category && item.category.toLowerCase().includes(searchLower)) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      (item.location && item.location.toLowerCase().includes(searchLower))
    );
  });

  // Handle opening edit modal
  const handleEditClick = (item) => {
    // Only allow editing available items
    if (item.status !== 'available') {
      setSuccessMessage('Only available items can be edited');
      setSuccessModalOpen(true);
      return;
    }
    
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  // Handle opening edit claimed item modal
  const handleEditClaimedClick = (item) => {
    if (item.status !== 'claimed') {
      setSuccessMessage('Only claimed items can be edited');
      setSuccessModalOpen(true);
      return;
    }
    
    setSelectedItem(item);
    setEditClaimedModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  // Handle successful item edit
  const handleEditSuccess = () => {
    // Update the items list with the edited item
    setItems(items.map(item => 
      item._id === selectedItem._id 
        ? { ...item, ...selectedItem } 
        : item
    ));
    setEditModalOpen(false);
    setSuccessMessage('Item updated successfully!');
    setSuccessModalOpen(true);
    
    // Refresh the items list
    fetchItems();
  };

  // Handle successful claimed item edit
  const handleEditClaimedSuccess = () => {
    setEditClaimedModalOpen(false);
    setSuccessMessage('Item and student information updated successfully!');
    setSuccessModalOpen(true);
    
    // Refresh the items list
    fetchItems();
  };

  // Handle item deletion
  const handleDeleteConfirm = async () => {
    try {
      await deleteItem(selectedItem._id);
      setItems(items.filter(item => item._id !== selectedItem._id));
      setSuccessMessage('Item deleted successfully!');
      setSuccessModalOpen(true);
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  // Fetch items helper function (reusable)
  const fetchItems = async () => {
    try {
      const data = await getAllItems(true);
      setItems(data);
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  // Get the proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/images/placeholder.png';
    
    // If it's a full URL already, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise, prepend the server URL
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Security Guard Dashboard</h1>
        <Link 
          to="/AddItem" 
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Item
        </Link>
      </div>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
              )
            }
          >
            All Items ({items.length})
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
              )
            }
          >
            Claimed ({items.filter(item => item.status === 'claimed').length})
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
              )
            }
          >
            Delivered ({items.filter(item => item.status === 'delivered').length})
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          <Tab.Panel>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Item Name</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Found Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/images/placeholder.png';
                            }}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4">{item.category}</td>
                        <td className="py-3 px-4">{formatDate(item.foundDate)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : item.status === 'claimed'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-3">
                            {item.status === 'available' ? (
                              <button 
                                onClick={() => handleEditClick(item)} 
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit item"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            ) : item.status === 'claimed' ? (
                              <button 
                                onClick={() => handleEditClaimedClick(item)} 
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit item and student information"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            ) : null}
                            
                            {item.status !== 'delivered' && (
                              <button 
                                onClick={() => handleDeleteClick(item)} 
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500">
                        No items found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Item Name</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Found Date</th>
                    <th className="py-3 px-4 text-left">Claimed By</th>
                    <th className="py-3 px-4 text-left">Claimed Date</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.filter(item => item.status === 'claimed').length > 0 ? (
                    filteredItems
                      .filter(item => item.status === 'claimed')
                      .map(item => (
                        <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/images/placeholder.png';
                              }}
                            />
                          </td>
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4">{formatDate(item.foundDate)}</td>
                          <td className="py-3 px-4">
                            {item.claimedBy?.studentName}<br/>
                            <span className="text-xs text-gray-500">
                              {item.claimedBy?.rollNumber}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {formatDate(item.claimedBy?.claimedDate)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-3">
                              <button 
                                onClick={() => handleEditClaimedClick(item)} 
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit item and student information"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(item)} 
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        No claimed items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Item Name</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Claimed By</th>
                    <th className="py-3 px-4 text-left">Claimed Date</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.filter(item => item.status === 'delivered').length > 0 ? (
                    filteredItems
                      .filter(item => item.status === 'delivered')
                      .map(item => (
                        <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/images/placeholder.png';
                              }}
                            />
                          </td>
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4">
                            {item.claimedBy?.studentName}<br/>
                            <span className="text-xs text-gray-500">
                              {item.claimedBy?.rollNumber} ({item.claimedBy?.studyYear})
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {formatDate(item.claimedBy?.claimedDate)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-3">
                              {/* No edit button for delivered items */}
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500">
                        No delivered items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      {/* Edit Item Modal */}
      {selectedItem && (
        <EditItemModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          item={selectedItem}
          onSuccess={handleEditSuccess}
        />
      )}
      
      {/* Edit Claimed Item Modal */}
      {selectedItem && (
        <EditClaimedItemModal
          isOpen={editClaimedModalOpen}
          onClose={() => setEditClaimedModalOpen(false)}
          item={selectedItem}
          onSuccess={handleEditClaimedSuccess}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {selectedItem && (
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Item"
          message={`Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />
      )}
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  );
};

export default GuardDashboard;
