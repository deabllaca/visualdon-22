// var element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName[options]);

// // variable for the namespace 
// const svgns = "http://www.w3.org/2000/svg";

// // make a simple rectangle
// let newRect = document.createElementNS(svgns, "rect");

//Identify the element and print it to the console
var theSVG = document.querySelector("#monSVG");
console.log("This is the result of the document.querySelector(\"#mySVG\") instruction.");
console.log(theSVG);

//Identify the circles
var leRectangle = document.querySelectorAll("#monSVG rect");
console.log("This is the result of the document.querySelectorAll(\"#mySVG circle\") instruction.");

console.log(leRectangle);