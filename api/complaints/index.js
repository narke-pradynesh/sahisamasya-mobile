import connectDB from '../_lib/db.js';
import { Complaint } from '../_lib/models.js';
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
      const { status, category, limit = 50, page = 1 } = req.query;
      
      // Build filter object
      const filter = {};
      if (status) filter.status = status;
      if (category) filter.category = category;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get complaints with pagination
      const complaints = await Complaint.find(filter)
        .populate('created_by', 'full_name email')
        .sort({ created_at: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      // Get total count for pagination
      const total = await Complaint.countDocuments(filter);

      res.json({
        success: true,
        data: complaints,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get complaints error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch complaints'
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

      console.log('Create complaint request body:', req.body);
      
      // Clean up location data - ensure we don't pass undefined/null as strings
      const complaintData = {
        ...req.body,
        latitude: req.body.latitude || null,
        longitude: req.body.longitude || null,
        address: req.body.address || '',
        created_by: authResult.user._id
      };
      
      console.log('Complaint data to save:', complaintData);

      const complaint = new Complaint(complaintData);
      await complaint.save();

      // Populate the created_by field
      await complaint.populate('created_by', 'full_name email');

      res.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: complaint
      });
    } catch (error) {
      console.error('Create complaint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create complaint'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
