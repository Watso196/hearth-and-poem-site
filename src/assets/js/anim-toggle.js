document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("animationToggle");
  const mobileButton = document.getElementById("animationToggleMobile");
  const body = document.body;

  function checkReducedMotion() {
    const motionReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
    if (motionReduced) {
      setAnimation(false);
    }
  }

  function setAnimation(enabled) {
    if (enabled) {
      body.classList.add("animate-enabled");
    } else {
      body.classList.remove("animate-enabled");
    }
    localStorage.setItem("animations", enabled);

    // Keep both toggles in sync
    if (button) button.checked = enabled;
    if (mobileButton) mobileButton.checked = enabled;
  }

  function checkStoredState() {
    const stored = localStorage.getItem("animations");
    if (stored !== null) {
      setAnimation(stored === "true");
    } else {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setAnimation(!prefersReducedMotion);
    }
    checkReducedMotion();
  }

  if (button) {
    button.addEventListener("change", () => {
      setAnimation(button.checked);
    });
  }

  if (mobileButton) {
    mobileButton.addEventListener("change", () => {
      setAnimation(mobileButton.checked);
    });
  }

  // Run only once on page load to initialize both toggles
  checkStoredState();
});
