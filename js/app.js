//crear y iniciar sesión en la página openweathermap.org 
// ir a la pestaña APIKeys y en create key ingresar un nombre. presionar botón generate
// se recomienda generar unos minutos antes debido a que demora en habilitar la key

// Las APIs requieren que les pases información, como ellos la esperan, es decir, no puedes mandar los que tu quieras.
// En este caso ambos campos son obligatorios
// https://tobiasahlin.com/spinkit/ para los spinner de carga

const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {//similar a DOMContentLoaded. diferencia que este es en document

    formulario.addEventListener('submit', buscarClima);

})

function buscarClima(e) {
    e.preventDefault();

    console.log('Buscando el Clima...');

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    // la API requiere el valor pais de dos digitos Chile cl
    const pais = document.querySelector('#pais').value;
    // console.log(ciudad, pais);
    if (ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API
    consultarAPI(ciudad, pais);
}


function mostrarError(mensaje) {
    console.log(mensaje)

    // Si existe esta clase bg-red-100
    const alerta = document.querySelector('.bg-red-100');

    // Validar multiples alertas por cada click
    if(!alerta) { // si esta vacia entonces

         // Crear una alerta usando Scripting
    const alerta = document.createElement('div');
    // Agregar una clase al div
    alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "relative", "max-w-md", "mx-auto", "mt-6", "text-center");

    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
    `;

    container.appendChild(alerta);

    // Quitar el div llamado alerta
    setTimeout( () => {
        alerta.remove();
    }, 2000);

    }  
}

// buscarClima utiliza la función consultarAPI
function consultarAPI(ciudad, pais){
    // La API openweathermap requiere un id de la aplicación.
    // No todas solicitan el id. Solicitan el id porque con esa
    // info se puede saber si la ocupan o no. Si la ocupan se Cobra $ 

    // Debes enviar los datos de forma estructurada
    const appId = '5cf353e40030d683f776070aa4847925';
    // ir a openweathermap pestaña API, utilizar las gratuitas
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner();//Muestra un Spinner de carga

    console.log(url);// copiar la respuesta en el navegador
    // para que entregue la respuesta JSON de la página openweathermap

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( datos => {
            limpiarHTML();// Limpiar lo de function mostrarClima
            // Si se ingresan los dos Input, no caerá en el catch. Debido a que los campos fueron llenados. 
            // Se cumple el Promise pero lo ingresado no es correcto

            // Si ingresas mal la ciudad se debe validar acá, en este then.
            // La API devuelve valor cod: "404", message: "city not found"
            // Con estos datos se puede validar una entrada erronea
            console.log(datos);
            if(datos.cod === "404") {
                mostrarError(datos.message);
                return;
            }
            // Mostrar la Temperatura Actual, Imprime en el HTML
            mostrarClima(datos);
            
        })
}

// 6. Mostrar más información de la API
function mostrarClima(datos) {
    // en chrome - ver en los objetos - main - temp_max
    // Objeto main, contiene otros objetos
    // El destructuring queda así
    const { name, main: { temp, temp_max, temp_min} } = datos;    

    // pasar T° kelvin a Celcius temp - 273.15
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    // console.log(temp - 273.15);

    // Scripting
    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`; 
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;// &#8451; °C una entidad de HTML5 
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;// &#8451; °C una entidad de HTML5 
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;// &#8451; °C una entidad de HTML5 
    tempMinima.classList.add('text-xl');



    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
    // Al Mostrar el HTML y luego buscar otra ciudad. EStos se apilan. se debe borrar
}

// Función Helper
const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}


function Spinner() {

    limpiarHTML();// Limpiar Registro previo

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;

    resultado.appendChild(divSpinner);
}