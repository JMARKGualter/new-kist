// Backend API URL
const API_BASE_URL = 'https://localhost:8083/api/v1/highlights-web';

// Global variable to store all highlights
let allHighlights = [];

// Function to sort highlights by sequence number (highest first = newest)
function sortHighlightsBySequence(highlights) {
  // Create a copy of the array to avoid modifying the original
  return [...highlights].sort((a, b) => {
    // If seq exists for both items, compare them (highest first)
    if (a.seq !== undefined && b.seq !== undefined) {
      return b.seq - a.seq; // Descending order (highest seq first)
    }
    
    // If only one has seq, prioritize the one with seq
    if (a.seq !== undefined) return -1;
    if (b.seq !== undefined) return 1;
    
    // If neither has seq, maintain original order
    return 0;
  });
}

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

function getCropValue(date, location) {
  if (!date && !location) return 300;
  else return 200;
}

function cropContent(content, date, location) {
  if (!content) return '';
  
  const maxLength = getCropValue(date, location);
  
  if (content.length <= maxLength) {
    return content;
  }
  
  // Find the last space before maxLength to avoid cutting words in half
  const lastSpace = content.lastIndexOf(' ', maxLength);
  const cropPoint = lastSpace > 0 ? lastSpace : maxLength;
  
  return content.substring(0, cropPoint) + ' ... ';
}

// Function to extract unique categories and create dropdown filter
function createCategoryDropdown(highlights) {
  // Extract categories from highlights
  const categories = new Set();
  
  // Add "All Categories" option
  categories.add('Category');
  
  // Extract unique categories from highlights
  highlights.forEach(highlight => {
    // Check if category exists and has the category property
    if (highlight.category && highlight.category.category && highlight.category.category.trim() !== '') {
      categories.add(highlight.category.category);
    }
  });
  
  // Get the filter container
  const filterContainer = document.querySelector('.filter');
  if (!filterContainer) {
    console.error('Filter container not found');
    return;
  }
  
  // Create dropdown filter UI
  const filterHTML = `
  <div class="container">
    <div class="category-filter" style="display: flex; justify-content: flex-end;" data-aos="fade-up">
      <div style="display: flex; align-items: center; flex-wrap: wrap;">
        <div class="custom-dropdown">
          <select id="categoryDropdown" class="custom-select">
            ${Array.from(categories).map(category => `
              <option value="${category}" ${category === 'Category' ? 'selected' : ''}>
                ${category}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    </div>
  </div>
  `;
  
  // Update the filter container
  filterContainer.innerHTML = filterHTML;
  
  // Add event listener to the dropdown
  const dropdown = document.getElementById('categoryDropdown');
  if (dropdown) {
    dropdown.addEventListener('change', function() {
      const selectedCategory = this.value;
      filterHighlightsByCategory(selectedCategory);
    });
  }
}

// Function to filter highlights by category
function filterHighlightsByCategory(category) {
  // If category is "Category", show all highlights
  if (category === 'Category') {
    const sortedHighlights = sortHighlightsBySequence(allHighlights);
    renderHighlights(sortedHighlights);
    return;
  }
  
  // Filter highlights by selected category
  const filteredHighlights = allHighlights.filter(highlight => 
    highlight.category && highlight.category.category === category
  );
  
  // Sort filtered highlights by sequence
  const sortedFilteredHighlights = sortHighlightsBySequence(filteredHighlights);
  
  // Render filtered highlights
  renderHighlights(sortedFilteredHighlights);
  
  // If no highlights found for the selected category
  if (filteredHighlights.length === 0) {
    const container = document.querySelector('.row');
    if (container) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info" role="alert" style="text-align: center;">
            No highlights found for category "${category}".
          </div>
        </div>
      `;
    }
  }
}

