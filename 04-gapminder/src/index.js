import * as d3 from 'd3';
import { json } from 'd3-fetch'

// PIB par habitant par pays et pour chaque année depuis 1800
import gdp from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv' //PIB par habitant par pays et pour chaque année depuis 1800

// Espérance de vie par pays et pour chaque année depuis 1800
import lifeExpectancy from '../data/life_expectancy_years.csv' //espérance de vie par pays et pour chaque année depuis 1800

// Population depuis 1800
import population from '../data/population_total.csv' //population depuis 1800 par pays 


// Population de 2021
population.forEach(pays => { //on cherche d'abord à créer un tableau objet "pays" dans lequel on va ajouter tous les noms de pays
    (Object.keys(pays)).forEach(key => {
        if (typeof pays[key] == 'string' && key !== 'country') { //ici on veut tout les éléments du csv qui est une chaine de caractères (les chiffres) sauf la colonne country (donc les noms des pays)
            pays[key] = strToInt(pays[key])
        }
    })
    // console.log(pays['2017']); //pour vérifier: ca affiche toutes les populations de 2017
})

// PIB de 2021
let nbPib
gdp.forEach(pays => {
    if (typeof pays[2021] == 'string') {
        nbPib = strToInt(pays[2021])
        pays[2021] = nbPib
    }

    console.log(nbPib);
})

// Data les plus récentes pour les pays qui n'ont pas d'info en 2021
lifeExpectancy.forEach(pays => {
    if (pays[2021] == null) {
        let i = 2021
        do {
            i--
        } while (pays[i] == null);
        pays[2021] = pays[i]
    }
})


/* GRAPH -------------------------------------------------------------------------------- */
// Ajouter une div qui contiendra le graph
d3.select("body")
    .append("div")
    .attr('id', 'graph')
    .attr('width', '90%')

let widthDiv = document.querySelector('#graph').offsetWidth; //offsetWidth comprend les bordures de l'élément, le padding, la barre de défilement verticale si présente et affichée, et la largeur CSS de l'élément

const margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = widthDiv - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom

// Créer le svg du graph
const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 200)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") //on fait cela pour que cela ne commence pas à l'origine de la fenêtre

// Couleur de fond
svg.append("rect")
    // Position héritée -> pas besoin d'être modifiée
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", height)
    .attr("width", width)
    .style("fill", "lightgrey")


/* AXES -------------------------------------------------------------------------------- */
// Dimensions de l'axe X
let maxPib = 0
gdp.forEach(pibByYear => {
    if (pibByYear[2021] > maxPib) {
        maxPib = pibByYear[2021]
    }
})

// Dimensions de l'axe Y
let maxLifeLength = 0
lifeExpectancy.forEach(lifeExpectancyByYear => {
    if (lifeExpectancyByYear[2021] > maxLifeLength) {
        maxLifeLength = lifeExpectancyByYear[2021]
    }
})

// Max et le min de population dans un pays en 2021
let maxPop = 0
let minPop = 0

population.forEach(pays => {
    if (pays[2021] > maxPop) {
        maxPop = pays[2021]
    }
    if (population[0] == pays) {
        minPop = pays[2021]
    } else if (pays[2021] < minPop) {
        minPop = pays[2021]
    }
})

// Echelle de l'axe X
let x = d3.scalePow() //si les intervales sont linéraires alors on met d3.scaleLinear() sans le .exponent
    .exponent(0.75)
    .domain([0, maxPib * 1.05]) //c'est pour que cela ne s'arrete pas pile au maximum
    // la plage est définie comme étendue minimale et maximale des bandes 
    .range([0, width])
    .nice() //.nice() permet d'arrondir les valeurs de début et de fin et les afficher

// Echelle pour l'axe Y
let y = d3.scalePow()
    .exponent(1.7) //on met cela pour que la plage des données soit plus large que les intervalles où y a rien
    .domain([0, maxLifeLength * 1.05])
    // inverser le sens pour avoir la graduation dans le bon sens pour utilisateur 
    .range([height, 0])
    .nice()

// Fonction échelle pour la taille des cercles
let sqrtScale = d3.scaleSqrt() //la racine carré 
    .domain([minPop, maxPop])
    .range([4, 30]);




