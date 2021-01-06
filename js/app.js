const criptoMonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado')

document.addEventListener('DOMContentLoaded', ()=>{
    buscarCriptoM();

    formulario.addEventListener('submit', (e)=>{
        e.preventDefault();
        validarFormulario();

    })
});

function buscarCriptoM(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultado => resultado.Data )
        .then( criptoMonedas => selectCriptomonedas(criptoMonedas) )
}

function selectCriptomonedas(criptoMonedas){
    criptoMonedas.forEach( cripto => {
        const { Name, FullName } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.setAttribute('value', `${Name}`);
        option.textContent = FullName;

        criptoMonedasSelect.appendChild(option)
    });
}

function validarFormulario(){
    if( criptoMonedasSelect.value === '' || monedaSelect.value === '' ){
            mostrarAlerta('Todos los campos son obligatorios');
        return
    }
    consultarAPI();
}

function mostrarAlerta(mensaje){
    const alerta = document.querySelector('.error');

    if(!alerta){
        const div = document.createElement('div');
        div.classList.add('error');
    
        div.textContent = mensaje;
    
        formulario.appendChild(div)
    
        setTimeout(() => {
            div.remove();
        }, 3000);
    } 
}

function consultarAPI(){
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptoMonedasSelect.value}&tsyms=${monedaSelect.value}`;

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( cotizacion => {
            mostrarCotizacion(cotizacion.DISPLAY[criptoMonedasSelect.value][monedaSelect.value])
        } )
}


function mostrarCotizacion(cotizacion){
    limpiarHTML()

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML =`Es precio es: <span>${PRICE}</p>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span>`;

    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variacion en las ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Ultima actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion)
}

function limpiarHTML(){
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner)
}