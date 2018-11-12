'use strict'
let gardens, corners, areas, or, sort, copyGardens;
let sz, ps;
let displaySize;

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
	
	displaySize = 5;
	createCanvas(400, 200);
	document.getElementById('defaultCanvas0').style.visibility = 'visible';
	background(100);
	
	algo();	//the algorithm to go through all the gardens in different orders
}

function algo() {
	let p = [0, 1, 2, 3];

	or = perm(p);
	
	
	// or = [
	// 	[0,1,2,3],
	// 	[1,2,0,3],
	// 	[1,3,2,0],
	// 	[3,2,1,0],
	// 	[2,3,1,0],
	// 	[3,0,2,1],
	// 	[0,2,3,1]
	// ];

	for (let o in or) {
		
		areas.push([		//manually set gardens
			{size : createVector(10, 15), pos : undefined, set : false},
			{size : createVector(10, 15), pos : undefined, set : false},
			{size : createVector(15, 10), pos : undefined, set : false},
			{size : createVector(15, 10), pos : undefined, set : false}
		]);
		corners = undefined;
		corners = [];
		corners.push(createVector(0,0));

		for (let z of or[o]) {					//set gardens in given order
			setElement(z,o);
		}

		for (let k in areas) {
		 	if ((checkSize(areas[k])[0] *checkSize(areas[k])[1]) >= (checkSize(areas[o])[0] *checkSize(areas[o])[1])) {
				areas.splice(k, 0, areas[o]);
				areas.pop();
		 		break;
		 	}
		}

	}
	let cons = 0;
	console.table(areas);
	display(areas[cons]);
	console.log(checkSize(areas[cons])[0] *checkSize(areas[cons])[1]);
}

function setElement(g, ind) {
	let minSize = Infinity;
	let delCorner = undefined;
	areas[ind][g].set = true;
	for (let c in corners) {
		//console.log(corners, c, corners[c]);
		areas[ind][g].pos = corners[c];
		if (checkSize(areas[ind])[0] *checkSize(areas[ind])[1] < minSize  && noOverlap(areas[ind], areas[ind][g])) {
			minSize = checkSize(areas[ind])[0] *checkSize(areas[ind])[1];
			delCorner = c;
		}
	}
	areas[ind][g].pos = corners[delCorner];
	//console.log("areas: " + ind + ", garden: " + g + ", posX: " +  areas[ind][g].pos.x + ", posY:" + areas[ind][g].pos.y);
	corners.splice(delCorner, 1);
	corners.push(createVector(areas[ind][g].pos.x + areas[ind][g].size.x, areas[ind][g].pos.y));
	corners.push(createVector(areas[ind][g].pos.x, areas[ind][g].pos.y + areas[ind][g].size.y));
}


function noOverlap(are, g) {
	for (let a of are) {
		if (a == g) continue;
		if (a.pos != undefined) {
			//console.log("a--  posX: " +  a.pos.x + ", posY:" + a.pos.y + ", sizeX: " + a.size.x + ", sizeY: " + a.size.y);
			//console.log("g--  posX: " +  g.pos.x + ", posY:" + g.pos.y + ", sizeX: " + g.size.x + ", sizeY: " + g.size.y);
			if (g.pos.y < (a.pos.y +a.size.y) && (g.pos.x +g.size.x) > a.pos.x && g.pos.x < (a.pos.x +a.size.x)) return(false);
			if (g.pos.x < (a.pos.x +a.size.x) && (g.pos.y +g.size.y) > a.pos.y && g.pos.y < (a.pos.y +a.size.y)) return(false);
		}
	}
	return(true);
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
	
	return([r, b]);
}

function perm(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

function display(ar) {		//displays the area of all gardens
	background(100);
	translate(width /2 -(checkSize(ar)[0] /2 *displaySize), height /2 -(checkSize(ar)[1] /2 *displaySize));
	fill(255, 0, 0);
	rect(0, 0, checkSize(ar)[0] *displaySize, checkSize(ar)[1] *displaySize)
	fill(0, 255, 0);
	for (let g of ar){
		if (g.set) {
			rect(g.pos.x *displaySize, g.pos.y *displaySize, g.size.x *displaySize, g.size.y *displaySize);
		}
	}

}