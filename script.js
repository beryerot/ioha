let canvas;
let context;
let drawing = false;
let isFirstStroke = true;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    const img = new Image();
    img.onload = function () {
        const canvasAspectRatio = canvas.width / canvas.height;
        const imgAspectRatio = img.width / img.height;

        let renderWidth = canvas.width;
        let renderHeight = canvas.height;
        let xOffset = 0;
        let yOffset = 0;

        if (imgAspectRatio > canvasAspectRatio) {
            // La imagen es más ancha que el lienzo
            renderWidth = canvas.width;
            renderHeight = canvas.width / imgAspectRatio;
            yOffset = (canvas.height - renderHeight) / 2;
        } else {
            // La imagen es más alta que el lienzo
            renderHeight = canvas.height;
            renderWidth = canvas.height * imgAspectRatio;
            xOffset = (canvas.width - renderWidth) / 2;
        }

        context.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
    };
    img.src = 'test.png';

    const header = document.getElementById('header');
    header.textContent = "Conecta los puntos para descubrir la figura escondida";

    function draw(e) {
        e.preventDefault();

        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const offsetX = rect.left;
        const offsetY = rect.top;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        context.lineWidth = 3;
        context.lineCap = 'round';
        context.strokeStyle = '#ff0000'; // Color rojo

        context.lineTo(clientX - offsetX, clientY - offsetY);
        context.stroke();
        context.beginPath();
        context.moveTo(clientX - offsetX, clientY - offsetY);
    }

    function startDrawing(e) {
        e.preventDefault();
        drawing = true;
    
        const rect = canvas.getBoundingClientRect();
        const offsetX = rect.left;
        const offsetY = rect.top;
    
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
        if (!isFirstStroke) {
            const sendButton = document.getElementById('sendButton');
            sendButton.innerHTML = 'Enviar';
            sendButton.classList.remove('sent');
            sendButton.style.pointerEvents = 'auto'; // Vuelve a habilitar los clics en el botón
            isFirstStroke = true;
        }
    
        context.beginPath();
        context.moveTo(clientX - offsetX, clientY - offsetY);
    
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('touchmove', draw);
    }
    

    function endDrawing() {
        drawing = false;
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('touchmove', draw);
    }



    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);

    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('touchend', endDrawing);

    window.addEventListener('resize', function () {
        canvas.width = 372; // Ajusta el ancho del lienzo al ancho de la imagen
        canvas.height = 500; // Ajusta la altura del lienzo a la altura de la imagen
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
}

function enviarDibujo() {
    const sendButton = document.getElementById('sendButton');
    sendButton.innerHTML = 'Enviando...'; // Cambia el texto del botón a "Enviando..."
    sendButton.style.pointerEvents = 'none'; // Desactiva clics adicionales

    context.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = function () {
        const canvasAspectRatio = canvas.width / canvas.height;
        const imgAspectRatio = img.width / img.height;

        let renderWidth = canvas.width;
        let renderHeight = canvas.height;
        let xOffset = 0;
        let yOffset = 0;

        if (imgAspectRatio > canvasAspectRatio) {
            // La imagen es más ancha que el lienzo
            renderWidth = canvas.width;
            renderHeight = canvas.width / imgAspectRatio;
            yOffset = (canvas.height - renderHeight) / 2;
        } else {
            // La imagen es más alta que el lienzo
            renderHeight = canvas.height;
            renderWidth = canvas.height * imgAspectRatio;
            xOffset = (canvas.width - renderWidth) / 2;
        }

        context.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);

        // Cambia el texto del botón a "DIBUJO ENVIADO"
        sendButton.innerHTML = 'DIBUJO ENVIADO';
        sendButton.classList.add('sent');

        // Restablece el estado del botón después de 2 segundos
        setTimeout(function() {
            sendButton.innerHTML = 'Enviar';
            sendButton.classList.remove('sent');
            sendButton.style.pointerEvents = 'auto'; // Vuelve a habilitar los clics en el botón
            isFirstStroke = true;
        }, 2000);
    };
    img.src = 'test.png';
}



document.addEventListener('DOMContentLoaded', init);
