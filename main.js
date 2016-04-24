(function () {
  var $canvas = document.getElementById('canvas'),
      $order  = document.getElementById('order');

  $order.addEventListener('input', render);
  render();

  function render() {
    var order  = $order.valueAsNumber,
        matrix = hadamard(order),
        width  = $canvas.width / matrix.size,
        height = $canvas.height / matrix.size,
        x, y;

    var ctx = $canvas.getContext('2d');
    ctx.strokeStyle = 'grey';

    for (var j = 0; j < matrix.size; j++) {
      for (var k = 0; k < matrix.size; k++) {
        x = k * width;
        y = j * height;

        ctx.fillStyle = matrix.get(j, k) === 1 ? 'white' : 'black';
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
      }
    }
  }

  function hadamard(subscript) {
    if (subscript === 1) {
      return new Matrix([
        1,  1,
        1, -1
      ]);
    }

    return hadamard(subscript - 1).cartesianProduct(hadamard(1));
  }
})();
