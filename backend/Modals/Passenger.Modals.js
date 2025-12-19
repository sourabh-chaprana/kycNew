import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide passenger name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  documentId: {
    type: String,
    required: [true, 'Please provide document ID'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  image: {
    type: String,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const pnrSchema = new mongoose.Schema({
  pnr: {
    type: String,
    required: [true, 'Please provide PNR'],
    unique: true,
    trim: true,
    uppercase: true
  },
  tag: {
    type: String,
    required: [true, 'Please provide tag'],
    trim: true,
    uppercase: true
  },
  passengers: [passengerSchema],
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'partially'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate PNR status based on passenger statuses
pnrSchema.methods.calculateStatus = function() {
  if (!this.passengers || this.passengers.length === 0) {
    return 'pending';
  }

  const allPending = this.passengers.every(p => p.status === 'pending');
  const allApproved = this.passengers.every(p => p.status === 'approved');
  const allDeclined = this.passengers.every(p => p.status === 'declined');
  
  if (allPending) {
    return 'pending';
  }
  
  if (allApproved) {
    return 'approved';
  }
  
  if (allDeclined) {
    return 'declined';
  }
  
  // Mixed statuses (some approved, some declined, or mix with pending)
  return 'partially';
};

// Update PNR status before saving
pnrSchema.pre('save', function(next) {
  this.status = this.calculateStatus();
  next();
});

const PNR = mongoose.model('PNR', pnrSchema);

export default PNR;

