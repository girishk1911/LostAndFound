const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an item name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Electronics',
      'Clothing',
      'Study Material',
      'Accessories',
      'ID Cards',
      'Keys',
      'Other'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please select a location'],
    enum: [
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
    ]
  },
  foundDate: {
    type: Date,
    required: [true, 'Please add a found date'],
    get: function(date) {
      // Return the date as is (don't try to format it at this level)
      // Formatting should be done in the client
      return date;
    },
    set: function(date) {
      // If a string is provided, parse it as a Date
      if (typeof date === 'string') {
        // Check if it's in DD-MM-YYYY format
        if (date.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
          const [day, month, year] = date.split('-').map(Number);
          
          // Create a date at noon UTC to avoid timezone issues
          const parsedDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
          
          // Debug info
          console.log('Parsing date DD-MM-YYYY:', {
            input: date,
            parsed: parsedDate.toISOString(),
            components: {
              day, month, year,
              parsedDay: parsedDate.getUTCDate(),
              parsedMonth: parsedDate.getUTCMonth() + 1,
              parsedYear: parsedDate.getUTCFullYear()
            }
          });
          
          // Validate that the parsed date has the expected components
          if (parsedDate.getUTCDate() === day && 
              parsedDate.getUTCMonth() === month - 1 && 
              parsedDate.getUTCFullYear() === year) {
            return parsedDate;
          }
        } 
        // Check if it's in YYYY-MM-DD format
        else if (date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
          const [year, month, day] = date.split('-').map(Number);
          
          // Create a date at noon UTC to avoid timezone issues
          const parsedDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
          
          // Debug info
          console.log('Parsing date YYYY-MM-DD:', {
            input: date,
            parsed: parsedDate.toISOString(),
            components: {
              year, month, day,
              parsedDay: parsedDate.getUTCDate(),
              parsedMonth: parsedDate.getUTCMonth() + 1,
              parsedYear: parsedDate.getUTCFullYear()
            }
          });
          
          // Validate that the parsed date has the expected components
          if (parsedDate.getUTCDate() === day && 
              parsedDate.getUTCMonth() === month - 1 && 
              parsedDate.getUTCFullYear() === year) {
            return parsedDate;
          }
        }
        
        // Otherwise, handle ISO or other formats, always setting to noon UTC
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          // Create a new date at noon UTC to avoid timezone issues
          const normalizedDate = new Date(Date.UTC(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate(),
            12, 0, 0
          ));
          
          console.log('Parsed other date format:', {
            input: date,
            parsed: normalizedDate.toISOString()
          });
          
          return normalizedDate;
        }
        
        // Log error if we can't parse the date
        console.error('Failed to parse date:', date);
        return date;
      }
      
      // If it's already a Date, normalize it to noon UTC
      if (date instanceof Date) {
        // Create a new date at noon UTC to avoid timezone issues
        const normalizedDate = new Date(Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          12, 0, 0
        ));
        
        console.log('Normalized Date object:', {
          input: date.toISOString(),
          normalized: normalizedDate.toISOString()
        });
        
        return normalizedDate;
      }
      
      // Other cases, return as is
      return date;
    }
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'delivered'],
    default: 'available'
  },
  image: {
    type: String,
    required: [true, 'Please upload an image']
  },
  claimedBy: {
    studentName: String,
    rollNumber: String,
    studyYear: String,
    contactNumber: String,
    claimedDate: {
      type: Date,
      default: null
    }
  },
  addedBy: {
    type: String,
    default: 'pict_guard' // Default to the guard username since we're using a simple auth system
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { getters: true }, // Enable getters when converting to JSON
  toObject: { getters: true } // Enable getters when converting to object
});

// Prevent duplicate items (modified to be less strict)
ItemSchema.index({ name: 1, foundDate: 1 }, { unique: false });

// Static method to get items by status
ItemSchema.statics.getItemsByStatus = async function(status) {
  return await this.find({ status });
};

// Static method to search items
ItemSchema.statics.searchItems = async function(searchTerm) {
  return await this.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { location: { $regex: searchTerm, $options: 'i' } }
    ]
  });
};

module.exports = mongoose.model('Item', ItemSchema);