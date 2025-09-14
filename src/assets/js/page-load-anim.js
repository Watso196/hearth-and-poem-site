document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const poems = document.querySelectorAll('.poem-container article');

  body.classList.add("on-load-trigger");

  setTimeout(() => {
    document.body.classList.remove('on-load-trigger');
    }, 1500); // match animation duration to ensure removal
});
