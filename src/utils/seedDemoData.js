// Utility to seed demo data for faster loading
export const seedDemoData = () => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available, skipping demo data seeding');
      return;
    }

    // Check if demo data already exists
    const existingComplaints = localStorage.getItem('SahiSamasya_complaints');
    if (existingComplaints) {
      console.log('Demo data already exists, skipping seeding');
      return;
    }

    // Demo Complaints
    const demoComplaints = [
      {
        _id: "1",
        title: "Pothole on Main Street",
        description: "Large pothole causing damage to vehicles near the intersection of Main and Oak.",
        photo_url: "https://via.placeholder.com/400x300?text=Pothole",
        latitude: 40.7128,
        longitude: -74.0060,
        address: "123 Main Street, New York, NY",
        category: "road_maintenance",
        status: "pending",
        upvote_count: 3,
        escalation_threshold: 5,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: "2",
        title: "Broken Streetlight",
        description: "Streetlight not working for 3 days, making the park entrance very dark at night.",
        photo_url: "https://via.placeholder.com/400x300?text=Streetlight",
        latitude: 40.7589,
        longitude: -73.9851,
        address: "456 Broadway, New York, NY",
        category: "streetlights",
        status: "escalated",
        upvote_count: 7,
        escalation_threshold: 5,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: "3",
        title: "Overflowing Public Bins",
        description: "Garbage bins at Central Park entrance are overflowing, attracting pests.",
        photo_url: "https://via.placeholder.com/400x300?text=Garbage",
        latitude: 40.785091,
        longitude: -73.968285,
        address: "Central Park South, New York, NY",
        category: "waste_management",
        status: "in_progress",
        upvote_count: 12,
        escalation_threshold: 5,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Demo Upvotes
    const demoUpvotes = [
      { _id: "up1", complaint_id: "1", user_email: "demo@example.com" },
      { _id: "up2", complaint_id: "1", user_email: "user@example.com" },
      { _id: "up3", complaint_id: "2", user_email: "demo@example.com" },
      { _id: "up4", complaint_id: "2", user_email: "user@example.com" },
      { _id: "up5", complaint_id: "3", user_email: "demo@example.com" }
    ];
    
    // Store in localStorage
    localStorage.setItem('SahiSamasya_complaints', JSON.stringify(demoComplaints));
    localStorage.setItem('SahiSamasya_upvotes', JSON.stringify(demoUpvotes));
    
    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};
