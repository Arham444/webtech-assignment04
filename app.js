const DEFAULT_SLIDES = `# Welcome to Presentation
## Powered by Markdown
This is Slide 01 content.

---

# Features
- Realtime preview
- Split screen mode
- LocalStorage auto-save

---

# Keyboard Navigation
- **Left / Right Arrow**: Navigate slides
- **Ctrl + S**: Save slides
- **F11**: Full Screen mode

---

# Final Slide
Thank you! This is slide 04.`;

const markdownInput = document.getElementById('markdown-input');
const slideContent = document.getElementById('slide-content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const saveBtn = document.getElementById('save-btn');
const slideCounter = document.getElementById('slide-counter');

let slides = [];
let currentSlideIndex = 0;

function init() {
  // Check saved content or move to default
  const savedData = localStorage.getItem('slidesData');
  markdownInput.value = savedData ? savedData : DEFAULT_SLIDES;

  parseMarkdown();

  markdownInput.addEventListener('input', parseMarkdown);
  prevBtn.addEventListener('click', goToPrevSlide);
  nextBtn.addEventListener('click', goToNextSlide);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  saveBtn.addEventListener('click', saveSlides);
  document.addEventListener('keydown', handleKeyboardShortcuts);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
}

function parseMarkdown() {
  const rawText = markdownInput.value;
  
  slides = rawText.split(/[\r\n]+---[\r\n]+/).map(s => s.trim());

  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = Math.max(0, slides.length - 1);
  }

  renderCurrentSlide();
}

function renderCurrentSlide() {
  if (slides.length === 0 || slides[0] === "") {
    slideContent.innerHTML = "<p>No slides to present.</p>";
    slideCounter.textContent = "0 / 0";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const activeMarkdown = slides[currentSlideIndex] || "";
  slideContent.innerHTML = marked.parse(activeMarkdown);

  // Update Slide Counter = {current slide number} / {total number of slides}
  slideCounter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;

  prevBtn.disabled = (currentSlideIndex === 0);
  nextBtn.disabled = (currentSlideIndex === slides.length - 1);
}

// Buttons Function
function goToPrevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderCurrentSlide();
  }
}

function goToNextSlide() {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    renderCurrentSlide();
  }
}

// Save Slides
function saveSlides() {
  localStorage.setItem('slidesData', markdownInput.value);
  alert('Slides saved successfully!');
}

// Fullscreen 
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error entering fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

function handleFullscreenChange() {
  if (document.fullscreenElement) {
    fullscreenBtn.textContent = 'Exit Full Screen';
  } else {
    fullscreenBtn.textContent = 'Full Screen';
  }
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(event) {
  // Arrow keys
  if (event.key === 'ArrowLeft') {
    goToPrevSlide();
  } else if (event.key === 'ArrowRight') {
    goToNextSlide();
  }

  // Save: Ctrl + S 
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault(); 
    saveSlides();
  }

  // Fullscreen: F11 
  if (event.key === 'F11') {
    event.preventDefault(); 
    toggleFullscreen();
  }
}

document.addEventListener('DOMContentLoaded', init);