/* DESSINER LES AXES -------------------------------------------------------------------------------- */
// Axe X
svg.append("g")
    //translation de l'axe pour le positionner au bon endroit, en l'occurence descendre le graphe de sa taille en y 
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .call(d3.axisBottom(x).tickSize(-height * 1.3).ticks(10)) //permet de faire des lignes entières sur tout le graph

// Axe Y
svg.append("g")
    // .call(d3.axisLeft(y))
    .call(d3.axisLeft(y)
        .tickSize(-width * 1.3).
        ticks(10)) //spécifie le nb de lignes


/* APPARENCE ------------------------------------------------------------------------------------------ */
// Lignes
svg.selectAll(".tick line")
    .attr("stroke", "white")
    .attr("opacity", "0.6")

// Description axe X 
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + 30)
    .text("PIB par habitant [CHF]");

// Description axe Y
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -margin.top - height / 2 + 20)
    .text("Espérance de vie")


/* CERCLES ------------------------------------------------------------------------------------------- */
// Ajout de cercles
svg.append('g')
    .selectAll("dot") //c'est une balise inexistante, quand on veut illsutrer des données on est obligé de faire genre qu'on sélectionne une div qui n'existe pas
    // data pib par habitant
    .data(gdp)
    // renvoie la séléction d'entrée 
    .enter()
    // ajout d'un cercle à chaque entrée
    .append("circle")
    // Définir l'emplacement des cercles sur l'axe X 
    .attr("cx", function (d) { return x(d[2021]) })
    // Définir l'emplacement des cercles sur l'axe Y en ajoutant le dataset de l'espérance de vie
    .data(lifeExpectancy)
    .join()
    .attr("cy", function (d) { return y(d[2021]) })
    // Modifie la taille des cercles selon la population
    .data(population)
    .join()
    .attr("r", function (d) { return sqrtScale(d[2021]) })
    .style("fill", "red")
    .attr("opacity", "0.4")
    .attr("stroke", "white")
//---------------------------------------------------------------------------------------------

//fonction pour convertir les string en int ainsi que les k en milliers et les m en millions
function strToInt(str) {
    //ici, deux types de cas à prendre en compte
    //M, le million ex : 33,3 = 33 300 000
    let number
    let onlyNumber
    if (str.slice(-1) == 'M') {
        //enlever le dernier caractère, ici le M
        onlyNumber = str.substring(0, str.length - 1)
        //convertir la string en nombre
        number = Number(onlyNumber)
        //multiplier le nombre
        number = number * 1000000
    }//K et k, donc mille ex: 33,3K = 33 300
    else if (str.slice(-1) == 'K' || str.slice(-1) == 'k') {
        onlyNumber = str.substring(0, str.length - 1)
        number = Number(onlyNumber)
        number = number * 1000
    }
    return number
}

//---------------------------------------------------------------------------------------------
//Partie 2

let listCountries = []

lifeExpectancy.forEach(row => {
    let countryData = {};
    countryData[row['country']] = row['2021']
    listCountries.push(countryData)
});
console.log(listCountries);

let margin2 = { top: 20, right: 20, bottom: 30, left: 50 },
    width2 = 650 - margin.left - margin.right,
    height2 = 2000 - margin.top - margin.bottom;

let svg2 = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom);

// Map and projection
let path = d3.geoPath();
let projection = d3.geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height2 / 2]);

// Data and color scale
let data = new Map();
let colorScale = d3.scaleThreshold()
    .domain([50, 60, 70, 80, 90, 100])
    .range(d3.schemeGreens[7]);

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (d) {
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(d.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set id
        .attr("id", function (d) { return d.properties.name; })
        .attr("fill", function (d) {
            let number = 0;
            listCountries.forEach(country => {
                if (typeof country[this.id] != "undefined") {
                    console.log(country[this.id]);
                    number = country[this.id]
                }
            })
            console.log(number);
            return colorScale(number);
        })
})


// Partie 3 - animations ------------------------------------------------------------------------------

// Récupère toutes les années
const annees = Object.keys(population[0])
// console.log(annees)

let pop = [],
    income = [],
    life = [],
    dataCombined = [];

// Merge data
const mergeByCountry = (a1, a2, a3) => {
    let data = [];
    a1.map(itm => {
        let newObject = {
            ...a2.find((item) => (item.country === itm.country) && item),
            ...a3.find((item) => (item.country === itm.country) && item),
            ...itm
        }
        data.push(newObject);
    })
    return data;
}

