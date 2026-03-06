const API_BASE_URL = 'https://steerhub.batstateu.edu.ph/kistpark-backend/api/v1/highlights-web';

// Get the highlight ID and slug from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const highlightId = urlParams.get('id');
const highlightSlug = urlParams.get('slug');

// Function to create URL-friendly slug from title
function createSlug(title) {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Function to find highlight by slug or ID
async function findHighlightBySlugOrId() {
  try {
    // If we have an ID, try to fetch the specific highlight first
    if (highlightId) {
      try {
        const response = await fetch(`${API_BASE_URL}/${highlightId}`);
        if (response.ok) {
          const highlight = await response.json();
          // Verify the slug matches if provided
          if (!highlightSlug || createSlug(highlight.title) === highlightSlug) {
            return highlight;
          }
        }
      } catch (error) {
        console.log('Direct ID fetch failed, trying to search by slug');
      }
    }
    
    // If direct fetch failed or slug doesn't match, search through all highlights
    if (highlightSlug) {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch highlights list');
      }
      
      const highlights = await response.json();
      
      // Find highlight with matching slug
      const matchingHighlight = highlights.find(highlight => 
        highlight.status === 'published' && createSlug(highlight.title) === highlightSlug
      );
      
      if (matchingHighlight) {
        return matchingHighlight;
      }
    }
    
    // If we still haven't found it and have an ID, try one more direct fetch
    if (highlightId) {
      const response = await fetch(`${API_BASE_URL}/${highlightId}`);
      if (response.ok) {
        return await response.json();
      }
    }
    
    throw new Error('Highlight not found');
  } catch (error) {
    console.error('Error finding highlight:', error);
    throw error;
  }
}

// Fetch and render the specific highlight
async function fetchHighlightDetails() {
  try {
    const highlight = await findHighlightBySlugOrId();
    
    // Update the URL to use the correct slug if needed
    const correctSlug = createSlug(highlight.title);
    const currentUrl = new URL(window.location);
    
    if (correctSlug && currentUrl.searchParams.get('slug') !== correctSlug) {
      currentUrl.searchParams.set('slug', correctSlug);
      // Update URL without reloading the page
      window.history.replaceState({}, '', currentUrl);
    }
    
    renderHighlight(highlight); // Render the specific highlight
  } catch (error) {
    console.error('Error:', error);
    displayErrorMessage(); // Display an error message to the user
  }
}

