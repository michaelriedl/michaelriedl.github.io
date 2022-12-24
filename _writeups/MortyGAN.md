---
layout: projectpost
thumb: /assets/images/thumbs/morty_thumb.png
title: "Morty GAN"
date: 2021-06-11
update: 2021-06-11
---
<!-- Load TensorFlow.js -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>

<!-- Main script for generating new Morty image -->
<script>
    
    //----- Define model loading function -----
    function loadModel(){
        let model = tf.loadLayersModel('/assets/files/Aug21.json/model.json');
        
        return model;
    }
    
    //----- Define image generation function -----
    function genImage(model){
        // Debug statement
        console.log("Inside genImage");
        
        // Create noise to generate a Morty image
        let noise = tf.randomNormal([1, 100]);

        // Create the image and clean up memory
        let img_final = tf.tidy(() => {
            // Predict
            let img = model.predict(noise);
            
            // Debug statement
            console.log(img);

            // Resize and scale the image
            img = img.as3D(160,160,3);
            img = img.clipByValue(0,1).mul(tf.scalar(255)).cast('int32');
            
            return img;
        });
        
        // Get the canvas for displaying
        let canvas = document.getElementsByTagName("canvas")[0]

        // Display the image
        tf.browser.toPixels(img_final, canvas).then(function(){
            // Debug statement
            console.log("Displayed");
            // Clean up the tenosr
            tf.dispose(img_final);
            tf.dispose(noise);
            // Debug statement
            console.log(tf.memory());
        });

    }

    // Load the model
    var model = null
    promise = loadModel();
    promise.then(function(value){
        // Debug statement
        console.log("Model loaded");
        // Assign the model variable
        model = value;
        // Generate a new Morty image
        genImage(model);
    });

</script>

<div class="text-center">
    <p>The image can take a while depending on OS and internet speed.</p>
    <canvas height="120" width="120"></canvas>
    <br>
    <button onclick="genImage(model)" type="button">Generate New Morty!</button>
</div>
