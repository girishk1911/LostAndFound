import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { claimItem } from '../services/itemService';

const ClaimForm = ({ itemId, onClaimSubmitted }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    studentYear: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
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
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all required fields
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Name is required';
    }
    
    // Validate student ID / roll number
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Roll number is required';
    } else if (!/^\d{5}$/.test(formData.studentId)) {
      newErrors.studentId = 'Roll number must be exactly 5 digits';
    }
    
    // Validate student year
    if (!formData.studentYear) {
      newErrors.studentYear = 'Study year is required';
    }
    
    // Validate contact number
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be exactly 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      // Show error toast for the first error
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Build claim data object with exact field names matching what server expects
      const claimData = {
        studentName: formData.studentName,
        studentId: formData.studentId,     // This gets mapped to rollNumber in the backend
        studentYear: formData.studentYear, // This gets mapped to studyYear in the backend
        contactNumber: formData.contactNumber,
        claimedDate: new Date().toISOString()
      };
      
      console.log('Submitting claim data:', claimData);
      
      // Use the API to claim the item
      try {
        const response = await claimItem(itemId, claimData);
        console.log('Claim response:', response);
        
        // Reset form
        setFormData({
          studentName: '',
          studentId: '',
          studentYear: '',
          contactNumber: ''
        });
        
        // Notify parent component
        if (onClaimSubmitted) {
          onClaimSubmitted();
        }
      } catch (error) {
        console.error('Error submitting claim:', error);
        toast.error(error.message || 'Failed to submit claim. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Claim This Item</h2>
      <p className="mb-4 text-gray-600">
        Please fill out this form to claim the item. You will need to verify your identity with the security guard.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentName">
            Full Name *
          </label>
          <input
            className={`shadow appearance-none border ${errors.studentName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="studentName"
            name="studentName"
            type="text"
            placeholder="Your full name"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
          {errors.studentName && (
            <p className="text-red-500 text-xs italic mt-1">{errors.studentName}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
            Student ID / Roll Number * (5 digits)
          </label>
          <input
            className={`shadow appearance-none border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="studentId"
            name="studentId"
            type="text"
            placeholder="5-digit roll number"
            value={formData.studentId}
            onChange={handleChange}
            maxLength={5}
            required
          />
          {errors.studentId && (
            <p className="text-red-500 text-xs italic mt-1">{errors.studentId}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentYear">
            Study Year *
          </label>
          <select
            className={`shadow appearance-none border ${errors.studentYear ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="studentYear"
            name="studentYear"
            value={formData.studentYear}
            onChange={handleChange}
            required
          >
            <option value="">Select your year</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
          </select>
          {errors.studentYear && (
            <p className="text-red-500 text-xs italic mt-1">{errors.studentYear}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
            Contact Number * (10 digits)
          </label>
          <input
            className={`shadow appearance-none border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="contactNumber"
            name="contactNumber"
            type="tel"
            placeholder="10-digit mobile number"
            value={formData.contactNumber}
            onChange={handleChange}
            maxLength={10}
            required
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-xs italic mt-1">{errors.contactNumber}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;