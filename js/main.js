// hago conexiones con html para usar el DOM
const listaPokes = document.getElementById("listaDePokes");
const loading = document.getElementById("loading");
// Sirve para caapitalizar una palabra (Vuelve la mayúscula la primera letra)
const capitalizar = (palabra)=>palabra.replace(/^\w/,(c) => c.toUpperCase());


//Sirve para obtener todos los pokemones de la api (creo)
const obtenerPokes = async () =>{
    try {
        let consulta = await fetch(`https://pokeapi.co/api/v2/pokedex/national/`)
        const res = await consulta.json()
        return res.pokemon_entries

    } catch (error) {
        return error
    }
}
// obtengo la información de cada pokémon, puedo ingresar como primer parámetro el ID o nombre pokémon
// el segundo parámetro solo acepta "img" para devolver la url de una imagen
// o types para devolver el nombre del tipo elemental del pokémon
const obtenerPokeInfo = async (pokeID,imgOData) => {
    try {
        const consulta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}/`)
        const Poke = await consulta.json();
        if(imgOData === "img"){
           return Poke.sprites.front_default
        }else if(imgOData === "types"){
            return [Poke.types[0]?.type.name , Poke.types[1]?.type?.name]
        }
        
    } catch (error) {
        return error
    }
}

// inicializo la cantidad de pokemones y el límite de renderizado iniciado con 30

let pokesCant = 0;
let limitePokes = 30;

// con este for renderizo tarjetas simulando que carga la página mientras carga la información
// donde solo renderizo 12 tarjetas
    
    const cargar12Cartas = () => {
        for(let i=0;i<12;i++){
            listaPokes.innerHTML += `
            <div class="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-2 mt-5" id="CardCargando${i}">
                            
                            
            <div class="card" aria-hidden="true">
                    <img src="" class="card-img-top "  alt="">
                    <div class="card-body">
                        <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6">1111111111111111111111</span>
                        </h5>
                        <p class="card-text placeholder-glow">
                        <span class="placeholder col-7">111111111111111</span>
                        <span class="placeholder col-4">11111111111</span>
                        <span class="placeholder col-4">1111111111</span>
                        <span class="placeholder col-6">11111111111111</span>
                        <span class="placeholder col-8">111111111111</span>
                        </p>
                        <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
                    </div>
                </div>
            </div>`;
        }
    }
    const limpiar12Cartas = () => {
        for(let i=0;i<12;i++){
            document.getElementById(`CardCargando${i}`).remove()
        }
    }
// con esta fnAsync pinto las tarjetas de los pokemones
// el parámetro que recibe por defecto es false y quiere decir que si se usa la fn
// es como si se reiniciara la página, en caso de true recarga la página pero con más pokemones(nuevo límite +30)
const pintarPokes = async (boolean=false) => {
    try {
        let resultado = await obtenerPokes();

        
        if(boolean){limitePokes+=30;loading.innerHTML=`
            <div class="spinner-border  mt-5 fs-1 " role="status" >
                <span class="visually-hidden">Loading...</span>
            </div>`;cargar12Cartas()

        }else{
            pokesCant=0;limitePokes=30;(pokesCant==limitePokes)?listaPokes.innerHTML="":cargar12Cartas();
        }


        // este for usa el liminte de pokemones y se maneja por el valor de pokesCant actual
         for(pokesCant;pokesCant<limitePokes;pokesCant++){
            //obtengo las imagenes por cada pokémon
            let pokeIMGS = await obtenerPokeInfo(pokesCant+1,"img");
            // obtengo la información de tipo elemental de cada pokémon
            let pokeInfoType = await obtenerPokeInfo(pokesCant+1, "types");
            // obtengo el nombre de cada pokémon
            let nombre = await resultado[pokesCant].pokemon_species.name;
            // cargo la tarjeta en listaPokes que es un .row y se va a ir sumando una tarjeta por pokémon
            // hasta un tome minimo de 30
                listaPokes.innerHTML += `
            
                <div class="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-2 mt-5" id="Poke${pokesCant}">
                    <div class="card p-3 w-auto border border-dark border-opacity-25 border-5 rounded" >
                        <img src="${pokeIMGS}" class="card-img-top img-fluid " id="Img${pokesCant}" alt="..." onclick="agrandarImg('Img${pokesCant}')">
                        <div class="card-body p-0 text-center border-top border-4 border-opacity-25">
                            <h5 class="card-title">${capitalizar(nombre)}  </h5>

                            <img src="./img/240px-Pokémon_${capitalizar(pokeInfoType[0])}_Type_Icon.svg.png" class="Poketype" alt="...">

                            ${typeof pokeInfoType[1]== "undefined"?"":`
                                <img src="./img/240px-Pokémon_${capitalizar(pokeInfoType[1])}_Type_Icon.svg.png" class="Poketype" alt="...">
                            `}  

                            <p class="card-text">
                                ${capitalizar(pokeInfoType[0])} ${typeof pokeInfoType[1]== "undefined"?"":capitalizar(pokeInfoType[1])}
                            </p>
                            <a href="#" class="btn btn-warning">Ver Mas</a>
                        </div>
                    </div>
                </div>`
         }
         //limpio el innerHTML de la animación de "cargando..."
         
            if(pokesCant==limitePokes){
                loading.innerHTML = ``;
                limpiar12Cartas();
                
            }
            
            
         

         
    } catch (error) {
        console.log(error)
    }
}
pintarPokes();



// animaciones:
const agrandarImg = (id) =>{
    let imagen = document.getElementById(id);
    let estilo = "transition: all 1s; width:200px"
    if(imagen.style.width != "200px"){
        imagen.style =estilo
    }else{
        imagen.style = "transition:all 1s; width:150px;"
    }
}
