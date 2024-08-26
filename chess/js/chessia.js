let board = null;
let game = new Chess();
const moveDelay = 1000; // tempo de espera em milissegundos para a IA (ajuste conforme necessário)

// configuração do tabuleiro
function initGame() {
    board = Chessboard('board', {
        draggable: true,
        position: 'start',
        onDrop: handleMove
    });
}

// função para processar o movimento do jogador
function handleMove(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // sempre promove para rainha
    });

    // movimento inválido
    if (move === null) return 'snapback';

    // IA responde após o tempo definido
    window.setTimeout(makeBestMove, moveDelay);
}

// função Minimax para avaliar movimentos
function minimax(depth, isMaximizingPlayer) {
    if (depth === 0 || game.game_over()) {
        return evaluateBoard();
    }

    let possibleMoves = game.legal_moves();
    let bestMove;

    if (isMaximizingPlayer) {
        let bestValue = -Infinity;
        possibleMoves.forEach(function(move) {
            game.move(move);
            let value = minimax(depth - 1, false);
            game.undo();
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        });
        return depth === 3 ? bestMove : bestValue; // retorna o melhor movimento na raiz
    } else {
        let bestValue = Infinity;
        possibleMoves.forEach(function(move) {
            game.move(move);
            let value = minimax(depth - 1, true);
            game.undo();
            if (value < bestValue) {
                bestValue = value;
                bestMove = move;
            }
        });
        return depth === 3 ? bestMove : bestValue; // retorna o melhor movimento na raiz
    }
}

// função para avaliar o tabuleiro (valores simples)
function evaluateBoard() {
    let value = 0;
    game.board().forEach(function(row) {
        row.forEach(function(piece) {
            if (piece) {
                value += getPieceValue(piece);
            }
        });
    });
    return value;
}

// função para obter o valor das peças
function getPieceValue(piece) {
    const pieceValues = {
        'p': 1,
        'r': 5,
        'n': 3,
        'b': 3,
        'q': 9,
        'k': 0
    };
    return piece.color === 'w' ? pieceValues[piece.type] : -pieceValues[piece.type];
}

// função para fazer o melhor movimento
function makeBestMove() {
    let bestMove = minimax(3, true); // profundidade 3 para o Minimax (podendo variar de 1 + básico 5 + complexo)
    if (bestMove) {
        game.move(bestMove);
        board.position(game.fen());
    }
}

// função para reiniciar o jogo
document.getElementById('resetBtn').addEventListener('click', () => {
    game.reset();
    board.start();
});

// inicializa o jogo
initGame();
