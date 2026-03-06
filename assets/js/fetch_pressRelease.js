// Backend API URL
const API_BASE_URL = 'https://steerhub.batstateu.edu.ph/kistpark-backend/api/v1/press-release-web';

// Global variable to store all press releases
let allPressReleases = [];

// Format date from ISO string to "DD-MMM-YYYY" format
function formatDate(dateString) {
  // Return empty string if dateString is undefined or null
  if (!dateString) return '';
  
  // Parse the date string (assuming ISO format from API)
  const date = new Date(dateString);
  
  // Get day as a number and add leading zero if needed
  const day = date.getDate().toString().padStart(2, '0');
  
  // Get month name (abbreviated)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  
  // Get full year
  const year = date.getFullYear();
  
  // Return formatted date: "DD-MMM-YYYY"
  return `${day}-${month}-${year}`;
}

// Sort press releases by sequence number (highest first = newest)
function sortPressBySequence(pressReleases) {
  // Create a copy of the array to avoid modifying the original
  return [...pressReleases].sort((a, b) => {
    // If seq exists for both items, compare them (highest first)
    if (a.seq !== undefined && b.seq !== undefined) {
      return b.seq - a.seq; // Descending order (highest seq first)
    }
    
    // If only one has seq, prioritize the one with seq
    if (a.seq !== undefined) return -1;
    if (b.seq !== undefined) return 1;
    
    // If neither has seq, sort by date (newest first)
    return new Date(b.date) - new Date(a.date);
  });
}

// Function to render press releases dynamically
function renderPressReleases(pressReleases) {
  const container = document.querySelector('.row');
  if (!container) {
    console.error('Row container not found');
    return;
  }
  
  container.innerHTML = '';

  if (pressReleases.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert" style="text-align: center;">
          No press releases available. Please try again later.
        </div>
      </div>
    `;
    return;
  }

  pressReleases.forEach((pressRelease) => {
    const card = document.createElement('div');
    card.className = 'col';
    card.style.marginBottom = '20px';
    card.setAttribute('data-aos', 'fade-up');

    // Use the first image from the array or a placeholder
    const imageUrl = pressRelease.image && pressRelease.image.length > 0 
      ? pressRelease.image[0] 
      : '/assets/img/placeholder.jpg';

    card.innerHTML = `
      <a href="${pressRelease.link}" target="_blank" style="text-decoration: none;">
        <div class="card" style="border: none; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); height: 100%;">
          <img src="${imageUrl}" class="card-img-top" alt="${pressRelease.title}" style="height: 200px; object-fit: cover;">
          <div class="card-body" style="background-color: #005099; padding: 15px;">
            <p class="card-text" style="color: white; font-weight: bold; height: auto; min-height: 80px; max-height: 120px; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">${pressRelease.title}</p>
          </div>
          <div class="card-footer" style="background-color: #E8E8E8; height: auto; text-align: right; padding: 10px;">
            <p style="color: #FF6F2B; font-size: 14px; margin: 0;">By ${pressRelease.publisher} <br> ${formatDate(pressRelease.date)}</p>
          </div>
        </div>
      </a>
    `;

    container.appendChild(card);
  });
}

// Function to display default press releases when API call fails
function showDefaultPressReleases() {
  console.log('Showing default press releases');
  const pressContainer = document.querySelector('.row');
  
  if (!pressContainer) {
    console.error('Press release container not found');
    return;
  }
  
  // Check if default press releases are already in the HTML
  if (pressContainer.children.length > 0) {
    console.log('Default press releases already in DOM');
    // Make sure it's visible
    pressContainer.style.display = 'flex';
  } else {
    // Add a message indicating we're showing default content
    pressContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning" role="alert" style="text-align: center;">
          Could not load press releases. Showing default content.
        </div>
      </div>
    `;
  }
}

// Main function to fetch press releases with better error handling
async function fetchAllPressReleases() {
  try {
    console.log('Fetching press releases from:', API_BASE_URL);
    
    // Add a timeout to the fetch to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(API_BASE_URL, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    // Check HTTP status
    if (!response.ok) {
      console.error('Server returned error:', response.status, response.statusText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Try to parse response as JSON
    const pressReleases = await response.json();
    console.log('Received press releases:', pressReleases);
    
    // Verify pressReleases is an array
    if (!Array.isArray(pressReleases)) {
      console.error('Expected array but got:', typeof pressReleases);
      throw new Error('Invalid response format: Not an array');
    }
    
    // Filter only published press releases (if they have a status field)
    const publishedPressReleases = pressReleases.filter(pressRelease => 
      pressRelease && (!pressRelease.status || pressRelease.status === 'published')
    );
    
    console.log('Published press releases:', publishedPressReleases.length);
    
    // Store press releases globally
    allPressReleases = publishedPressReleases;
    
    // Sort press releases by sequence (highest first = newest)
    const sortedPressReleases = sortPressBySequence(publishedPressReleases);
    
    // Render press releases
    renderPressReleases(sortedPressReleases);
    
    return true;
  } catch (error) {
    console.error('Error fetching press releases:', error.message);
    
    // Show default press releases
    showDefaultPressReleases();
    
    return false;
  }
}

// Initialize on page load - use a single event listener
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, initializing press releases');
  
  // Call fetchAllPressReleases with a retry mechanism
  fetchAllPressReleases().then(success => {
    if (!success) {
      console.log('Initial fetch failed, retrying once...');
      // Retry after a short delay
      setTimeout(() => {
        fetchAllPressReleases().catch(err => {
          console.error('Retry also failed:', err);
        });
      }, 3000);
    }
  });
});