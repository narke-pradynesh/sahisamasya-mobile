// Demo data seeder for testing the application
export const seedDemoData = () => {
  // Check if demo data already exists
  const existingUsers = JSON.parse(localStorage.getItem('SahiSamasya_users') || '[]');
  if (existingUsers.length > 0) {
    console.log('Demo data already exists');
    return;
  }

  // Create demo users
  const demoUsers = [
    {
      id: "1",
      email: "admin@SahiSamasya.com",
      full_name: "Admin User",
      role: "admin",
      created_at: new Date().toISOString(),
      api_key: "152ccf803de8447b8aa536565ca84f77"
    },
    {
      id: "2",
      email: "citizen@SahiSamasya.com",
      full_name: "John Citizen",
      role: "citizen",
      created_at: new Date().toISOString(),
      api_key: "152ccf803de8447b8aa536565ca84f77"
    },
    {
      id: "3",
      email: "jane@example.com",
      full_name: "Jane Smith",
      role: "citizen",
      created_at: new Date().toISOString(),
      api_key: "152ccf803de8447b8aa536565ca84f77"
    }
  ];

  // Store demo users
  localStorage.setItem('SahiSamasya_users', JSON.stringify(demoUsers));

  // Create demo complaints
  const demoComplaints = [
    {
      id: "1",
      title: "Pothole on Main Street",
      description: "Large pothole causing damage to vehicles and creating traffic hazards",
      photo_url: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Pothole",
      latitude: 40.7128,
      longitude: -74.0060,
      address: "123 Main Street, New York, NY",
      category: "road_maintenance",
      status: "pending",
      upvote_count: 3,
      escalation_threshold: 5,
      created_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: "2",
      title: "Broken Streetlight",
      description: "Streetlight not working for 3 days, making the area unsafe at night",
      photo_url: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Streetlight",
      latitude: 40.7589,
      longitude: -73.9851,
      address: "456 Broadway, New York, NY",
      category: "streetlights",
      status: "escalated",
      upvote_count: 7,
      escalation_threshold: 5,
      created_date: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "3",
      title: "Overflowing Garbage Bin",
      description: "Garbage bin is overflowing and attracting pests",
      photo_url: "https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Garbage",
      latitude: 40.7505,
      longitude: -73.9934,
      address: "789 Park Avenue, New York, NY",
      category: "waste_management",
      status: "in_progress",
      upvote_count: 4,
      escalation_threshold: 5,
      created_date: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_date: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "4",
      title: "Water Leak on Sidewalk",
      description: "Water is leaking from underground pipe, creating slippery conditions",
      photo_url: "https://via.placeholder.com/400x300/96CEB4/FFFFFF?text=Water+Leak",
      latitude: 40.7614,
      longitude: -73.9776,
      address: "321 5th Avenue, New York, NY",
      category: "water_supply",
      status: "completed",
      upvote_count: 2,
      escalation_threshold: 5,
      created_date: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_date: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  // Store demo complaints
  localStorage.setItem('SahiSamasya_complaints', JSON.stringify(demoComplaints));

  // Create demo upvotes
  const demoUpvotes = [
    {
      id: "1",
      complaint_id: "1",
      user_email: "citizen@SahiSamasya.com"
    },
    {
      id: "2",
      complaint_id: "1",
      user_email: "jane@example.com"
    },
    {
      id: "3",
      complaint_id: "2",
      user_email: "citizen@SahiSamasya.com"
    },
    {
      id: "4",
      complaint_id: "2",
      user_email: "jane@example.com"
    },
    {
      id: "5",
      complaint_id: "3",
      user_email: "citizen@SahiSamasya.com"
    }
  ];

  // Store demo upvotes
  localStorage.setItem('SahiSamasya_upvotes', JSON.stringify(demoUpvotes));

  console.log('Demo data seeded successfully!');
  console.log('Demo users created:');
  demoUsers.forEach(user => {
    console.log(`- ${user.email} (${user.role})`);
  });
};

// Function to clear all demo data
export const clearDemoData = () => {
  localStorage.removeItem('SahiSamasya_users');
  localStorage.removeItem('SahiSamasya_complaints');
  localStorage.removeItem('SahiSamasya_upvotes');
  localStorage.removeItem('SahiSamasya_user');
  localStorage.removeItem('SahiSamasya_token');
  localStorage.removeItem('SahiSamasya_api_key');
  console.log('Demo data cleared');
};
