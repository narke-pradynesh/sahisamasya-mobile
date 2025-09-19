// Core integrations with improved file upload functionality

export const UploadFile = async ({ file }) => {
  try {
    console.log("Uploading file:", file.name, "Size:", file.size);
    
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB");
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error("Only image files are allowed");
    }
    
    // For demo purposes, we'll create a data URL from the file
    // In a real implementation, you would upload to a cloud storage service
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Simulate upload delay
        setTimeout(() => {
          resolve({
            file_url: e.target.result,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type
          });
        }, 1000);
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      reader.readAsDataURL(file);
    });
    
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

export const InvokeLLM = async ({ prompt, file_urls, response_json_schema }) => {
  // Mock LLM invocation - replace with actual AI service
  console.log("Invoking LLM with prompt:", prompt);
  console.log("File URLs:", file_urls);
  console.log("Response schema:", response_json_schema);
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock response based on the schema
  if (response_json_schema?.properties?.category) {
    return {
      category: "road_maintenance",
      title: "Road Maintenance Issue"
    };
  }
  
  return {
    category: "other",
    title: "Civic Issue Report"
  };
};
