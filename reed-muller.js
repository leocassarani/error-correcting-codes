var hadamard = require('./hadamard');

function ReedMuller() {
  this.length = 8;
  this.matrix = hadamard(this.length);
  this.order  = Math.pow(2, this.length);
  this.byteCount = this.order / this.length;
}

ReedMuller.prototype.encode = function (chunk) {
  var buf = Buffer.alloc(this.byteCount * chunk.length),
      codeword;

  for (var i = 0; i < chunk.length; i++) {
    codeword = this.matrix.getRow(chunk[i]);
    this._writeCodeword(codeword, buf, i);
  }

  return buf;
};

ReedMuller.prototype._writeCodeword = function (codeword, buf, index) {
  var bits, byte;

  for (var j = 0; j < this.byteCount; j++) {
    bits = codeword.slice(j * 8, j * 8 + 8);
    byte = 0;

    for (var k = 0; k < 8; k++) {
      if (bits[k] === 1) {
        byte &= ~(1 << k); // Clear the bit.
      } else {
        byte |= 1 << k;    // Set the bit.
      }
    }

    buf.writeUInt8(byte, index * this.byteCount + j);
  }
};

module.exports = ReedMuller;
