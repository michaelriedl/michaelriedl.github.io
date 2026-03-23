/* Morty GAN - TensorFlow.js model for generating Morty faces */

function loadModel() {
  var model = tf.loadLayersModel('/assets/files/Aug21.json/model.json');
  return model;
}

function genImage(model) {
  console.log("Inside genImage");

  var noise = tf.randomNormal([1, 100]);

  var img_final = tf.tidy(function() {
    var img = model.predict(noise);
    console.log(img);
    img = img.as3D(160, 160, 3);
    img = img.clipByValue(0, 1).mul(tf.scalar(255)).cast('int32');
    return img;
  });

  var canvas = document.getElementsByTagName("canvas")[0];

  tf.browser.toPixels(img_final, canvas).then(function() {
    console.log("Displayed");
    tf.dispose(img_final);
    tf.dispose(noise);
    console.log(tf.memory());
  });
}

var model = null;
var promise = loadModel();
promise.then(function(value) {
  console.log("Model loaded");
  model = value;
  genImage(model);
});
