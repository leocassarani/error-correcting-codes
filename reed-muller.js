var hadamard = require('./hadamard');

function ReedMuller() {
  this.length = 8;
  this.matrix = hadamard(this.length);
  this.order  = Math.pow(2, this.length);
  this.codewordLength = this.order / this.length;
}

ReedMuller.prototype.encode = function (chunk) {
  var buf = Buffer.alloc(this.codewordLength * chunk.length),
      codeword;

  for (var i = 0; i < chunk.length; i++) {
    codeword = this.matrix.getRow(chunk[i]);
    this._writeCodeword(codeword, buf, i);
  }

  return buf;
};

ReedMuller.prototype._writeCodeword = function (codeword, buf, index) {
  var bits, byte;

  for (var j = 0; j < this.codewordLength; j++) {
    bits = codeword.slice(j * 8, j * 8 + 8);
    byte = 0;

    for (var k = 0; k < 8; k++) {
      if (bits[k] === 1) {
        byte &= ~(1 << k); // Clear the bit.
      } else {
        byte |= 1 << k;    // Set the bit.
      }
    }

    buf.writeUInt8(byte, index * this.codewordLength + j);
  }
};

ReedMuller.prototype.decode = function (chunk) {
  if (chunk.length !== this.codewordLength) {
    throw new Error('Invalid data size: expected exactly ' + this.codewordLength + ' bytes, got ' + chunk.length);
  }

  var codeword = chunk.reduce(function (memo, byte) {
    var letter;
    for (var k = 0; k < 8; k++) {
      // If the kth bit is set, turn it into -1; otherwise, 1.
      letter = (byte >> k) & 1 ? -1 : 1;
      memo.push(letter);
    }
    return memo;
  }, []);

  var matches = this._closestMatches(codeword);

  if (matches.length === 1) {
    // If we found a single match, then we've been able to correct any errors.
    // Return the byte that most closely matched the codeword we received as input.
    return Buffer.alloc(1, matches[0]);
  } else {
    // If there have been more than one match, then we know an error has occurred,
    // but we can't correct it. Let's return "?" to indicate that.
    return Buffer.from('?');
  }
};

ReedMuller.prototype._closestMatches = function (codeword) {
  var indices = [],
      max = 0,
      matrix = this.matrix,
      score;

  for (var row = 0; row < matrix.size; row++) {
    score = codeword.reduce(function (count, letter, col) {
      if (letter === matrix.get(row, col)) {
        return count + 1;
      } else {
        return count;
      }
    }, 0);

    if (score > max) {
      max = score;
      indices = [row];
    } else if (score === max) {
      indices.push(row);
    }
  }

  return indices;
};

module.exports = ReedMuller;
