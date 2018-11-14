'use strict'
let gardens, xVal, maxYVal, areas, or, sort, copyGardens;
let sz, ps;
let displaySize;

let minSize;

function setup() {
	gardens = [		//manually set gardens
		{size : createVector(10, 20), pos : undefined, set : false},
		{size : createVector(15, 25), pos : undefined, set : false},
		{size : createVector(5, 10), pos : undefined, set : false},
		{size : createVector(30, 10), pos : undefined, set : false}
	];
	
	areas = [];				//Array for areas with all different
	or = [];					//Array of strings for the order the gardens are set
	
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
		
		xVal = [];
		xVal.push(0);
		maxYVal = 0;
		minSize = Infinity;	
		areas.push([]);
		areas[o].push(createVector(0, 0));
		setElement(0, o);		//set position of gardens in given order


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

function setElement(i, o) {
	let yVal;
	let g = or[o][i];
	for (let x of xVal) {
		yVal = findYVal(gardens[g], x);
		gardens[g].pos = createVector(x, yVal);
		gardens[g].set = true;
		xVal.push(gardens[g].pos.x +gardens[g].size.x);
		if (or[o][i+1] != undefined) {
			setElement(i+1)
		} else {
			if (minSize >= checkSize(gardens, "size")) {
				minSize = checkSize(gardens, "size");
				areas[o].push(gardens[g].pos.copy());
			}
		}
		gardens[g].pos = undefined;
		gardens[g].set = false;
		
	}
	
}

function findYVal(gard, xV) {
	for (let y = yVal; y >= 0; y--) {
		for (let g of gardens) {
			if ((yVal <= g.pos.y +g.size.x) && (
			(xV < g.pos.x +g.size.x && xV >= g.pos.x)||
			(xV +gard.size.x <= g.pos.x +g.size.x && xV +gard.size.x > g.pos.x)||
			(g.pos.x <= xV +gard.size.x && g.pos.x > xV)||
			(g.pos.x +g.size.x < xV +gard.size.x && g.pos.x +g.size.x >= xV)
			)) {
				return(y);
			}
		}
	}
	return(0);
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