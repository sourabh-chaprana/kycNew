import User from '../Modals/Auth.Modal.js';
import PNR from '../Modals/Passenger.Modals.js';

// @desc    Get all agents with stats
// @route   GET /api/agents
// @access  Private (Admin only)
export const getAllAgents = async (req, res) => {
  try {
    // Fetch all users with role 'agent'
    const agents = await User.find({ role: 'agent' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get stats for each agent
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const allPNRs = await PNR.find({ createdBy: agent._id });
        
        const stats = {
          total: allPNRs.length,
          pending: allPNRs.filter(p => p.status === 'pending').length,
          approved: allPNRs.filter(p => p.status === 'approved').length,
          declined: allPNRs.filter(p => p.status === 'declined').length,
          partially: allPNRs.filter(p => p.status === 'partially').length,
        };

        return {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          avatar: agent.avatar,
          isActive: agent.isActive,
          createdAt: agent.createdAt,
          updatedAt: agent.updatedAt,
          stats
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        agents: agentsWithStats
      }
    });
  } catch (error) {
    console.error('Get all agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all passengers/PNRs for a specific agent
// @route   GET /api/agents/:agentId/passengers
// @access  Private (Admin only)
export const getAgentPassengers = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { status } = req.query;

    // Verify agent exists and is an agent
    const agent = await User.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is not an agent'
      });
    }

    // Build query
    const query = { createdBy: agentId };
    if (status && ['pending', 'approved', 'declined', 'partially'].includes(status)) {
      query.status = status;
    }

    // Fetch PNRs for this agent
    const pnrs = await PNR.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email avatar');

    // Calculate stats for this agent
    const allPNRs = await PNR.find({ createdBy: agentId });
    const stats = {
      pending: allPNRs.filter(p => p.status === 'pending').length,
      approved: allPNRs.filter(p => p.status === 'approved').length,
      declined: allPNRs.filter(p => p.status === 'declined').length,
      partially: allPNRs.filter(p => p.status === 'partially').length,
    };

    res.status(200).json({
      success: true,
      data: {
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          avatar: agent.avatar,
          isActive: agent.isActive
        },
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
    console.error('Get agent passengers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

