// Obtén los elementos del DOM
const customSelect = document.getElementById('custom-select');
const options = customSelect.querySelector('.options');

// Agrega un evento al elemento custom-select para mostrar/ocultar las opciones
customSelect.addEventListener('click', () => {
    options.classList.toggle('visible');
});

// Agrega eventos a las opciones para cambiar la paleta de colores
const optionItems = options.querySelectorAll('.option');

const colors = ['--color-A', '--color-B', '--color-C', '--color-D', '--color-E', '--color-F'];

// Paletas
const paleta1 = ['#4b1139', '#3b4058', '#2a6e78', '#7a907c', '#c9b180', '#ffd47e'];
const paleta2 = ['#213435', '#46685b', '#648a64', '#a6b985', '#e1e3ac', '#ffd47e'];
const paleta3 = ['#1d0c20', '#651f71', '#7037cd', '#506ee5', '#68b2f8', '#400b4a'];
const paleta4 = ['#070705', '#3e4b51', '#6f737e', '#89a09a', '#c1c0ae', '#070705'];
const paleta5 = ['#364461', '#4d686f', '#6d756a', '#bfa374', '#e3ba6a', '#364461'];

const paletas = [] // Mapa de paletas (key -> nombre de paleta, value -> lista de colores)
paletas['paleta1'] = paleta1; paletas['paleta2'] = paleta2;
paletas['paleta3'] = paleta3; paletas['paleta4'] = paleta4;
paletas['paleta5'] = paleta5;


// Paleta inicial
for (let i = 0; i < colors.length; i++)
    document.documentElement.style.setProperty(colors[i], paleta1[i]);


optionItems.forEach((option) => {

  option.addEventListener('click', () => {

        // Obtiene el valor de data-value
        const selectedPalette = option.getAttribute('data-value');

        for (let i = 0; i < colors.length; i++)
            document.documentElement.style.setProperty(colors[i], paletas[selectedPalette][i]);

        // Actualiza la opción seleccionada en el dropdown
        customSelect.querySelector('.selected-option').innerHTML = option.innerHTML;

        // Oculta las opciones
        options.classList.toggle('hide');
        

        // Cambiamos los colores de las animaciones
        for (let a of animations)
            a.refreshColors();

    });

});
