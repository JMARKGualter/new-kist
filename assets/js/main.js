/**
// * Template Name: Mamba
// * Template URL: https://bootstrapmade.com/mamba-one-page-bootstrap-template-free/
// * Updated: Aug 07 2024 with Bootstrap v5.3.3
// * Author: BootstrapMade.com
// * License: https://bootstrapmade.com/license/
// */
//---------Pagination--------//
// const cardsPerPage = 5;
// let currentPage = 1;

// function showPage(page) {
//   const cardsContainer = document.getElementById("cards-container");

//   console.log(cardsContainer)
//   const cards = cardsContainer.querySelectorAll(".col-sm-12.col-md-6.col-lg-3.mb-3");
//   const totalCards = cards.length;
//   const totalPages = Math.ceil(totalCards / cardsPerPage);

//   // Hide all cards initially
//   cards.forEach((card) => (card.style.display = "none"));

//   // Calculate start and end indices for the current page
//   const startIndex = (page - 1) * cardsPerPage;
//   const endIndex = Math.min(startIndex + cardsPerPage, totalCards);

//   // Display cards for the current page
//   for (let i = startIndex; i < endIndex; i++) {
//     cards[i].style.display = "block";
//   }

//   // Update page indicator
//   document.getElementById("page-indicator").textContent = `Page ${page} of ${totalPages}`;

//   // Disable/enable pagination buttons
//   document.querySelector("button[onclick='prevPage()']").disabled = page === 1;
//   document.querySelector("button[onclick='nextPage()']").disabled = page === totalPages;
// }

// function prevPage() {
//   if (currentPage > 1) {
//     currentPage--;
//     showPage(currentPage);
//   }
// }

// function nextPage() {
//   const totalPages = Math.ceil(document.querySelectorAll("#cards-container .col-sm-12.col-md-6.col-lg-3.mb-3").length / cardsPerPage);
//   if (currentPage < totalPages) {
//     currentPage++;
//     showPage(currentPage);
//   }
// }

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

// // Initialize the first page
// showPage(currentPage);

//-------------Pagination--------------//


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
    // Fallback to remove preloader if load event doesn't fire or takes too long
    setTimeout(() => {
      if (document.body.contains(preloader)) {
        preloader.remove();
      }
    }, 1000);
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

var impactDropdown = document.getElementById('impactDropdown');
if (impactDropdown) {
  impactDropdown.addEventListener('click', function(e) {
    if (e.target === this) {
      window.location.href = this.getAttribute('href');
    }
  });
}

// Google tag (gtag.js)
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'G-ES0PWB5CY5');

