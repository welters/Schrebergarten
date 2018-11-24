'use strict'
let gardens, xVal, areas, or;
let displaySize;

let minSize;
let displayArea, displayGardenList;

function setup() {
	gardens = [		//manually set gardens
		{size : createVector(15, 25), pos : undefined, set : false},
		{size : createVector(30, 15), pos : undefined, set : false},
		{size : createVector(25, 15), pos : undefined, set : false},
		{size : createVector(20, 25), pos : undefined, set : false}
	];
	
	areas = [];				//Array for areas with all different
	or = [];					//Array of strings for the order the gardens are set
	
	displaySize = 4;

	createCanvas(windowWidth, windowHeight);
	background(200);
	displayArea = createGraphics(width /2, height /2);
	displayArea.background(100);
	displayGardenList = createGraphics(width /2, height /8)
	displayGardenList.background(100);

	algo();	//the algorithm to go through all the gardens in different orders
}

function algo() {
	or = [];
	for (let g in gardens) or.push(g);

	or = perm(or);

	for (let o in or) {
		
		xVal = [0];									//first x-value is 0
		minSize = Infinity;					//minimal Size of all gardens set is as high as possible = infinity
		areas.push([]);							//new array for the positions of the gardens is set
		setElement(0, o/*the index of the array for the order of the gardens*/, []/*array for the positions of th gardens*/, 0/*maximal y-value*/);
		//set garden the first garden in the order of the array or[o]

		for (let a in  areas) {
			if (a == areas.length -1) break;
			if (areas[a] == areas[areas.length -1]) {
				areas.pop();
				or.splice(o, 1);
			}
			if (finalCheckSize(areas[a], "size", a) > finalCheckSize(areas[areas.length -1], "size", areas.length -1)) {
				areas.splice(a, 0, areas[areas.length -1]);
				or.splice(a, 0, or[o]);
				or.splice(o,1);
				areas.pop();
				break;
			}
		}

	}

	let cons = 0;
	console.table(areas);
	displayGardens(cons);
	displayLayout();
	console.log(finalCheckSize(areas[cons], "size", cons));
	console.log(finalCheckSize(areas[cons], "r", cons));
	console.log(finalCheckSize(areas[cons], "b", cons));
}

function setElement(i, o, sA, maxYVal) {
	let yVal;																		//position y of the garden
	let g = or[o][i];
	for (let x of xVal) {												//loops through all the possible x-positions
		yVal = findYVal(gardens[g], x, maxYVal);	//finds the y-position to the x-position by dropping down at the x-value (like Tetris)
		if (maxYVal < yVal + gardens[g].size.y)	maxYVal = yVal + gardens[g].size.y;	//sets new highest point of the gardens
		gardens[g].pos = createVector(x, yVal);		//sets the new position
		gardens[g].set = true;										
		sA.push(gardens[g].pos);									//pushes the new position in the array
		xVal.push(gardens[g].pos.x +gardens[g].size.x);	//pushes the new possible x-position
		if (or[o][i+1] != undefined) {						//if the garden, just set, was not the last existing garden
			setElement(i+1, o, sA, maxYVal)					//a next garden is set to the existing gardens with the same process
		} else if (minSize > checkSize(gardens, "size")) {	
//if it was the last garden and the size of the rectangular area all the gardens need is smaller, than the size of the smallest area
			minSize = checkSize(gardens, "size");		//the new minimal size is the size of the new area
			areas[o] = sA.slice();									//the positions of the gardens get copied into the area array
			
		}
		sA.pop();																	//the last set position gets deleted
		xVal.pop();																//the last set x-position gets deleted
		gardens[g].pos = undefined;								//the garden gets unset
		gardens[g].set = false;
	}
	
}

function findYVal(gard, xV, maxYVal) {
	for (let yV = maxYVal; yV >= 0; yV--) {
		for (let g of gardens) {
			if (!g.set || g == gard) continue;	//goes t the next loop if g is the garden we are testing the collision with
			//checks if there is a collission with another garden
			if ((yV <= g.pos.y +g.size.y) && (
			(xV < g.pos.x +g.size.x && xV >= g.pos.x)||
			(xV +gard.size.x <= g.pos.x +g.size.x && xV +gard.size.x > g.pos.x)||
			(g.pos.x < xV +gard.size.x && g.pos.x >= xV)||
			(g.pos.x +g.size.x <= xV +gard.size.x && g.pos.x +g.size.x > xV)
			)) {
				return(yV);			//returns the found y-value
			}
		}
	}
	return(0);						//if it was the first garden it returns 0 ecause there could not be a collission
}

function finalCheckSize(pos, ret, n) {
	for (let g in gardens) {
		gardens[or[n][g]].pos = pos[g].copy();
	}
	let size = checkSize(gardens, ret);
	for (let g of gardens) {
		g.pos = undefined;
	}
	return(size);
}

function checkSize(a, ret) {
	let edges = [];					//Array for all edges
	let r, b;						//the most right and bottom edge

	for (let g of a) {				//loops through all the gardens, which are set
		edges.push(g.pos.copy().add(g.size));

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

function displayLayout() {
	let tP;
	let dP = 3;
	tP = 10;
	displayGardenList.background(100).fill(0, 255, 0);
	for (let g of gardens) {
		displayGardenList.rect(tP , 5, g.size.x *dP, g.size.y *dP);
		tP += 10 +g.size.x *dP;
	}
	image(displayGardenList, width /4, height /16);

	image(displayArea, width /2 -displayArea.width /2, height /2 - displayArea.height /2);
}

function displayGardens(ar) {		//displays the area of all gardens
	let gO;
	let gPos = areas[ar];
	let r = finalCheckSize(gPos, "r", ar);
	let b = finalCheckSize(gPos, "b", ar);

	let tP = createVector(displayArea.width /2 - r *displaySize /2, displayArea.height /2 - b *displaySize /2);

	console.log(gPos);
	displayArea.background(100).strokeWeight(1).fill(255, 0, 0, 50).stroke(255, 0, 0);
	displayArea.rect(tP.x, tP.y, r *displaySize, b *displaySize);
	displayArea.strokeWeight(2).stroke(0).fill(0, 255, 0);
	for (let gP in gPos){
		gO = gardens[or[ar][gP]];
		console.log(gO);
		displayArea.rect(tP.x + gPos[gP].x *displaySize, tP.y + gPos[gP].y *displaySize, gO.size.x *displaySize, gO.size.y *displaySize);
	}

}