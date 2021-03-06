(function () {
  var Matrix;

  if (typeof window !== 'undefined') {
    Matrix = window.Matrix;
  } else {
    Matrix = require('./matrix');
  }

  function hadamard(order) {
    if (order === 1) {
      return new Matrix([
        1,  1,
        1, -1
      ]);
    }

    return hadamard(order - 1).cartesianProduct(hadamard(1));
  }

  if (typeof window !== 'undefined') {
    window.hadamard = hadamard;
  } else {
    module.exports = hadamard;
  }
})();
