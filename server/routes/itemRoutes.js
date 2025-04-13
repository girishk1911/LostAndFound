const express = require('express');
const router = express.Router();
const {
  getItems,
  getRecentItems,
  searchItems,
  getItem,
  createItem,
  updateItem,
  updateClaimedItem,
  markAsDelivered,
  deleteItem,
  getItemStatistics
} = require('../controllers/itemController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/uploadMiddleware');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Request:`, 
    req.file ? { ...req.body, file: req.file.filename } : req.body);
  next();
});

// Public routes
router.get('/', getItems);
router.get('/recent', getRecentItems);
router.get('/search', searchItems);
router.get('/statistics/data', getItemStatistics);
router.get('/:id', getItem);

// Middleware to handle foundDate before upload
const parseDatesMiddleware = (req, res, next) => {
  console.log('Request body before date parsing:', req.body);
  
  // Parse date if present in URL-encoded form data
  if (req.body.foundDate) {
    try {
      // Store the original foundDate value
      console.log('Original foundDate from client:', req.body.foundDate);
      next();
    } catch (err) {
      console.error('Error parsing date:', err);
      next();
    }
  } else {
    next();
  }
};

// For development/testing - allow adding items without auth
// In production, this should use auth middleware
router.post('/', parseDatesMiddleware, upload.single('image'), createItem);

// Handle claims - public route for students to claim items
router.put('/:id/claim', async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Log the request body to see what's coming in
    console.log('Claim request body:', JSON.stringify(req.body, null, 2));
    
    // Get the item from the database
    const Item = require('../models/Item');
    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    // Only allow claiming available items
    if (item.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'This item is not available for claiming'
      });
    }
    
    // Validate required fields
    if (!req.body.studentName || !req.body.studentId || !req.body.studentYear || !req.body.contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: studentName, studentId, studentYear, contactNumber'
      });
    }
    
    // Validate roll number (must be exactly 5 digits)
    if (!/^\d{5}$/.test(req.body.studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Roll number must be exactly 5 digits'
      });
    }
    
    // Validate contact number (must be exactly 10 digits)
    if (!/^\d{10}$/.test(req.body.contactNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Contact number must be exactly 10 digits'
      });
    }
    
    // Prepare the claimedBy data, ensuring all keys are correctly mapped
    const claimedBy = {
      studentName: req.body.studentName,
      rollNumber: req.body.studentId,  // Map studentId to rollNumber as per model
      studyYear: req.body.studentYear,
      contactNumber: req.body.contactNumber,
      claimedDate: new Date() // Always use current date for claim
    };
    
    // Log the prepared claimedBy data
    console.log('Prepared claimedBy data:', JSON.stringify(claimedBy, null, 2));
    console.log('Claim date set to:', claimedBy.claimedDate);
    
    // Update the item directly using findByIdAndUpdate to ensure atomic update
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { 
        status: 'claimed',
        claimedBy: claimedBy
      },
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!updatedItem) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update item'
      });
    }
    
    // Log the updated item to verify
    console.log('Updated item:', JSON.stringify(updatedItem, null, 2));
    
    res.status(200).json({
      success: true,
      message: 'Item claimed successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error claiming item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while claiming item',
      error: error.message
    });
  }
});

// Protected routes (guard only) - these would require proper auth in production
// router.use(protect, authorize('guard'));
// router.post('/', upload.single('image'), createItem);
router.put('/:id', upload.single('image'), updateItem);
router.put('/:id/delivered', markAsDelivered);

// Route to update a claimed item (both item details and student information)
router.put('/:id/update-claimed', upload.single('image'), updateClaimedItem);

// General status update route
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['available', 'claimed', 'delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const Item = require('../models/Item');
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating item status'
    });
  }
});

router.delete('/:id', deleteItem);

module.exports = router;