(function () {
  function Matrix(cells) {
    if (!isSquare(cells)) {
      throw new Error('A matrix must be square');
    }

    this.size  = Math.sqrt(cells.length);
    this.cells = cells;
  }

  function isSquare(cells) {
    var length = cells.length;
    if (length === 0) {
      return false;
    }
    // This will be true if length is a power of 2.
    return (length & (length - 1)) === 0;
  }

  Matrix.withSize = function (size) {
    var cells = new Array(size * size);
    return new Matrix(cells);
  };

  Matrix.prototype.get = function (row, col) {
    this._boundsCheck(row, col);
    return this.cells[row * this.size + col];
  };

  Matrix.prototype.set = function (row, col, value) {
    this._boundsCheck(row, col);
    this.cells[row * this.size + col] = value;
  };

  Matrix.prototype.cartesianProduct = function (other) {
    var result = Matrix.withSize(this.size * other.size),
        row, col, cell;

    for (var j = 0; j < this.size; j++) {
      for (var k = 0; k < this.size; k++) {
        for (var a = 0; a < other.size; a++) {
          for (var b = 0; b < other.size; b++) {
            row = j * other.size + a;
            col = k * other.size + b;
            cell = this.get(j, k) * other.get(a, b);
            result.set(row, col, cell);
          }
        }
      }
    }

    return result;
  };

  Matrix.prototype._boundsCheck = function (row, col) {
    if (row >= this.size || col >= this.size) {
      throw new Error('Out of bounds: (' + row + ', ' + col + ')');
    }
  };

  window.Matrix = Matrix;
})();
