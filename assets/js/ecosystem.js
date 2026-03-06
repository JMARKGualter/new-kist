/**
// * Template Name: Mamba
// * Template URL: https://bootstrapmade.com/mamba-one-page-bootstrap-template-free/
// * Updated: Aug 07 2024 with Bootstrap v5.3.3
// * Author: BootstrapMade.com
// * License: https://bootstrapmade.com/license/
// */

const cardsPerPage = 5;
let currentPage = 1;

function showPage(page) {
  const cardsContainer = document.getElementById("cards-container");

  console.log(cardsContainer)
  const cards = cardsContainer.querySelectorAll(".col-sm-12.col-md-6.col-lg-3.mb-3");
  const totalCards = cards.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  // Hide all cards initially
  cards.forEach((card) => (card.style.display = "none"));

  // Calculate start and end indices for the current page
  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = Math.min(startIndex + cardsPerPage, totalCards);

  // Display cards for the current page
  for (let i = startIndex; i < endIndex; i++) {
    cards[i].style.display = "block";
  }

  // Update page indicator
  document.getElementById("page-indicator").textContent = `Page ${page} of ${totalPages}`;

  // Disable/enable pagination buttons
  document.querySelector("button[onclick='prevPage()']").disabled = page === 1;
  document.querySelector("button[onclick='nextPage()']").disabled = page === totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
  }
}

function nextPage() {
  const totalPages = Math.ceil(document.querySelectorAll("#cards-container .col-sm-12.col-md-6.col-lg-3.mb-3").length / cardsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    showPage(currentPage);
  }
}

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

// Initialize the first page
// showPage(currentPage);


const map = L.map('map', {attributionControl: false}).setView([13.783267428288884, 121.07431694099648], 15);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([13.783025724200337, 121.07408166561258]).addTo(map);

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Auto generate the carousel indicators
   */
  document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
    carouselIndicator.closest('.carousel').querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
      if (index === 0) {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}" class="active"></li>`;
      } else {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}"></li>`;
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();


// NAV Menu The Impact dropdown

document.getElementById('impactDropdown').addEventListener('click', function(e) {
  if (e.target === this) {
    window.location.href = this.getAttribute('href');
  }
});


// SERVICES MODAL
// SERVICES MODAL
function openModal(contentUrl) {
  const modal = document.getElementById('researchModal');
  const modalBody = document.getElementById('modal-body');

  // Show the modal
  modal.style.display = 'block';
  
  // Force a reflow to ensure the display change is applied before adding the show class
  void modal.offsetWidth;
  
  // Add the show class to trigger animations
  modal.classList.add('show');

  // Create iframe to load content
  modalBody.innerHTML = `<iframe src="${contentUrl}" style="width: 100%; height: 100%; border: none;"></iframe>`;
}

function closeModal() {
  const modal = document.getElementById('researchModal');
  
  // Add hide class to trigger closing animations
  modal.classList.remove('show');
  modal.classList.add('hide');
  
  // Wait for animation to complete before hiding the modal
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('hide');
    document.getElementById('modal-body').innerHTML = ''; // Clear modal content
  }, 300); // Match this with the CSS transition duration
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('researchModal');
  if (event.target === modal) {
    closeModal();
  }
};

// Optional: Add event listener for close button if you have one
document.addEventListener('DOMContentLoaded', function() {
  const closeButton = document.querySelector('#researchModal .close');
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }
});