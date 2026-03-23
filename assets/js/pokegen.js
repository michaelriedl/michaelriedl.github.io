/* PokeGen - TensorFlow.js and ONNX Runtime Web for generating Pokemon sprites */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function genImage() {
  document.getElementById("genButton").disabled = true;

  if (backend == "onnx") {
    var x = Float32Array.from([0]);
    var tensorX = new ort.Tensor('float32', x, [1]);

    var img_final_small = await session.run({ 'input': tensorX });
    img_final_small = img_final_small.output.data;

    console.log("Inference completed");
    console.log(img_final_small);

    var img_final_small_tensor = tf.tensor(img_final_small, [56, 68, 3]);
    var img_final_large_tensor = tf.image.resizeNearestNeighbor(img_final_small_tensor, [56 * 4, 68 * 4]);

    var canvas = document.getElementsByTagName("canvas")[0];
    await tf.browser.toPixels(img_final_large_tensor, canvas);

    tf.dispose(img_final_small_tensor);
    tf.dispose(img_final_large_tensor);
    console.log(tf.memory());

  } else if (backend == "tfjs") {
    var x_tensor = tf.randomNormal([56 * 68 * 3, 1]);

    var img_final_small_tensor = model.execute(x_tensor);

    console.log("Inference completed");
    console.log(img_final_small_tensor);

    var img_final_large_tensor = tf.image.resizeNearestNeighbor(img_final_small_tensor, [56 * 4, 68 * 4]);

    var canvas = document.getElementsByTagName("canvas")[0];
    await tf.browser.toPixels(img_final_large_tensor, canvas);

    tf.dispose(x_tensor);
    tf.dispose(img_final_small_tensor);
    tf.dispose(img_final_large_tensor);
    console.log(tf.memory());
  }

  await sleep(1500);
  document.getElementById("genButton").disabled = false;
}

async function setup() {
  tf.enableProdMode();
  await tf.setBackend('cpu');

  model = await tf.loadGraphModel('/assets/files/gauss_gen_net/model.json');
  session = await ort.InferenceSession.create("/assets/files/gauss_gen_net.onnx");

  console.log("Models loaded");
  await genImage();
}

var model;
var session;

document.getElementById("genButton").disabled = true;

var backend_elem = document.getElementById("backend");
var backend = backend_elem.value;
backend_elem.onchange = function(e) { backend = e.target.value; };

setup();
