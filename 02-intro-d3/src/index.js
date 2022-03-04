import * as d3 from 'd3';

//Fonctions pour les événements
function domForEach(selector, callback) {
    document.querySelectorAll(selector).forEach(callback);
}

function domOn(selector, event, callback) {
    domForEach(selector, element => element.addEventListener(event, callback));
}

//Création du canva SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 600)
    .style('background-color', 'transparent')


//Création d'un groupe qui va comporter les cercles et les textes
const group1 = svg.append("g")
    .append("svg")

const group2 = svg.append("g")
    .append("svg")

const group3 = svg.append("g")
    .append("svg")


//Création des textes liés au groupes
const text1 = group1.append("text")
    .attr("x", "60")
    .attr("y", "100")
    .text("hello world!")

const text2 = group2.append("text")
    .attr("x", "160")
    .attr("y", "200")
    .text("Ensuite ici!")

const text3 = group3.append("text")
    .attr("x", "190")
    .attr("y", "305")
    .text("Clique d'abord ici.")



//Création des cercles liés au groupes
const circle1 = group1.append("circle")
    .attr("cx", "50")
    .attr("cy", "50")
    .attr("r", "40")
    .attr("transform", "translate (50,0)")

const circle2 = group2.append("circle")
    .attr("cx", "200")
    .attr("cy", "150")
    .attr("r", "40")
    .attr("fill", "#E92528")

const circle3 = group3.append("circle")
    .attr("cx", "250")
    .attr("cy", "250")
    .attr("r", "40")


//Pour aligner les cercles verticalement (mais cela ne va pas bouger les textes)
circle3.on("click", () => {
    circle1.attr("cx", 350);
    circle2.attr("cx", 400);
    circle3.attr("cx", 400);
})

//Pour aligner les groupes ENTIERS quand nos append n'ont pas les mêmes variables
group2.on("click", () => {
    group1.attr("transform", "translate (200,0)")
    group2.attr("transform", "translate (100,0)")
    group3.attr("transform", "translate (100,0)")
})




//Création d'un groupe pour notre histogramme de rectangles selon les hauteurs ci-dessous
const data = [20, 5, 25, 8, 15]

const canvaRectangle = d3.select("body")
    .append("svg")


//     .append("g")
//     .attr("class", "div-rect")

// const


// const rect = group4.append("rect");

// rect.selectAll("rect")
//     .data(data)
//     .enter()
//     .append("rect")
//     .text(d => d)



//     d3.select("body")
//         .append("div")
//         .attr("class", "div-rect")
    
//     const svgRect = d3.select(".div-rect")
//         .append("svg")
//         .attr("class", "svg-rect")
//         .attr("width", 300)
//         .attr("height", 300)
    
//     svgRect.selectAll(".svg-rect")
//         .data(data)
//         .enter()
//         .append("rect")
//         .attr("class", "rects")
//         .attr("x", (d, i) => i * 30)
//         .attr("y", (d, i) => parseInt(svgRect.attr("height")) - d)
//         .attr("width", 20)
//         .attr("height", (d => d))

// // const group4 = svg.append("g")
// //     .append("rect")

// // // const rect = group4.append("rect");

// // group4.selectAll("rect")
// //     .data(hauteur)
// //     .enter()
// //     .append("li")
// //     .text(d => d)

// //     // .attr("x", "250")
//     // .attr("cy", "250")
//     // .attr("r", "40")

// // const groupeHistogramme = svg.append("rectangle")
// //     .append("svg")

// // const hauteur = [20, 5, 25, 8, 15]


// // rect.selectAll("rectangle")
// //     .data(hauteur)
// //     .enter()
// //     .append("rectangle")
// //     .text(d => d)
