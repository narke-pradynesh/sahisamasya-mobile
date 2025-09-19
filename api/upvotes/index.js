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

  if (req.method === 'GET') {
    try {
      const upvotes = await Upvote.find()
        .populate('complaint_id', 'title status')
        .sort({ created_at: -1 });

      res.json({
        success: true,
        data: upvotes
      });
    } catch (error) {
      console.error('Get upvotes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upvotes'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const authResult = await authenticateToken(req);
      
      if (authResult.error) {
        return res.status(authResult.status).json({
          success: false,
          message: authResult.error
        });
      }

      console.log('Upvote request body:', req.body);
      console.log('Authenticated user:', authResult.user);
      
      const { complaint_id } = req.body;
      const user_email = authResult.user.email;

      // Check if complaint exists
      const complaint = await Complaint.findById(complaint_id);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }

      // Check if user already upvoted
      const existingUpvote = await Upvote.findOne({
        complaint_id,
        user_email
      });

      if (existingUpvote) {
        return res.status(400).json({
          success: false,
          message: 'You have already upvoted this complaint'
        });
      }

      // Create upvote
      const upvote = new Upvote({
        complaint_id,
        user_email
      });

      await upvote.save();

      // Update complaint upvote count
      complaint.upvote_count += 1;
      
      // Check if complaint should be escalated
      if (complaint.upvote_count >= complaint.escalation_threshold && complaint.status === 'pending') {
        complaint.status = 'escalated';
      }

      await complaint.save();

      res.status(201).json({
        success: true,
        message: 'Upvote added successfully',
        data: upvote
      });
    } catch (error) {
      console.error('Create upvote error:', error);
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'You have already upvoted this complaint'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to create upvote'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
