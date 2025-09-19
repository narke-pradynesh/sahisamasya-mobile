import connectDB from '../../_lib/db.js';
import { Upvote } from '../../_lib/models.js';
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
      const upvotes = await Upvote.find({ complaint_id: complaintId })
        .sort({ created_at: -1 });

      res.json({
        success: true,
        data: upvotes
      });
    } catch (error) {
      console.error('Get complaint upvotes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upvotes'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