document.addEventListener('DOMContentLoaded', function() {
  var myCarousel = document.querySelector('#hero-carousel');
  if (myCarousel) {
    var carousel = bootstrap.Carousel.getOrCreateInstance(myCarousel);

    var title = document.getElementById('hero-title');

    myCarousel.addEventListener('slide.bs.carousel', function (e) {
      var nextSlide = e.relatedTarget;
      var newHeading = nextSlide.getAttribute('data-heading');
      
      if (title) {
          title.style.animation = 'none';
          title.offsetHeight; /* trigger reflow */
          title.innerHTML = newHeading;
          title.style.animation = 'fadeInDown 1s both';
      }
    });

    carousel.cycle();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.cards-container .col-6');
  const cardsPerPage = [4, 4, 2]; // 4 cards on page 1, 4 on page 2, 2 on page 3
  let currentPage = 1;
  const totalPages = 3;

  // Check for mobile view
  if (window.innerWidth < 768) {
    // Disable pagination on mobile
    const paginationControls = document.getElementById('pagination-controls');
    if (paginationControls) paginationControls.style.display = 'none';
    cards.forEach(card => {
      card.style.display = 'block';
    });
    return; // Exit script
  }

  // Add initial classes to cards
  cards.forEach((card) => {
    card.classList.add('card-transition');
  });

  function showPage(pageNum, direction) {
    let startIdx = 0;
    for (let i = 0; i < pageNum - 1; i++) {
      startIdx += cardsPerPage[i];
    }

    const endIdx = startIdx + cardsPerPage[pageNum - 1];

    // First hide all cards with animation
    cards.forEach((card) => {
      if (card.style.display !== 'none') {
        // Only animate cards that are currently visible
        card.classList.remove('fade-in-left', 'fade-in-right');
        card.classList.add(direction === 'next' ? 'fade-out-left' : 'fade-out-right');

        // After animation completes, hide the card
        setTimeout(() => {
          card.style.display = 'none';
        }, 300); // Match this with your CSS transition duration
      } else {
        card.style.display = 'none';
      }
    });

    // Then show new cards with animation after a delay
    setTimeout(() => {
      cards.forEach((card, idx) => {
        if (idx >= startIdx && idx < endIdx) {
          card.classList.remove('fade-out-left', 'fade-out-right');
          card.classList.add(direction === 'next' ? 'fade-in-right' : 'fade-in-left');
          card.style.display = 'block';
        }
      });
    }, 300); // Match this with your CSS transition duration

    // Update button states
    const prevBtnOverlay = document.getElementById('prev-btn-overlay');
    const nextBtnOverlay = document.getElementById('next-btn-overlay');
    const prevBtnBottom = document.getElementById('prev-btn-bottom');
    const nextBtnBottom = document.getElementById('next-btn-bottom');

    if(prevBtnOverlay) prevBtnOverlay.disabled = (pageNum === 1);
    if(nextBtnOverlay) nextBtnOverlay.disabled = (pageNum === totalPages);
    if(prevBtnBottom) prevBtnBottom.disabled = (pageNum === 1);
    if(nextBtnBottom) nextBtnBottom.disabled = (pageNum === totalPages);

    // Update page indicator
    const pageIndicator = document.getElementById('page-indicator');
    if (pageIndicator) pageIndicator.textContent = `Page ${pageNum} of ${totalPages}`;
  }

  window.currentPage = currentPage;

  window.nextPage = function () {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage, 'next');
    }
  };

  window.prevPage = function () {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage, 'prev');
    }
  };

  // Show first page on load (no animation for initial load)
  cards.forEach((card, idx) => {
    card.style.display = (idx < cardsPerPage[0]) ? 'block' : 'none';
    if (idx < cardsPerPage[0]) {
      card.classList.add('fade-in-right');
    }
  });

  // Update button states
  const prevBtnOverlay = document.getElementById('prev-btn-overlay');
  const nextBtnOverlay = document.getElementById('next-btn-overlay');
  const prevBtnBottom = document.getElementById('prev-btn-bottom');
  const nextBtnBottom = document.getElementById('next-btn-bottom');

  if(prevBtnOverlay) prevBtnOverlay.disabled = true;
  if(nextBtnOverlay) nextBtnOverlay.disabled = (totalPages === 1);
  if(prevBtnBottom) prevBtnBottom.disabled = true;
  if(nextBtnBottom) nextBtnBottom.disabled = (totalPages === 1);

  // Update page indicator
  const pageIndicator = document.getElementById('page-indicator');
  if (pageIndicator) pageIndicator.textContent = `Page 1 of ${totalPages}`;
});

// YouTube API for Autoplay on Scroll
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('virtualTourVideo', {
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.mute(); // Mute to allow autoplay
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        player.playVideo();
        event.target.unmute();
        event.target.setVolume(100);
      } else {
        player.pauseVideo();
      }
    });
  }, { threshold: 0.5 });
  var videoElement = document.getElementById('virtualTourVideo');
  if (videoElement) observer.observe(videoElement);
}

// Dynamic Background Script
document.addEventListener('DOMContentLoaded', function() {
  const bgDiv = document.getElementById('dynamic-background');
  const images = [
    'assets/img/bg/bg-6.jpg',
    'assets/img/kist/3.jpg',
    'assets/img/kist/8-8.jpg'
  ];
  
  // Preload images
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  function updateBackground() {
    const scrollPosition = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollPosition / docHeight;
    
    // Divide page into 3 equal parts
    let imgIndex = 0;
    if (scrollPercent >= 0.66) {
      imgIndex = 2;
    } else if (scrollPercent >= 0.33) {
      imgIndex = 1;
    }
    
    const currentImage = `url('${images[imgIndex]}')`;
    // Normalize quotes for comparison and update if changed
    if (bgDiv && bgDiv.style.backgroundImage.replace(/"/g, "'") !== currentImage) {
      bgDiv.style.backgroundImage = currentImage;
    }
  }

  window.addEventListener('scroll', updateBackground);
  updateBackground(); // Initial call
});

document.addEventListener('DOMContentLoaded', function() {
  const tabWrapper = document.querySelector('.collaboration-tabs');
  const tabLinks = document.querySelectorAll('.collaboration-tabs .nav-link');

  tabLinks.forEach(link => {
    link.addEventListener('shown.bs.tab', event => {
      if (tabWrapper) {
          tabWrapper.classList.remove('knowledge-mode', 'innovation-mode', 'science-mode');
          if (event.target.id === 'pills-knowledge-tab') tabWrapper.classList.add('knowledge-mode');
          else if (event.target.id === 'pills-innovation-tab') tabWrapper.classList.add('innovation-mode');
          else if (event.target.id === 'pills-science-tab') tabWrapper.classList.add('science-mode');
      }
    });
  });
});