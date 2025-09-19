import connectDB from '../_lib/db.js';
import { Complaint } from '../_lib/models.js';
import { authenticateToken, requireAdmin } from '../_lib/auth.js';
import { corsHandler, securityHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  // Handle CORS
  if (corsHandler(req, res)) return;
  
  // Add security headers
  securityHeaders(res);

  // Connect to database
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const complaint = await Complaint.findById(id)
        .populate('created_by', 'full_name email');

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }

      res.json({
        success: true,
        data: complaint
      });
    } catch (error) {
      console.error('Get complaint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch complaint'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const authResult = await authenticateToken(req);
      
      if (authResult.error) {
        return res.status(authResult.status).json({
          success: false,
          message: authResult.error
        });
      }

      const adminCheck = requireAdmin(authResult.user);
      if (adminCheck) {
        return res.status(adminCheck.status).json({
          success: false,
          message: adminCheck.error
        });
      }

      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }

      // Update complaint
      Object.assign(complaint, req.body);
      await complaint.save();

      // Populate the created_by field
      await complaint.populate('created_by', 'full_name email');

      res.json({
        success: true,
        message: 'Complaint updated successfully',
        data: complaint
      });
    } catch (error) {
      console.error('Update complaint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update complaint'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const authResult = await authenticateToken(req);
      
      if (authResult.error) {
        return res.status(authResult.status).json({
          success: false,
          message: authResult.error
        });
      }

      const adminCheck = requireAdmin(authResult.user);
      if (adminCheck) {
        return res.status(adminCheck.status).json({
          success: false,
          message: adminCheck.error
        });
      }

      const complaint = await Complaint.findByIdAndDelete(id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }

      res.json({
        success: true,
        message: 'Complaint deleted successfully'
      });
    } catch (error) {
      console.error('Delete complaint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete complaint'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
