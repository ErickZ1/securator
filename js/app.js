document.addEventListener("DOMContentLoaded", function() {
    let respuesta = [];
    let cantiCorrectas = 0;
    let cantiIncorrectas = 0;
    let numPregunta = 0;

    // Función para actualizar el contador de progreso y las respuestas correctas e incorrectas
    function actualizarContador() {
        document.getElementById("progreso").textContent = `${numPregunta + 1}/${bd_preguntas.length}`;
        document.getElementById("correctas").textContent = `Correctas: ${cantiCorrectas}`;
        document.getElementById("incorrectas").textContent = `Incorrectas: ${cantiIncorrectas}`;
    }

    function cargaPregunta(num) {
        const pregunta = bd_preguntas[num];
        
        const contenedor = document.createElement("div");
        contenedor.className = "conteiner-question";
        contenedor.id = "pregunta" + pregunta.id;
        
        const h2 = document.createElement("h2");
        h2.textContent = (num + 1) + ". " + pregunta.pregunta;
        contenedor.appendChild(h2);
        
        const opciones = document.createElement("div");
        
        const labels = [pregunta.op0, pregunta.op1, pregunta.op2, pregunta.op3, pregunta.op4].map((opcion, index) => {
            return crearLabel(index.toString(), opcion);
        });
        labels.forEach(label => opciones.appendChild(label));
        
        contenedor.appendChild(opciones);
        document.getElementById("conteiner").appendChild(contenedor);
        
        document.getElementById("corregir").style.display = 'inline-block'; // Mostrar botón corregir
        document.getElementById("siguiente").style.display = 'none'; // Ocultar botón siguiente

        // Actualizar el contador de progreso
        actualizarContador();
    }

    function crearLabel(num, txtOpcion) {
        const label = document.createElement("label");
        label.id = "l" + numPregunta + num;
        
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "p" + numPregunta;
        input.setAttribute("onclick", `seleccionar(${numPregunta}, ${num})`);
        
        const span = document.createElement("span");
        span.textContent = txtOpcion;
        
        const correcion = document.createElement("span");
        correcion.id = "p" + numPregunta + num;
        
        label.appendChild(input);
        label.appendChild(span);
        label.appendChild(correcion);
        
        return label;
    }

    window.seleccionar = function(pos, opElegida) {
        respuesta[pos] = opElegida;
        document.getElementById("corregir").style.display = 'inline-block'; // Mostrar botón corregir
    }

    function mostrarPregunta(num) {
        const contenedor = document.getElementById("conteiner");
        contenedor.innerHTML = '';
        cargaPregunta(num);
    }

    document.getElementById("siguiente").addEventListener("click", function() {
        if (numPregunta < bd_preguntas.length - 1) {
            numPregunta++;
            mostrarPregunta(numPregunta);
        } else {
            // Mostrar resultado final al terminar todas las preguntas
            const resultadoFinal = document.createElement("h2");
            resultadoFinal.className = "resultado";
            const porcentaje = (cantiCorrectas / bd_preguntas.length) * 100;
            resultadoFinal.textContent = `Porcentaje: ${porcentaje.toFixed(2)}%`;
            document.getElementById("conteiner").appendChild(resultadoFinal);
            
            // Mostrar botón para intentar de nuevo
            const botonIntentar = document.createElement("button");
            botonIntentar.textContent = "Intentar de nuevo";
            botonIntentar.addEventListener("click", reiniciarCuestionario);
            document.getElementById("conteiner").appendChild(botonIntentar);

            document.getElementById("siguiente").style.display = 'none';
            document.getElementById("corregir").style.display = 'none'; // Ocultar botón corregir al final
        }
    });

    document.getElementById("corregir").addEventListener("click", function() {
        const pregunta = bd_preguntas[numPregunta];
        const idPregunta = "pregunta" + pregunta.id;

        if (pregunta.correcta == respuesta[numPregunta]) {
            cantiCorrectas++;
            const idCorreccion = "p" + numPregunta + pregunta.correcta;
            document.getElementById(idPregunta).classList.add("correcta");
            document.getElementById(idCorreccion).innerHTML = "&check;";
            document.getElementById(idCorreccion).classList.add("acierto");
        } else {
            cantiIncorrectas++;
            const idCorreccion = "p" + numPregunta + pregunta.correcta;
            const id = "p" + numPregunta + respuesta[numPregunta];
            document.getElementById(idPregunta).classList.add("incorrecta");
            if (respuesta[numPregunta] !== undefined) {
                document.getElementById(id).innerHTML = "&#x2715;";
                document.getElementById(id).classList.add("no-acierto");
            }
            document.getElementById(idCorreccion).innerHTML = "&check;";
            document.getElementById(idCorreccion).classList.add("acierto");
        }

        let inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }

        window.scrollTo(0, 0);

        // Actualizar el contador de respuestas correctas e incorrectas
        actualizarContador();

        document.getElementById("siguiente").style.display = 'inline-block'; // Mostrar botón siguiente
        document.getElementById("corregir").style.display = 'none'; // Ocultar botón corregir
    });

    // Función para reiniciar el cuestionario
    function reiniciarCuestionario() {
        respuesta = [];
        cantiCorrectas = 0;
        cantiIncorrectas = 0;
        numPregunta = 0;

        const conteiner = document.getElementById("conteiner");
        conteiner.innerHTML = '';

        mostrarPregunta(numPregunta);

        document.getElementById("corregir").style.display = 'inline-block';
        document.getElementById("siguiente").style.display = 'none';
    }

    // Inicializar la primera pregunta y el contador
    mostrarPregunta(numPregunta);
    actualizarContador();
});
