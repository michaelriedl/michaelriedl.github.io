---
layout: projectpost
thumb: /assets/images/thumbs/poke_thumb.png
title: "Generate Pokemon Sprites"
date: 2022-01-16
update: 2022-02-15
---
<!-- Load TensorFlow.js -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js"></script>
<!-- Load ONNX Runtime Web -->
<script src="https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js"></script>

## Approaches to Generating Pokemon Sprites
In this project I will document various approaches to generating never before seen Pokemon sprites. The current best model will be displayed below but I will document all of the approaches to date in the sections below.

<div class="text-center">
    <h3>Current Best Model</h3>
    <p>The image can take a while depending on OS and internet speed.</p>
    <p>This current model has to be significantly compressed to share it over the internet. Additionally, due to the compression the model must run on the CPU and cannot utilize the GPU with OpenGL. The model is implemented in both TensorFlow JS and ONNX Runtime Web for maximum compatibility.</p>
    <p><strong>The ONNX Runtime Web does not work for iOS due to a WebAssembly bug; please use the TFJS option.</strong></p>
    <select id="backend">
        <option value="tfjs">TensorFlow JS</option>
        <option value="onnx">ONNX Runtime Web</option>
    </select>
    <br>
    <canvas width="224" height="272"></canvas>
    <br>
    <button id="genButton" onclick="genImage()" type="button">Generate New Sprite!</button>
    <p><strong>Generating additional sprites quickly may crash the page if the OS garbage collection is not performed quickly (this is mostly a problem on mobile devices).</strong></p>
</div>

<!-- Sleep function -->
<script>

    //----- Define sleep function -----
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

</script>

<!-- Generate image function -->
<script>

    //----- Define image generation function -----
    async function genImage(){

        // Disable the button
        document.getElementById("genButton").disabled = true;

        // Run model and display the result
        // ONNX backend
        if(backend == "onnx"){

            // Create the input data
            let x = Float32Array.from([0]);
            let tensorX = new ort.Tensor('float32', x, [1]);
            
            // Run the model
            let img_final_small = await session.run({'input': tensorX});
            img_final_small = img_final_small.output.data;

            // Debug statement
            console.log("Inference completed");

            // Debug statement
            console.log(img_final_small);

            // Convert to TFJS tensor and resize
            let img_final_small_tensor = tf.tensor(img_final_small, [56, 68, 3]);
            let img_final_large_tensor = tf.image.resizeNearestNeighbor(img_final_small_tensor, [56*4, 68*4]);

            // Get the canvas for displaying
            let canvas = document.getElementsByTagName("canvas")[0];

            // Display the image
            await tf.browser.toPixels(img_final_large_tensor, canvas);

            // Clean up
            tf.dispose(img_final_small_tensor);
            tf.dispose(img_final_large_tensor);

            // Debug statement
            console.log(tf.memory());

        // TensorFlow JS backend
        }else if(backend == "tfjs"){
            
            // Create the input data
            let x_tensor = tf.randomNormal([56*68*3, 1]);

            // Run the model
            let img_final_small_tensor = model.execute(x_tensor);

            // Debug statement
            console.log("Inference completed");

            // Debug statement
            console.log(img_final_small_tensor);

            // Resize the image
            let img_final_large_tensor = tf.image.resizeNearestNeighbor(img_final_small_tensor, [56*4, 68*4]);

            // Get the canvas for displaying
            let canvas = document.getElementsByTagName("canvas")[0];

            // Display the image
            await tf.browser.toPixels(img_final_large_tensor, canvas);

            // Clean up
            tf.dispose(x_tensor);
            tf.dispose(img_final_small_tensor);
            tf.dispose(img_final_large_tensor);

            // Debug statement
            console.log(tf.memory());

        }

        // Pause and then enable the button
        await sleep(1500);
        document.getElementById("genButton").disabled = false;

    }

</script>

<!-- Setup function -->
<script>

    //----- Define setup function -----
    async function setup(){

        // Set the backend
        tf.enableProdMode();
        await tf.setBackend('cpu');
        
        // Initiate a session and load the models
        model = await tf.loadGraphModel('/assets/files/gauss_gen_net/model.json');
        session = await ort.InferenceSession.create("/assets/files/gauss_gen_net.onnx");

        // Debug statement
        console.log("Models loaded");

        // Generate a new Pokemon sprite
        await genImage();

    }

</script>

<!-- Main script for generating new Pokemon sprite -->
<script>

    // Initialize the model and session
    var model;
    var session;

    // Disable the button
    document.getElementById("genButton").disabled = true;

    // Track the backend
    var backend_elem = document.getElementById("backend");
    var backend = backend_elem.value;
    backend_elem.onchange = function(e){backend = e.target.value;}

    // Setup
    setup();

</script>