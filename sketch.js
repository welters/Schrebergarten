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
	createCanvas(windowWidth, windowHeight);
	document.getElementById('defaultCanvas0').style.visibility = 'visible';
	background(100);
	
	algo();	//the algorithm to go through all the gardens in different orders
}

function algo() {
	let p = [0, 1, 2, 3];

	or = perm(p);

	for (let o in or) {
		
		areas.push([		//manually set gardens
			{size : createVector(25, 15), pos : undefined, set : false},
			{size : createVector(15, 30), pos : undefined, set : false},
			{size : createVector(15, 25), pos : undefined, set : false},
			{size : createVector(25, 20), pos : undefined, set : false}
		]);
		corners = undefined;
		corners = [];
		corners.push(createVector(0,0));

		for (let z of or[o]) {					//set position of gardens in given order
			setElement(z,o);
		}

		for (let k in areas) {
		 	if (checkSize(areas[k], "size") >= checkSize(areas[o], "size")) {
				areas.splice(k, 0, areas[o]);
				areas.pop();
		 		break;
		 	}
		}

	}
	let cons = 22;
	//console.table(areas);
	display(areas[cons]);
	console.log(checkSize(areas[cons], "size"));
}

function setElement(g, ind) {
	let minSize = Infinity;			//defines and sets the minSize to infinity so the the firstly checked size is always smaller
	let delCorner = undefined;		//later the corner, which will be deleted and the position of the garden is set to
	let aI = areas[ind];			//just to short the code
	aI[g].set = true;
	for (let c in corners) {		//loops through all the corners (possible positions for the garden)
		aI[g].pos = corners[c];		//position of garden set to one of the corners
		if (checkSize(aI, "size") < minSize  && noOverlap(aI, aI[g])) {
			minSize = checkSize(aI, "size");
			delCorner = c;
		}
	}
	aI[g].pos = corners[delCorner];	//podition id now the one with the less used space
	corners.splice(delCorner, 1);	//corner has to be deleted for the next gardens
	corners.push(createVector(aI[g].pos.x + aI[g].size.x, aI[g].pos.y));	//push new corners to the edges of the garden we just set
	corners.push(createVector(aI[g].pos.x, aI[g].pos.y + aI[g].size.y));	//	"	"
}


function noOverlap(land, g) {		//checks for a possible overlapping of two gardens
	for (let a of land) {			//loops trough the gardens
		if (a == g) continue;		//don't compare the same object
		if (a.pos != undefined) {	//garden has to have a position
			if (g.pos.y < (a.pos.y +a.size.y) && (g.pos.x +g.size.x) > a.pos.x && g.pos.x < (a.pos.x +a.size.x)) return(false);
			if (g.pos.x < (a.pos.x +a.size.x) && (g.pos.y +g.size.y) > a.pos.y && g.pos.y < (a.pos.y +a.size.y)) return(false);
		}
	}
	return(true);
}


function checkSize(a, ret) {
	let edges = [];					//Array for all edges
	let r, b;						//the most right and bottom edge

	for (let g of a) {				//loops through all the gardens, which are set
		if (g.set) edges.push(g.pos.copy().add(g.size));

	}

	//find the most right edge and save in variable r
	r = 0;
	for (let e in edges) {			
		if (edges[e].x > r) {
			r = edges[e].x;
		}
	}
	//find the most bottom edge and save in variable b
	b = 0;
	for (let e in edges) {
		if (edges[e].y > b) {
			b = edges[e].y;
		}
	}
	
	if (ret == "size") return(r *b);	//return the size of the rectangle arround the gardens
	if (ret == "r") return(r);			//return the value of the most right edge
	if (ret == "b") return(b);			//return the value of the most bottom edge
}

function perm(xs) {						//algorithm to get all possible orders to set the gardens (permutations)
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
	let tp = createVector(width /2 -(checkSize(ar, "r") /2 *displaySize), height /2 -(checkSize(ar, "b") /2 *displaySize));
	fill(255, 0, 0);
	rect(tp.x, tp.y, checkSize(ar, "r") *displaySize, checkSize(ar, "b") *displaySize)
	fill(0, 255, 0);
	for (let g of ar){
		if (g.set) {
			rect(tp.x +g.pos.x *displaySize, tp.y +g.pos.y *displaySize, g.size.x *displaySize, g.size.y *displaySize);
		}
	}

}