annees.forEach(annee => {
    pop.push({ "annee": annee, "data": converterSI(population, annee, "pop") })
    income.push({ "annee": annee, "data": converterSI(gdp, annee, "income") })
    life.push({ "annee": annee, "data": converterSI(lifeExpectancy, annee, "life") })
    const popAnnee = pop.filter(d => d.annee == annee).map(d => d.data)[0];
    const incomeAnnee = income.filter(d => d.annee == annee).map(d => d.data)[0];
    const lifeAnnee = life.filter(d => d.annee == annee).map(d => d.data)[0];
    dataCombined.push({ "annee": annee, "data": mergeByCountry(popAnnee, incomeAnnee, lifeAnnee) })
});
// console.log(dataCombined)

function converterSI(array, variable, variableName) {
    let convertedVariable = array.map(d => {
        // Trouver le format SI (M, B, k)
        let SI = typeof d[variable.toString()] === 'string' || d[variable.toString()] instanceof String ? d[variable.toString()].slice(-1) : d[variable.toString()];
        // Extraire la partie numérique
        let number = typeof d[variable.toString()] === 'string' || d[variable.toString()] instanceof String ? parseFloat(d[variable.toString()].slice(0, -1)) : d[variable.toString()];
        // Selon la valeur SI, multiplier par la puissance
        switch (SI) {
            case 'M': {
                return { "country": d.country, [variableName]: Math.pow(10, 6) * number };
                break;
            }
            case 'B': {
                return { "country": d.country, [variableName]: Math.pow(10, 9) * number };
                break;
            }
            case 'k': {
                return { "country": d.country, [variableName]: Math.pow(10, 3) * number };
                break;
            }
            default: {
                return { "country": d.country, [variableName]: number };
                break;
            }
        }
    })
    return convertedVariable;
};

// DÉVELOPPEMENT INDIVIDUEL :

d3.select("body")
    .append("div")
    .attr('id', 'graph')

let margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Générer une taille d'axe X cohérente
let theBiggestGDP = 0;
dataCombined.forEach(annee => {
    annee.data.forEach(pays => {
        if (pays.income >= theBiggestGDP) {
            theBiggestGDP = pays.income;
        }
    })
});

