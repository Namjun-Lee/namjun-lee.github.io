// Array to store the positions of puzzle pieces
let positions = [];

// Store the original order of the puzzle pieces
const correctPositions = [];

// Initialize the puzzle
function createPuzzle() {
    const puzzleContainer = document.getElementById('puzzle-container');
    const imageSrc = 'puzzle-image.jpg'; // Your custom image
    let pieceNumber = 1;

    // Create 16 puzzle pieces for a 4x4 grid
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.style.backgroundImage = `url(${imageSrc})`;

            // Position each piece correctly using background positions
            piece.style.backgroundPosition = `${-col * 100}px ${-row * 100}px`;
            piece.dataset.position = pieceNumber; // Keep track of the correct position
            piece.setAttribute('draggable', true);
            piece.id = `piece-${pieceNumber}`;
            correctPositions.push(pieceNumber);
            positions.push(pieceNumber); // Initialize positions in correct order

            piece.addEventListener('dragstart', dragStart);
            piece.addEventListener('drop', dropPiece);
            piece.addEventListener('dragover', allowDrop);

            puzzleContainer.appendChild(piece);
            pieceNumber++;
        }
    }
}

// Shuffle the puzzle pieces
function shufflePuzzle() {
    const puzzleContainer = document.getElementById('puzzle-container');
    let pieces = Array.from(puzzleContainer.children);

    // Shuffle the pieces randomly
    positions = positions.sort(() => Math.random() - 0.5);
    pieces.forEach((piece, index) => {
        puzzleContainer.appendChild(pieces[positions[index] - 1]); // Re-arrange pieces
    });

    document.getElementById('winMessage').classList.add('hidden');
}

// Drag and Drop Functions
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function dropPiece(event) {
    event.preventDefault();
    const draggedPieceId = event.dataTransfer.getData("text");
    const targetPiece = event.target;

    const draggedPiece = document.getElementById(draggedPieceId);
    const targetIndex = Array.from(targetPiece.parentNode.children).indexOf(targetPiece);
    const draggedIndex = Array.from(draggedPiece.parentNode.children).indexOf(draggedPiece);

    // Swap pieces
    targetPiece.parentNode.insertBefore(draggedPiece, targetPiece);
    targetPiece.parentNode.insertBefore(targetPiece, targetPiece.parentNode.children[draggedIndex]);

    checkWin();
}

// Check if the puzzle is solved
function checkWin() {
    let isSolved = true;
    const puzzlePieces = Array.from(document.querySelectorAll('.puzzle-piece'));

    puzzlePieces.forEach((piece, index) => {
        if (piece.dataset.position != index + 1) {
            isSolved = false;
        }
    });

    if (isSolved) {
        document.getElementById('winMessage').classList.remove('hidden');
        
        // Trigger confetti
        confetti({
            particleCount: 200,
            spread: 60,
            origin: { y: 0.6 }
        });
    }
}

createPuzzle();