'use strict'
let gardens, corners, areas, or, sort, copyGardens;
let sz, ps;

function setup() {
	gardens = [		//manually set gardens
		{size : createVector(10, 20), pos : undefined, set : false},
		{size : createVector(15, 25), pos : undefined, set : false},
		{size : createVector(5, 10), pos : undefined, set : false},
		{size : createVector(30, 10), pos : undefined, set : false}
	];
	
	areas = [];				//Array for areas with all different
	corners = [];			//Array for the corners
	or = [];					//Array of strings for the order the gardens are set
	copyGardens = [];
	
	createCanvas(400, 200);
	document.getElementById('defaultCanvas0').style.visibility = 'visible';
	background(100);
	
	algo();	//the algorithm to go through all the gardens in different orders
}

function algo() {

	
	
	or = [
		[0,1,2,3],
		[1,2,0,3],
		[1,3,2,0],
		[3,2,1,0],
		[2,3,1,0],
		[3,0,2,1],
		[0,2,3,1]
	];

	for (let o in or) {
		
		areas.push([		//manually set gardens
			{size : createVector(10, 20), pos : undefined, set : false},
			{size : createVector(15, 25), pos : undefined, set : false},
			{size : createVector(5, 10), pos : undefined, set : false},
			{size : createVector(30, 10), pos : undefined, set : false}
		]);
		corners = undefined;
		corners = [];
		corners.push(createVector(0,0));

		for (let z of or[o]) {					//set gardens in given order
			setElement(z,o);
		}

		for (let k in areas) {
		 	if (checkSize(areas[k]) >= checkSize(areas[o])) {
				areas.splice(k, 0, areas[o]);
				areas.pop();
		 		break;
		 	}
		}

	}
	console.table(areas);
	display(areas[1]);
	console.log(checkSize(areas[1]));
}

function setElement(g, ind) {
	let minSize = Infinity;
	let delCorner = undefined;
	console.log(g);
	areas[ind][g].set = true;
	for (let c in corners) {
		//console.log(corners, c, corners[c]);
		areas[ind][g].pos = corners[c];
		if (checkSize(areas[ind]) < minSize) {
			minSize = checkSize(areas[ind]);
			delCorner = c;
		}
	}
	areas[ind][g].pos = corners[delCorner];
	console.log("areas: " + ind + ", garden: " + g + ", posX: " +  areas[ind][g].pos.x + ", posY:" + areas[ind][g].pos.y);
	corners.splice(delCorner, 1);
	corners.push(createVector(areas[ind][g].pos.x + areas[ind][g].size.x, areas[ind][g].pos.y));
	corners.push(createVector(areas[ind][g].pos.x, areas[ind][g].pos.y + areas[ind][g].size.y));
}



function checkSize(a) {
	let edges = [];
	let r, b; // the most right and bottom edge

	for (let g of a) {
		if (g != undefined) {
			if (g.set) {
			edges.push(g.pos.copy().add(g.size));
			}
		}
	}

	//right edge
	r = 0;
	for (let e in edges) {
		if (edges[e].x > r) {
			r = edges[e].x;
		}
	}
	//bottom edge
	b = 0;
	for (let e in edges) {
		if (edges[e].y > b) {
			b = edges[e].y;
		}
	}
	
	return(r*b);
}

function display(ar) {		//displays the area of all gardens
	background(100);
	for (let g of ar){
		if (g.set) {
			rect(g.pos.x, g.pos.y, g.size.x, g.size.y);
		}
	}
}