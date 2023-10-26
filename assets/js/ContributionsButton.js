// Boton de mostrar/ocultar las contribuciones
const toggleButton = document.getElementById("toggleButton");
const content = document.getElementById("content");

toggleButton.addEventListener("click", function() {
    if (content.classList.contains("hidden")) {
        content.classList.remove("hidden");
        content.classList.add("visible");
        toggleButton.textContent = "-";
    } else {
        content.classList.remove("visible");
        content.classList.add("hidden");
        toggleButton.textContent = "+";
    }
});