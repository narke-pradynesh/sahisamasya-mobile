import connectDB from '../../_lib/db.js';
import { Upvote } from '../../_lib/models.js';
import { authenticateToken } from '../../_lib/auth.js';
import { corsHandler, securityHeaders } from '../../_lib/cors.js';

export default async function handler(req, res) {
  // Handle CORS
  if (corsHandler(req, res)) return;
  
  // Add security headers
  securityHeaders(res);

  // Connect to database
  await connectDB();

  const { complaintId } = req.query;

  if (req.method === 'GET') {
    try {
      const authResult = await authenticateToken(req);
      
      if (authResult.error) {
        return res.status(authResult.status).json({
          success: false,
          message: authResult.error
        });
      }

      const upvote = await Upvote.findOne({
        complaint_id: complaintId,
        user_email: authResult.user.email
      });

      res.json({
        success: true,
        hasUpvoted: !!upvote,
        upvoteId: upvote?._id
      });
    } catch (error) {
      console.error('Check upvote error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check upvote status'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
