import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { updateClaimedItem } from '../services/itemService';
import { toast } from 'react-toastify';

const EditClaimedItemModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    foundDate: ''
  });
  
  const [studentFormData, setStudentFormData] = useState({
    studentName: '',
    studentId: '',
    studentYear: '',
    contactNumber: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setItemFormData({
        name: item.name || '',
        category: item.category || '',
        description: item.description || '',
        location: item.location || '',
        foundDate: item.foundDate ? new Date(item.foundDate).toISOString().split('T')[0] : ''
      });
      
      // Set student information if available
      if (item.claimedBy) {
        setStudentFormData({
          studentName: item.claimedBy.studentName || '',
          studentId: item.claimedBy.rollNumber || '',
          studentYear: item.claimedBy.studyYear || '',
          contactNumber: item.claimedBy.contactNumber || ''
        });
      }
      
      // Set image preview if item has an image
      if (item.image) {
        const imageUrl = item.image.startsWith('http') 
          ? item.image 
          : `http://localhost:5000${item.image}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview('');
      }
    }
  }, [item]);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any previous error for this field
    setErrors({
      ...errors,
      [name]: ''
    });
    
    // For studentId (roll number) - allow only digits and limit to 5 characters
    if (name === 'studentId') {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        setErrors({
          ...errors,
          studentId: 'Roll number must contain only digits'
        });
        return;
      }
      // Limit to max 5 digits
      if (value.length > 5) {
        return;
      }
    }
    
    // For contactNumber - allow only digits and limit to 10 characters
    if (name === 'contactNumber') {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        setErrors({
          ...errors,
          contactNumber: 'Contact number must contain only digits'
        });
        return;
      }
      // Limit to max 10 digits
      if (value.length > 10) {
        return;
      }
    }
    
    setStudentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate item data
    if (!itemFormData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!itemFormData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!itemFormData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (!itemFormData.foundDate) {
      newErrors.foundDate = 'Found date is required';
    }
    
    // Validate student data
    if (!studentFormData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    
    if (!studentFormData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (studentFormData.studentId.length !== 5) {
      newErrors.studentId = 'Student ID must be 5 digits';
    }
    
    if (!studentFormData.studentYear) {
      newErrors.studentYear = 'Study year is required';
    }
    
    if (!studentFormData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (studentFormData.contactNumber.length !== 10) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show error toast for the first error
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Append all item fields
      Object.keys(itemFormData).forEach(key => {
        formData.append(key, itemFormData[key]);
      });
      
      // Append student information as claimedBy
      formData.append('claimedBy[studentName]', studentFormData.studentName);
      formData.append('claimedBy[studentId]', studentFormData.studentId);
      formData.append('claimedBy[studentYear]', studentFormData.studentYear);
      formData.append('claimedBy[contactNumber]', studentFormData.contactNumber);
      
      // Append image if selected
      if (image) {
        formData.append('image', image);
      }

      await updateClaimedItem(item._id, formData);
      toast.success('Item updated successfully');
      setLoading(false);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update item');
      toast.error(err.message || 'Failed to update item');
      setLoading(false);
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Study Material',
    'Accessories',
    'ID Cards',
    'Keys',
    'Wallet/Money',
    'Other'
  ];

  const locations = [
    'Entry gate',
    'F1 Building',
    'A1 Building',
    'A2 Building',
    'A3 Building',
    'Canteen Area',
    'Library',
    'Reading Hall',
    'Computer Lab',
    'Auditorium',
    'College GYM',
    'Table Tennis Room',
    'Parking Lot',
    'Boys Hostel',
    'Girls Hostel',
    'Play Ground',
    'Student Counter',
    'Green Lawn',
    'Main Building',
    'Sports Field',
    'Other'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Claimed Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Item Details</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={itemFormData.name}
                onChange={handleItemChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                value={itemFormData.category}
                onChange={handleItemChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs italic mt-1">{errors.category}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={itemFormData.description}
                onChange={handleItemChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location Found</label>
              <select
                id="location"
                name="location"
                value={itemFormData.location}
                onChange={handleItemChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && (
                <p className="text-red-500 text-xs italic mt-1">{errors.location}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="foundDate" className="block text-sm font-medium text-gray-700">Date Found</label>
              <input
                type="date"
                id="foundDate"
                name="foundDate"
                value={itemFormData.foundDate}
                onChange={handleItemChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.foundDate && (
                <p className="text-red-500 text-xs italic mt-1">{errors.foundDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Item Image (Optional)</label>
              <div className="mt-1 flex items-center space-x-4">
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Item preview" 
                      className="h-24 w-24 object-cover rounded border border-gray-300"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to keep the current image
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Student Information</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={studentFormData.studentName}
                onChange={handleStudentChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.studentName && (
                <p className="text-red-500 text-xs italic mt-1">{errors.studentName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID / Roll Number (5 digits)</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={studentFormData.studentId}
                onChange={handleStudentChange}
                required
                maxLength={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.studentId && (
                <p className="text-red-500 text-xs italic mt-1">{errors.studentId}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="studentYear" className="block text-sm font-medium text-gray-700">Study Year</label>
              <select
                id="studentYear"
                name="studentYear"
                value={studentFormData.studentYear}
                onChange={handleStudentChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select Study Year</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
              </select>
              {errors.studentYear && (
                <p className="text-red-500 text-xs italic mt-1">{errors.studentYear}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number (10 digits)</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={studentFormData.contactNumber}
                onChange={handleStudentChange}
                required
                maxLength={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-xs italic mt-1">{errors.contactNumber}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditClaimedItemModal; 