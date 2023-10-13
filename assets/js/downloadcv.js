
function descargarPDF() {

    // Crear un enlace temporal
    var enlace = document.getElementById('cvbutton');
    enlace.href = '../cv/CV-ES.pdf';
    enlace.download = 'CV-ES.pdf';
    
    // Simular un clic en el enlace para iniciar la descarga
    enlace.click();
}