// Add X axis
let x = d3.scaleSqrt()
    .domain([0, theBiggestGDP])
    .range([0, width]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Générer une taille d'axe Y cohérente
let theBiggestLifeExp = 0;
dataCombined.forEach(annee => {
    annee.data.forEach(pays => {
        if (pays.life >= theBiggestLifeExp) {
            theBiggestLifeExp = pays.life;
        }
    })
});

// Add Y axis
let y = d3.scalePow()
    .exponent(1.25)
    .domain([0, theBiggestLifeExp * 1.1])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

// Add a scale for bubble size
let z = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([5, 60]);

// Variable où on stocke l'id de notre intervalle
let nIntervId;

function animate() {
    // regarder si l'intervalle a été déjà démarré
    if (!nIntervId) {
        nIntervId = setInterval(play, 1000);
    }
    console.log(nIntervId);
}

d3.select('body').append('h1').attr('id', 'anneeCourante')

let i = -1;
function play() {
    // Recommencer si à la fin du tableau
    if (i == 250) {
        i = 0;
    } else {
        i++;
    }

    d3.select('#anneeCourante').text(dataCombined[i].annee)
    updateChart(dataCombined[i]);
}

// Mettre en pause
function stop() {
    clearInterval(nIntervId);
    nIntervId = null;
}

// Fonction de mise à jour du graphique
function updateChart(data_iteration) {
    svg.selectAll('circle')
        .data(data_iteration.data)
        .join(enter => enter.append('circle')
            .attr("stroke", "black")
            .style("opacity", "0.7")
            .style("fill", `#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .attr('cx', function (d) { return x(d.income); })
            .attr('cy', function (d) { return y(d.life); }).transition(d3.transition()
                .duration(500)
                .ease(d3.easeLinear)).attr('r', function (d) { return z(d.pop); }),
            update => update.transition(d3.transition()
                .duration(500)
                .ease(d3.easeLinear))
                .attr('r', function (d) { return z(d.pop); })
                .attr('cx', function (d) { return x(d.income); })
                .attr('cy', function (d) { return y(d.life); }),
            exit => exit.remove())
}

animate();





        //     d3.select("body")
        //         .append("div")
        //         .attr('id', 'graph')

        //     let margin = { top: 10, right: 20, bottom: 30, left: 50 },
        //         width = 1000 - margin.left - margin.right,
        //         height = 600 - margin.top - margin.bottom;

        //     let svg = d3.select("#graph")
        //         .append("svg")
        //         .attr("width", width + margin.left + margin.right)
        //         .attr("height", height + margin.top + margin.bottom)
        //         .append("g")
        //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //     // Générer une taille d'axe X cohérente
        //     let theBiggestGDP = 0;
        //     gdp.forEach(pays => {
        //         let gdpAnneeCourante = pays['2021'];
        //         if (typeof gdpAnneeCourante === 'string') {
        //             gdpAnneeCourante = strToInt(pays['2021']);
        //         }
        //         pays['2021'] = gdpAnneeCourante;

        //         // Générer une taille d'axe X cohérente
        //         if (pays['2021'] >= theBiggestGDP) {
        //             theBiggestGDP = pays['2021'];
        //         }
        //     });

        //     // Add X axis
        //     let x = d3.scaleLinear()
        //         .domain([0, theBiggestGDP * 1.05])
        //         .range([0, width]);
        //     svg.append("g")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(d3.axisBottom(x));

        //     // Générer une taille d'axe Y cohérente
        //     let theBiggestLifeExp = 0;
        //     let theSmallestLifeExp = 0;
        //     console.log(lifeExpectancy);
        //     lifeExpectancy.forEach(pays => {
        //         if (pays['2021'] >= theBiggestLifeExp) {
        //             theBiggestLifeExp = pays['2021'];
        //         }
        //         theSmallestLifeExp = theBiggestLifeExp;
        //         if (pays['2021'] <= theSmallestLifeExp) {
        //             theSmallestLifeExp = pays['2021'];
        //         }
        //         if (pays['2021'] === null && pays['2020'] !== null) {
        //             pays['2021'] = pays['2020'];
        //         } else if (pays['2021'] === null && pays['2020'] === null) {
        //             pays['2021'] = pays['2019'];
        //         }
        //     })

        //     // Add Y axis
        //     let y = d3.scalePow()
        //         .exponent(1.5)
        //         .domain([0, theBiggestLifeExp * 1.1])
        //         .range([height, 0]);
        //     svg.append("g")
        //         .call(d3.axisLeft(y));

        //     population.forEach(pays => {
        //         let popAnneeCourante = pays['2021'];
        //         if (typeof popAnneeCourante === 'string') {
        //             popAnneeCourante = strToInt(pays['2021']);
        //         }
        //         pays['2021'] = popAnneeCourante;
        //     });

        //     // Add a scale for bubble size
        //     let z = d3.scaleLinear()
        //         .domain([200000, 1310000000])
        //         .range([5, 60]);

        //     // Add dots
        //     svg.append('g')
        //         .selectAll("dot")
        //         .data(gdp)
        //         .enter()
        //         .append("circle")
        //         .attr("cx", function (d) { return x(d["2021"]); })
        //         .attr("r", 10)
        //         .style("fill", `#${Math.floor(Math.random() * 16777215).toString(16)}`)
        //         .style("opacity", "0.7")
        //         .attr("stroke", "black")

        //     svg.selectAll("circle").data(lifeExpectancy).join()
        //         .attr("cy", function (d) { return y(d["2021"]); })

        //     svg.selectAll("circle").data(population).join()
        //         .attr("r", function (d) { return z(d["2021"]); })

        //     function strToInt(nb) {
        //         let multi;
        //         let number
        //         if (nb.slice(-1) === 'k') {
        //             multi = 1000;
        //             // console.log(gdpAnneeCourante + " ; c'est un k");
        //             number = nb.split('k')[0];
        //         } else if (nb.slice(-1) === 'M') {
        //             multi = 1000000;
        //             // console.log("c'est un M");
        //             number = nb.split('M')[0];
        //         } else if (nb.slice(-1) === 'B') {
        //             multi = 1000000000;
        //             // console.log("c'est un M");
        //             number = nb.split('B')[0];
        //         } else {
        //             // console.log('ça beug');
        //         }
        //         number = parseInt(number * multi);
        //         return number;

        //     };

//     })

//     .catch (function (error) {
//     console.log(error);
// })
