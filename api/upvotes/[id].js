import connectDB from '../_lib/db.js';
import { Upvote, Complaint } from '../_lib/models.js';
import { authenticateToken } from '../_lib/auth.js';
import { corsHandler, securityHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  // Handle CORS
  if (corsHandler(req, res)) return;
  
  // Add security headers
  securityHeaders(res);

  // Connect to database
  await connectDB();

  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const authResult = await authenticateToken(req);
      
      if (authResult.error) {
        return res.status(authResult.status).json({
          success: false,
          message: authResult.error
        });
      }

      const upvote = await Upvote.findById(id);

      if (!upvote) {
        return res.status(404).json({
          success: false,
          message: 'Upvote not found'
        });
      }

      // Check if user owns this upvote
      if (upvote.user_email !== authResult.user.email) {
        return res.status(403).json({
          success: false,
          message: 'You can only remove your own upvotes'
        });
      }

      // Get complaint to update upvote count
      const complaint = await Complaint.findById(upvote.complaint_id);
      if (complaint) {
        complaint.upvote_count = Math.max(0, complaint.upvote_count - 1);
        
        // If upvote count is below threshold and status is escalated, revert to pending
        if (complaint.upvote_count < complaint.escalation_threshold && complaint.status === 'escalated') {
          complaint.status = 'pending';
        }
        
        await complaint.save();
      }

      // Delete upvote
      await Upvote.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Upvote removed successfully'
      });
    } catch (error) {
      console.error('Delete upvote error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove upvote'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