// Function to render highlights dynamically
function renderHighlights(highlights) {
  const container = document.querySelector('.row');
  if (!container) {
    console.error('Row container not found');
    return;
  }
  
  container.innerHTML = '';

  if (highlights.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert" style="text-align: center;">
          No highlights available. Please try again later.
        </div>
      </div>
    `;
    return;
  }

  highlights.forEach((highlight) => {
    const card = document.createElement('div');
    card.className = 'col';
    card.setAttribute('data-aos', 'fade-up');

    // Create slug from title, fallback to ID if no title
    const slug = createSlug(highlight.title) || highlight._id;

    card.innerHTML = `
      <a href="blogs.html?slug=${encodeURIComponent(slug)}&id=${highlight._id}" style="text-decoration: none;">
        <div class="card" style="border: none; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; height: 100%;">
          <div style="height: 200px; overflow: hidden;">
            <img src="${highlight.images?.[0] || '/assets/img/placeholder.jpg'}" class="card-img-top" alt="${highlight.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="card-body d-flex flex-column" style="background-color: #005099; padding: 10px; position: relative; min-height: 50px;">
            <div style="width: 100%; text-align: right; margin-bottom: 5px;">
              ${highlight.category ? 
                `<span class="badge rounded-0" style="background-color: #C60001;">${highlight.category.category}</span>` 
                : ''}
            </div>
            <p class="card-text" style="color: white; font-weight: bold; font-size: 16px; text-align: center; margin: 0; flex-grow: 1; display: flex; align-items: center; justify-content: center;">${highlight.title}</p>
          </div>
          <div class="card-footer d-flex flex-column" style="background-color: #E8E8E8; padding: 15px; flex-grow: 1; position: relative;">
            <div class="meta-info" style="margin-bottom: 10px;">
              ${highlight.date ?
                `<p style="margin-bottom: 0px;"><i class="bi bi-calendar-week text-danger"></i> ${formatDate(highlight.date)}</p>`
                : ''}
              ${highlight.location ?
                `<p style="margin-bottom: 0;"><i class="bi bi-geo-alt-fill text-danger"></i> ${highlight.location || ''}</p> `
              : ''}
            </div>
            
            <div class="content-container" style="flex-grow: 1; text-align: justify; text-justify: inter-word;">
              <div class="content" style="margin-bottom: 10px; font-size: 12px; ">
              ${cropContent(highlight.content, highlight.date, highlight.location)}
              </div>
            </div>
            
            <p style="color: #C60001; bottom: 15px; left: 15px; margin: 0; font-weight: 700;">Read More <i class="bi bi-arrow-right"></i></p>
          </div>
        </div>
      </a>
    `;

    container.appendChild(card);
  });
}

// Function to display default blogs when API call fails
function showDefaultBlogs() {
  console.log('Showing default blogs');
  const blogContainer = document.querySelector('.row');
  
  if (!blogContainer) {
    console.error('Blog container not found');
    return;
  }
  
  // Check if default blogs are already in the HTML
  if (blogContainer.children.length > 0) {
    console.log('Default blogs already in DOM');
    // Make sure it's visible
    blogContainer.style.display = 'flex';
  } else {
    // Add a message indicating we're showing default content
    blogContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning" role="alert" style="text-align: center;">
          Could not load highlights. Showing default content.
        </div>
      </div>
    `;
  }
}

// Main function to fetch highlights with better error handling
async function fetchAllHighlights() {
  try {
    console.log('Fetching highlights from:', API_BASE_URL);
    
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
    const highlights = await response.json();
    console.log('Received highlights:', highlights);
    
    // Verify highlights is an array
    if (!Array.isArray(highlights)) {
      console.error('Expected array but got:', typeof highlights);
      throw new Error('Invalid response format: Not an array');
    }
    
    // Filter only published highlights
    const publishedHighlights = highlights.filter(highlight => 
      highlight && highlight.status === 'published'
    );
    
    console.log('Published highlights:', publishedHighlights.length);
    
    // Store highlights globally
    allHighlights = publishedHighlights;
    
    // Sort highlights by sequence (highest first = newest)
    const sortedHighlights = sortHighlightsBySequence(publishedHighlights);
    
    // Create category dropdown
    createCategoryDropdown(sortedHighlights);
    
    // Render highlights
    renderHighlights(sortedHighlights);
    
    return true;
  } catch (error) {
    console.error('Error fetching highlights:', error.message);
    
    // Create empty category dropdown
    createCategoryDropdown([]);
    
    // Show default blogs
    showDefaultBlogs();
    
    return false;
  }
}

// Initialize on page load - use a single event listener
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, initializing highlights');
  
  // Call fetchAllHighlights with a retry mechanism
  fetchAllHighlights().then(success => {
    if (!success) {
      console.log('Initial fetch failed, retrying once...');
      // Retry after a short delay
      setTimeout(() => {
        fetchAllHighlights().catch(err => {
          console.error('Retry also failed:', err);
        });
      }, 3000);
    }
  });
});