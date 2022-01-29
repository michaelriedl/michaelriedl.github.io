---
layout: projectpost
thumb: /assets/images/thumbs/poke_thumb.png
title: "Generate Pokemon Sprites"
date: 2022-01-16
update: 2022-01-28
---
<!-- Load TensorFlow.js -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
<!-- Load ONNX Runtime Web -->
<script src="https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js"></script>

<!-- Main script for generating new Pokemon sprite -->
<script>
    
    //----- Define image generation function -----
    function genImage(model){
        // Run model and display the result
        var img_final_small;
        var img_final_large;
        const x = Float32Array.from([0]);
        const tensorX = new ort.Tensor('float32', x, [1]);
        promise = session.run({'input': tensorX});
        promise.then(function(value){
            // Debug statement
            console.log("Inference completed");
            // Debug statement
            console.log(value);
            // Get the output from the model
            img_final_small = value.output.data;
            // Reshape the image
            img_final_large = tf.tidy(() => {
                img_final_small = tf.tensor(img_final_small, [56, 68, 3])
                img_final_large = tf.image.resizeNearestNeighbor(img_final_small, [56*4, 68*4])
                
                return img_final_large;
            });
            // Get the canvas for displaying
            let canvas = document.getElementsByTagName("canvas")[0]
            tf.browser.toPixels(img_final_large, canvas).then(function(){
                tf.dispose(img_final_small);
                tf.dispose(img_final_large);
                // Debug statement
                console.log(tf.memory());
            });
        });
    }

    // Initiate a session and load the model
    var session;
    promise = ort.InferenceSession.create("/assets/files/gauss_gen_net.onnx");
    promise.then(function(value){
        // Assign the session variable
        session = value;
        // Debug statement
        console.log("Model loaded");
        // Generate a new Pokemon sprite
        genImage(session);
    });

</script>

## Approaches to Generating Pokemon Sprites
In this project I will document various approaches to generating never before seen Pokemon sprites. The current best model will be displayed below but I will document all of the approaches to date in the sections below.

<div class="text-center">
    <h3>Current Best Model</h3>
    <p>The image can take a while depending on OS and internet speed.</p>
    <p>This current model has to be significantly compressed to share it over the internet. Additionally, due to the compression, the model must run on the CPU and cannot use the GPU.</p>
    <canvas></canvas>
    <br>
    <button onclick="genImage(session)" type="button">Generate New Sprite!</button>
</div>
