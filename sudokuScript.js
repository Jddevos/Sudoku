var grid = [];
var gridObject = [];

function start() {
	generateData();
	generateGrid();
}

function generateData() {
	// https://gamedev.stackexchange.com/questions/56149/how-can-i-generate-sudoku-puzzles
	grid = [
		[1,2,3,4,5,6,7,8,9],
		[7,8,9,1,2,3,4,5,6],
		[4,5,6,7,8,9,1,2,3],
		[3,4,5,6,7,8,9,1,2],
		[9,1,2,3,4,5,6,7,8],
		[6,7,8,9,1,2,3,4,5],
		[2,3,4,5,6,7,8,9,1],
		[8,9,1,2,3,4,5,6,7],
		[5,6,7,8,9,1,2,3,4]		
	];	// Prepopulate the grid

	// Shuffle the grid
	for (let i=0; i<10000; i++) {
		switch (getRandomIntInclusive(1,2)) {
			case 1:	// Swap
				swapHandler();
				break;
			case 2:	// Transpose
				transpose();
				break;
			case 3:	// Rotate
				break;
			case 4: // Mirror
				break;
			default:
				console.log('Error in shuffling, default case reached.');
				break;
		}
	}

	// Generate usable array of data
	for (let i=0; i<grid.length; i++) {
		let row = [];
		for (let j=0; j<grid[i].length; j++) {
			row.push({value: grid[i][j], defaultShown: getRandomIntInclusive(0,1)});
		}
		gridObject.push(row);
	}
}

function generateGrid() {
	let gridDiv = document.getElementById('grid');
	gridDiv.innerHTML = '';

	for (let i=0; i<3; i++) {   // 3 bands of blocks
		let bandDiv = document.createElement('div');
		bandDiv.classList.add('band');

		for (let j=0; j<3; j++) {   // 3 stacks of blocks
			let blockDiv = document.createElement('div');
			blockDiv.id = 'block_'+i+j;
			blockDiv.classList.add('block', 'band_'+i, 'stack_'+j);

			for (let k=0; k<3; k++) {   // 3 rows per block
				let rowDiv = document.createElement('div');

				for (let l=0; l<3; l++) {   // 3 cols per block 
					let cell = document.createElement('input');
					// ijkl makes a unique base3 code for each cell
					cell.id = 'cell_'+i+j+k+l;
					cell.type = 'number';
					cell.className = 'cell';
					cell.min = 1;
					cell.max = 9;
					cell.maxLength = 1;
					cell.setAttribute('band', i);
					cell.setAttribute('stack', j);
					cell.setAttribute('row', 3*i+k);
					cell.setAttribute('col', 3*j+l);
					cell.setAttribute('onkeypress', 'preventNonNumericalInput(event)');
					cell.setAttribute('onkeyup', 'limitInputLength(event, this)');
					cell.setAttribute('onkeydown', 'limitInputLength(event, this)');
					
					if (gridObject[3*i+k][3*j+l].defaultShown) {
						cell.value = gridObject[3*i+k][3*j+l].value;
						cell.classList.add('default');
					}
					rowDiv.appendChild(cell);
				}
				blockDiv.appendChild(rowDiv);
			}
			bandDiv.appendChild(blockDiv);
		}
		gridDiv.appendChild(bandDiv);
	}
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
function swapHandler() {
	switch (getRandomIntInclusive(1,4)) {	// Choose what we are swapping
		case 1:	// Swap bands
			swapBands();
			break;
		case 2:	// Swap stacks
			swapStacks();
			break;
		case 3:	// Swap rows
			swapRows();
			break;
		case 4:	// Swap columns
			swapCols();
			break;
		default:
			break;
	}
}
function swapBands() {
	let band1 = getRandomIntInclusive(0,2);
	let band2 = band1%3==2 ? band1-2 : band1+1;
	// console.log(band1+' '+band2);
	let temp1 = grid[band1*3+0];
	let temp2 = grid[band1*3+1];
	let temp3 = grid[band1*3+2];
	grid[band1*3+0] = grid[band2*3+0];
	grid[band1*3+1] = grid[band2*3+1];
	grid[band1*3+2] = grid[band2*3+2];
	grid[band2*3+0] = temp1;
	grid[band2*3+1] = temp2;
	grid[band2*3+2] = temp3;
}
function swapStacks() {
	transpose();
	swapBands();
	transpose();
}
function swapRows() {
	let row1 = getRandomIntInclusive(0,8);
	let row2 = row1%3==2 ? row1-2 : row1+1;
	// console.log(row1+' '+row2);
	let temp = grid[row1];
	grid[row1] = grid[row2];
	grid[row2] = temp;
}
function swapCols() {
	transpose();
	swapRows();
	transpose();
}
function transpose() {
	const tempGrid = grid;
	grid = [];
	
	for (let i=0; i<tempGrid.length; i++) {
		let row = [];
		for (let j=0; j<tempGrid[i].length; j++) {
			row.push(tempGrid[j][i]);
			// console.log('Setting grid['+i+']['+j+'] to '+tempGrid[j][i]);
		}
		grid.push(row);
	}
}

function preventNonNumericalInput(e) {
	e = e || window.event;
	var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
	var charStr = String.fromCharCode(charCode);
  
	if (!charStr.match(/^[0-9]$/)) {
		e.preventDefault();
	}
}
function limitInputLength(e, t) {
	let lengthLimit = 1;
	if (t.value.length > lengthLimit) {
		t.value = t.value.substring(0, lengthLimit);
 	}
}

