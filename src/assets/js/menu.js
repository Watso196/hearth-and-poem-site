const menuButton = document.getElementById("menu-button");
const menuDialog = document.getElementById("menu-dialog");
const menuCloseButton = document.getElementById("menu-close");
// body is defined in another module at top level and can be accessed by this script when compiled due to that

menuButton.addEventListener("click", () => {
    menuDialog.showModal();
    body.classList.add("modal-open");
});

menuCloseButton.addEventListener("click", () => {
    menuDialog.close();
    body.classList.remove("modal-open");
})