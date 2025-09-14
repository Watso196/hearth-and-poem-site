const button = document.getElementById("darkModeToggle");
const mobileButton = document.getElementById("darkModeToggleMobile");
const body = document.body;

function setTheme(theme) {
  body.classList.remove("light", "dark");
  body.classList.add(theme);
  localStorage.setItem("theme", theme);

  // Sync control states
  const isDark = theme === "light";
  if (button) button.checked = isDark;
  if (mobileButton) mobileButton.checked = isDark;
}

// Attach event listeners safely
if (button) {
  button.addEventListener("change", () => {
    setTheme(button.checked ? "light" : "dark");
  });
}

if (mobileButton) {
  mobileButton.addEventListener("change", () => {
    setTheme(mobileButton.checked ? "light" : "dark");
  });
}

// On load, apply stored theme or default to dark
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  setTheme(storedTheme);
} else {
  setTheme("dark");
}
