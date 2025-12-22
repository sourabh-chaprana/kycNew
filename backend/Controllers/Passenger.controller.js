import PNR from '../Modals/Passenger.Modals.js';
import { validationResult } from 'express-validator';

// @desc    Get all PNRs with optional filter
// @route   GET /api/passengers
// @access  Private
export const getPNRs = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { createdBy: req.user.userId };
    
    if (status && ['pending', 'approved', 'declined', 'partially'].includes(status)) {
      query.status = status;
    }

    const pnrs = await PNR.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    // Calculate stats
    const allPNRs = await PNR.find({ createdBy: req.user.userId });
    const stats = {
      pending: allPNRs.filter(p => p.status === 'pending').length,
      approved: allPNRs.filter(p => p.status === 'approved').length,
      declined: allPNRs.filter(p => p.status === 'declined').length,
      partially: allPNRs.filter(p => p.status === 'partially').length,
    };

    res.status(200).json({
      success: true,
      data: {
        pnrs: pnrs.map(pnr => ({
          id: pnr._id,
          pnr: pnr.pnr,
          tag: pnr.tag,
          passengers: pnr.passengers.length,
          status: pnr.status,
          date: pnr.createdAt,
          passengersData: pnr.passengers.map(p => ({
            id: p._id,
            name: p.name,
            documentId: p.documentId,
            status: p.status,
            image: p.image,
            rejectionReason: p.rejectionReason
          }))
        })),
        stats
      }
    });
  } catch (error) {
    console.error('Get PNRs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single PNR by ID
// @route   GET /api/passengers/:id
// @access  Private
export const getPNRById = async (req, res) => {
  try {
    const pnr = await PNR.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    }).populate('createdBy', 'name email');

    if (!pnr) {
      return res.status(404).json({
        success: false,
        message: 'PNR not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        pnr: {
          id: pnr._id,
          pnr: pnr.pnr,
          tag: pnr.tag,
          passengers: pnr.passengers.length,
          status: pnr.status,
          date: pnr.createdAt,
          passengersData: pnr.passengers.map(p => ({
            id: p._id,
            name: p.name,
            documentId: p.documentId,
            status: p.status,
            image: p.image,
            rejectionReason: p.rejectionReason
          }))
        }
      }
    });
  } catch (error) {
    console.error('Get PNR error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new PNR
// @route   POST /api/passengers
// @access  Private
export const createPNR = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { pnr, tag, passengers } = req.body;

    // Check if PNR already exists
    const existingPNR = await PNR.findOne({ pnr });
    if (existingPNR) {
      return res.status(400).json({
        success: false,
        message: 'PNR already exists'
      });
    }

    const newPNR = await PNR.create({
      pnr,
      tag,
      passengers,
      createdBy: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'PNR created successfully',
      data: {
        pnr: {
          id: newPNR._id,
          pnr: newPNR.pnr,
          tag: newPNR.tag,
          passengers: newPNR.passengers.length,
          status: newPNR.status,
          date: newPNR.createdAt,
          passengersData: newPNR.passengers.map(p => ({
            id: p._id,
            name: p.name,
            documentId: p.documentId,
            status: p.status,
            image: p.image,
            rejectionReason: p.rejectionReason
          }))
        }
      }
    });
  } catch (error) {
    console.error('Create PNR error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update passenger status
// @route   PUT /api/passengers/:pnrId/passengers/:passengerId
// @access  Private
export const updatePassengerStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { pnrId, passengerId } = req.params;
    const { status, rejectionReason } = req.body;

    // Build query - admin can update any PNR, agents can only update their own
    const query = { _id: pnrId };
    if (req.user.role !== 'admin') {
      query.createdBy = req.user.userId;
    }

    const pnr = await PNR.findOne(query);

    if (!pnr) {
      return res.status(404).json({
        success: false,
        message: 'PNR not found'
      });
    }

    const passenger = pnr.passengers.id(passengerId);
    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: 'Passenger not found'
      });
    }

    passenger.status = status;
    if (status === 'declined' && rejectionReason) {
      passenger.rejectionReason = rejectionReason;
    } else if (status !== 'declined') {
      passenger.rejectionReason = null;
    }

    await pnr.save();

    res.status(200).json({
      success: true,
      message: 'Passenger status updated successfully',
      data: {
        pnr: {
          id: pnr._id,
          pnr: pnr.pnr,
          tag: pnr.tag,
          passengers: pnr.passengers.length,
          status: pnr.status,
          date: pnr.createdAt,
          passengersData: pnr.passengers.map(p => ({
            id: p._id,
            name: p.name,
            documentId: p.documentId,
            status: p.status,
            image: p.image,
            rejectionReason: p.rejectionReason
          }))
        }
      }
    });
  } catch (error) {
    console.error('Update passenger status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update multiple passengers status (Approve All)
// @route   PUT /api/passengers/:pnrId/passengers/approve-all
// @access  Private
export const approveAllPending = async (req, res) => {
  try {
    const { pnrId } = req.params;

    // Build query - admin can update any PNR, agents can only update their own
    const query = { _id: pnrId };
    if (req.user.role !== 'admin') {
      query.createdBy = req.user.userId;
    }

    const pnr = await PNR.findOne(query);

    if (!pnr) {
      return res.status(404).json({
        success: false,
        message: 'PNR not found'
      });
    }

    pnr.passengers.forEach(passenger => {
      if (passenger.status === 'pending') {
        passenger.status = 'approved';
        passenger.rejectionReason = null;
      }
    });

    await pnr.save();

    res.status(200).json({
      success: true,
      message: 'All pending passengers approved successfully',
      data: {
        pnr: {
          id: pnr._id,
          pnr: pnr.pnr,
          tag: pnr.tag,
          passengers: pnr.passengers.length,
          status: pnr.status,
          date: pnr.createdAt,
          passengersData: pnr.passengers.map(p => ({
            id: p._id,
            name: p.name,
            documentId: p.documentId,
            status: p.status,
            image: p.image,
            rejectionReason: p.rejectionReason
          }))
        }
      }
    });
  } catch (error) {
    console.error('Approve all error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete PNR
// @route   DELETE /api/passengers/:id
// @access  Private
export const deletePNR = async (req, res) => {
  try {
    const pnr = await PNR.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!pnr) {
      return res.status(404).json({
        success: false,
        message: 'PNR not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'PNR deleted successfully'
    });
  } catch (error) {
    console.error('Delete PNR error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