function formatDate(dateString) {
  // Return empty string if dateString is undefined or null
  if (!dateString) return '';
  
  // Parse the date string
  const [year, month, day] = dateString.split('-');
  
  // Create a Date object (subtract 1 from month because months are 0-indexed in JavaScript)
  const date = new Date(year, parseInt(month) - 1, day);
  
  // Format the date using toLocaleDateString
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const sdgMapping = {
  'SDG-1 No Poverty': 'SDG-1.jpg',
  'SDG-2 Zero Hunger': 'SDG-2.jpg',
  'SDG-3 Good Health and Well-being': 'SDG-3.jpg',
  'SDG-4 Quality Education': 'SDG-4.jpg',
  'SDG-5 Gender Equality': 'SDG-5.jpg',
  'SDG-6 Clean Water and Sanitation': 'SDG-6.jpg',
  'SDG-7 Affordable and Clean Energy': 'SDG-7.jpg',
  'SDG-8 Decent Work and Economic Growth': 'SDG-8.jpg',
  'SDG-9 Industry Innovation and Infrastructure': 'SDG-9.jpg',
  'SDG-10 Reduced Inequalities': 'SDG-10.jpg',
  'SDG-11 Sustainable Cities and Communities': 'SDG-11.jpg',
  'SDG-12 Responsible Consumption and Production': 'SDG-12.jpg',
  'SDG-13 Climate Action': 'SDG-13.jpg',
  'SDG-14 Life Below Water': 'SDG-14.jpg',
  'SDG-15 Life on Land': 'SDG-15.jpg',
  'SDG-16 Peace Justice and Strong Institutions': 'SDG-16.jpg',
  'SDG-17 Partnerships for the Goals': 'SDG-17.jpg'
};

function processSDGs(sdgData) {
  // If no data, return empty string
  if (!sdgData) {
    return '';
  }
  
  let sdgStrings = [];
  
  // Handle array with single string containing multiple SDGs
  if (Array.isArray(sdgData) && sdgData.length === 1 && typeof sdgData[0] === 'string') {
    // Split by comma and trim whitespace
    sdgStrings = sdgData[0].split(',').map(sdg => sdg.trim());
  } else if (typeof sdgData === 'string') {
    sdgStrings = sdgData.split(',').map(sdg => sdg.trim());
  } else if (Array.isArray(sdgData)) {
    sdgStrings = sdgData;
  }
  
  // If no valid SDGs after processing, return empty
  if (sdgStrings.length === 0) {
    return '';
  }
  
  console.log("Processed SDGs:", sdgStrings);
  
  // Generate HTML for each SDG image
  const sdgImagesHTML = sdgStrings.map(sdg => {
    // Clean up the SDG string
    const cleanSdg = sdg.trim().replace(/,$/, ''); // Remove trailing comma if present
    
    // Find the matching SDG in sdgMapping
    const sdgKey = Object.keys(sdgMapping).find(key => cleanSdg.includes(key));
    
    if (sdgKey) {
      return `<img class="sdg-img" src="blogs/blogs-assets/SDG/${sdgMapping[sdgKey]}" alt="${sdgKey}" title="${sdgKey}">`;
    } else {
      // Fallback: extract just the SDG-X code and use that for the image filename
      const sdgCode = cleanSdg.match(/SDG-\d+/);
      if (sdgCode) {
        return `<img class="sdg-img" src="blogs/blogs-assets/SDG/${sdgCode[0]}.jpg" alt="${cleanSdg}" title="${cleanSdg}">`;
      }
      return '';
    }
  }).join('');
  
  return sdgImagesHTML;
}

// Function to render the specific highlight dynamically
function renderHighlight(highlight) {
  const container = document.querySelector('.blog-content');
  container.innerHTML = ''; // Clear existing content

  // Process images with null/undefined checking
  const mainImage = highlight.images && highlight.images.length > 0 ? highlight.images[0] : '';
  const subImage1 = highlight.images && highlight.images.length > 1 ? highlight.images[1] : '';
  const subImage2 = highlight.images && highlight.images.length > 2 ? highlight.images[2] : '';
  const subImage3 = highlight.images && highlight.images.length > 3 ? highlight.images[3] : '';
  
  // Log the sdg data for debugging
  console.log("SDG data type:", typeof highlight.sdg);
  console.log("SDG data value:", highlight.sdg);
  
  // Process SDGs
  const sdgImagesHTML = processSDGs(highlight.sdg);
  const sdgSection = sdgImagesHTML ? `
    <div class="blog-sdg">
      <img class="sdg-img" src="blogs/blogs-assets/SDG/SDG-Wheel.jpg" alt="SDG Wheel">
      ${sdgImagesHTML}
    </div>
  ` : '';

  container.innerHTML = `
    <div style="display: flex; align-items: center; max-width: 1200px; margin: 0 auto;">
      <div style="color: #ac2626; font-size: clamp(16px, 5vw, 24px); font-weight: bold; text-transform: uppercase;">BLOG</div>
      <div style="height: 2px; background-color: #ac2626; flex-grow: 1;"></div>
    </div>
    <div>
      <h3 class="blog-title">${highlight.title || 'No Title Available'}</h3>
    </div>

    <div class="blog-body">
      <div class="blog-img"> 
        ${mainImage ? `
          <a href="#imagePopup1">
            <img class="image-popup" src="${mainImage}" alt="">
          </a>
        ` : ''}
        <div class="blog-sub-img">
          ${subImage1 ? `
            <div>
              <a href="#imagePopup2">
                <img src="${subImage1}" alt="">
              </a>
            </div>
          ` : ''}
          ${subImage2 ? `
            <div>
              <a href="#imagePopup3">
                <img src="${subImage2}" alt="">
              </a>
            </div>
          ` : ''}
          ${subImage3 ? `
            <div>
              <a href="#imagePopup4">
                <img src="${subImage3}" alt="">
              </a>
            </div>
          ` : ''}
        </div>

        <div style="display: flex; flex-direction: column;">
          ${highlight.date ? `
            <span>
              <i class="bi bi-calendar-event-fill"></i> ${formatDate(highlight.date)}
            </span>
          ` : ''}
          ${highlight.location ? `
            <span>
              <i class="bi bi-geo-alt-fill"></i> ${highlight.location}
            </span>
          ` : ''}
        </div>

        ${sdgSection}
      </div>

      <!-- Popup Modals -->
      ${mainImage ? `
        <!-- Popup for Main Image -->
        <div id="imagePopup1" class="popup-modal">
          <a href="#" class="popup-background"></a>
          <div class="popup-content">
            <img class="popup-image" src="${mainImage}" alt="">
          </div>
        </div>
      ` : ''}

      ${subImage1 ? `
        <!-- Popup for Sub Image 1 -->
        <div id="imagePopup2" class="popup-modal">
          <a href="#" class="popup-background"></a>
          <div class="popup-content">
            <img class="popup-image" src="${subImage1}" alt="">
          </div>
        </div>
      ` : ''}

      ${subImage2 ? `
        <!-- Popup for Sub Image 2 -->
        <div id="imagePopup3" class="popup-modal">
          <a href="#" class="popup-background"></a>
          <div class="popup-content">
            <img class="popup-image" src="${subImage2}" alt="">
          </div>
        </div>
      ` : ''}

      ${subImage3 ? `
        <!-- Popup for Sub Image 3 -->
        <div id="imagePopup4" class="popup-modal">
          <a href="#" class="popup-background"></a>
          <div class="popup-content">
            <img class="popup-image" src="${subImage3}" alt="">
          </div>
        </div>
      ` : ''}

      <div class="blog-p">
        ${highlight.content || '<p>No Content Available</p>'}
      </div>
    </div>
  `;
}

// Function to display an error message
function displayErrorMessage() {
  const container = document.querySelector('.blog-content');
  container.innerHTML = `
    <p style="color: red; text-align: center;">Failed to load highlight details. Please try again later.</p>
  `;
}

// Call the fetchHighlightDetails function on page load
document.addEventListener('DOMContentLoaded', fetchHighlightDetails);