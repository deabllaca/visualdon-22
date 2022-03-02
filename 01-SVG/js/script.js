// var element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName[options]);

// // variable for the namespace 
// const svgns = "http://www.w3.org/2000/svg";

// // make a simple rectangle
// let newRect = document.createElementNS(svgns, "rect");

// //Identify the element and print it to the console
// var theSVG = document.querySelector("#monSVG");
// console.log("This is the result of the document.querySelector(\"#mySVG\") instruction.");
// console.log(theSVG);

// //Identify the circles
// var leRectangle = document.querySelectorAll("#monSVG rect");
// console.log("This is the result of the document.querySelectorAll(\"#mySVG circle\") instruction.");

// console.log(leRectangle);

function domForEach(selector, callback) {
    document.querySelectorAll(selector).forEach(callback);
}

function domOn(selector, event, callback) { // va ajouter des PARAMèTRES SUPPLéMENTAIRES au callback qui sera addEventListener
    domForEach(selector, element => element.addEventListener(event, callback));
}

function isOdd(num) {
    if (num % 2 == true) {
    }
    return num % 2;
}


domOn('.rectangle', 'click', evt => {
    const monRectangle = evt.target;
    const color = monRectangle.getAttribute('fill');

    if (color == "black") {
        monRectangle.setAttribute('fill', 'blue');

    } else {
        monRectangle.setAttribute('fill', 'black');

    }

})


domOn('.trou-donut', 'mouseover', evt => {
    const monDonut = evt.target;
    console.log(monDonut);
    const rayon = monDonut.getAttribute('r');
    if (rayon <= 60) {
        monDonut.setAttribute('r', rayon * 2)
    } else {
        monDonut.setAttribute('r', rayon * 0.5)
    }

});