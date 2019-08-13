var debug = false;
var showWrong = true;
var gridObject = [];
var displayPercentage = 0.5;
const boards = [
	'abcdefghidefghiabcghiabcdefcdefghiabfghiabcdeiabcdefghbcdefghiaefghiabcdhiabcdefg',
	'abcfdhiegdefcigahbghiebacdfefdghcbaibiadefhgchcgiabdfecghbfdeiafaehcigbdidbagefch'
];


function start() {
	displayPercentage = debug ? 1 : displayPercentage;
	generateData();
	generateGrid();
}

function generateData() {
	// Grab a board from the list of boards
	let grid = parseBoardString(boards[getRandomIntInclusive(0,boards.length-1)]);

	// Shuffle the grid
	let shuffleNumber = debug ? 0 : 10000;
	for (let i=0; i<shuffleNumber; i++) {
		let permutation = getRandomIntInclusive(1,4);
		switch (permutation) {
			case 1:	// Swap
				grid = swapHandler(grid);
				break;
			case 2:	// Transpose
				grid = transpose(grid);
				break;
			case 3:	// Rotate
				grid = rotate(grid);
				break;
			case 4: // Mirror
				grid = mirror(grid);
				break;
			default:
				console.log('Error in shuffling, default case reached.');
				break;
		}
	}

	// Replace letters with random numbers
	let swapElements = ['a','b','c','d','e','f','g','h','i'];
	if (!debug) swapElements = shuffleArray(swapElements);
	if (debug) console.log('Elements: '+swapElements);
	for (let i=0; i<grid.length; i++) {
		for (let j=0; j<grid[i].length; j++) {
			for (let k=0; k<swapElements.length; k++) {
				if (grid[i][j] == swapElements[k]) {
					grid[i][j] = k+1;
				}
			}
		}
	}

	// Generate usable array of data
	for (let i=0; i<grid.length; i++) {
		let row = [];
		for (let j=0; j<grid[i].length; j++) {
			row.push({value: grid[i][j], defaultShown: isVisible(displayPercentage)});
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
					cell.type = 'text';
					cell.className = 'cell';
					cell.min = 1;
					cell.max = 9;
					cell.maxLength = 1;
					cell.setAttribute('band', i);
					cell.setAttribute('stack', j);
					cell.setAttribute('row', 3*i+k);
					cell.setAttribute('col', 3*j+l);
					cell.setAttribute('onkeypress', 'preventNonNumericalInput(event)');
					cell.setAttribute('onkeyup', 'checkCorrect(this)');
					
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
function parseBoardString(text) {
	let matrix = [];
	let size = Math.sqrt(text.length);
	if (debug) console.log(text);

	if (size%1 != 0) {
		console.log('Improper board detected: '+text);
		return;
	}

	for (let i=0; i<size; i++) {
		matrix.push([...text.slice(size*i,size*i+size)]);
	}

	return matrix;
}
function swapHandler(matrix) {
	switch (getRandomIntInclusive(1,4)) {	// Choose what we are swapping
		case 1:	// Swap bands
			matrix = swapBands(matrix);
			break;
		case 2:	// Swap stacks
			matrix = swapStacks(matrix);
			break;
		case 3:	// Swap rows
			matrix = swapRows(matrix);
			break;
		case 4:	// Swap columns
			matrix = swapCols(matrix);
			break;
		default:
			break;
	}
	return matrix;
}
function swapBands(matrix) {
	let band1 = getRandomIntInclusive(0,2);
	let band2 = band1%3==2 ? band1-2 : band1+1;
	if (debug) console.log('Swapping bands '+band1+' & '+band2);
	let temp1 = matrix[band1*3+0];
	let temp2 = matrix[band1*3+1];
	let temp3 = matrix[band1*3+2];
	matrix[band1*3+0] = matrix[band2*3+0];
	matrix[band1*3+1] = matrix[band2*3+1];
	matrix[band1*3+2] = matrix[band2*3+2];
	matrix[band2*3+0] = temp1;
	matrix[band2*3+1] = temp2;
	matrix[band2*3+2] = temp3;

	return matrix;
}
function swapStacks(matrix) {
	matrix = transpose(matrix);
	matrix = swapBands(matrix);
	matrix = transpose(matrix);

	return matrix;
}
function swapRows(matrix) {
	let row1 = getRandomIntInclusive(0,8);
	let row2 = row1%3==2 ? row1-2 : row1+1;
	if (debug) console.log('Swapping rows '+row1+' & '+row2);
	let temp = matrix[row1];
	matrix[row1] = matrix[row2];
	matrix[row2] = temp;

	return matrix;
}
function swapCols(matrix) {
	matrix = transpose(matrix);
	matrix = swapRows(matrix);
	matrix = transpose(matrix);

	return matrix;
}
function transpose(matrix) {
	if (debug) console.log('Transposing');
	const tempGrid = matrix;
	matrix = [];
	
	for (let i=0; i<tempGrid.length; i++) {
		let row = [];
		for (let j=0; j<tempGrid[i].length; j++) {
			row.push(tempGrid[j][i]);
		}
		matrix.push(row);
	}
	return matrix;
}
function rotate(matrix) {
	const n = matrix.length;
	const x = Math.floor(n/ 2);
	const y = n - 1;
	const rotations = getRandomIntInclusive(1,3);
	if (debug) console.log('Rotating '+rotations+' times');
	for (let r=0; r<rotations; r++) {
		for (let i=0; i<x; i++) {
			for (let j=i; j<y-i; j++) {
				k = matrix[i][j];
				matrix[i][j] = matrix[y-j][i];
				matrix[y-j][i] = matrix[y-i][y-j];
				matrix[y-i][y-j] = matrix[j][y-i];
				matrix[j][y-i] = k;
			}
		}
	}

	return matrix;
}
function mirror(matrix) {
	let direction = getRandomIntInclusive(0,1);
	switch (direction) {
		case 0:	// Vertical
			if (debug) console.log('Mirroring vertically');
			matrix.reverse();
			break
		case 1:	// Horizontal
			if (debug) console.log('Mirroring horizontally');
			for (let i=0; i<matrix.length; i++) {
				matrix[i].reverse();
			}
			break;
	}

	return matrix;
}
function isVisible(rate) {
	// Return true at the passed rate
	return Math.random() < rate;
}

function shuffleArray(array) {
	let currentIndex = array.length;
	let temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function checkCorrect(t) {
	if (showWrong) {
		let v = parseInt(t.value);
		let r = parseInt(t.getAttribute('row'));
		let c = parseInt(t.getAttribute('col'));

		if (v == gridObject[r][c].value) {
			t.classList.remove('incorrect');
		}
		else {
			t.classList.add('incorrect');
		}
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