document.addEventListener('DOMContentLoaded', function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("trailer") });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    var username = JSON.parse(localStorage.getItem('myself')).facebookName || "Magical Friend";
    var userimage = JSON.parse(localStorage.getItem('myself')).image || 'magic5.png';
   
    var images = ["magic5.png", "logo.png", userimage]; 

    var cubes = [];
    var currentCubeIndex = 0; // Track current cube index
    var isAnimating = false; // Flag to track if animation is in progress
    var isPlaying = false; // Track playing animation
    var animationFrameId;
    var currentAudioTime = 0; // Store current audio time
    var storedCurrentCubeIndex = 0; // Store current cube index on pause
    var storedCurrentAudioTime = 0; // Store current audio time on pause


    function createCube(material) {
        var geometry = new THREE.BoxGeometry(7, 5, 7);
        var edges = new THREE.EdgesGeometry(geometry);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
        var cube = new THREE.Mesh(geometry, material);
        cube.add(line);
        cube.material.transparent = true;
        cube.material.opacity = 0;
        scene.add(cube);
        cubes.push(cube);
        return cube;
    }

    function createTextMaterial(text, subtext="") {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        
        // Set canvas dimensions to match cube dimensions
        canvas.width = 256;
        canvas.height = 256;
        
        // Clear the canvas and set background color if needed
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#000000'; // Set a background color if needed
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        // Set main text properties
        context.font = 'Bold 24px Lucida Console';
        context.fillStyle = '#00FFFF'; // Text color: cyan/aqua
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    
        // Function to wrap text
        function wrapText(text, maxWidth) {
            var words = text.split(' ');
            var lines = [];
            var currentLine = words[0];
    
            for (var i = 1; i < words.length; i++) {
                var word = words[i];
                var width = context.measureText(currentLine + ' ' + word).width;
                if (width < maxWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        }
    
        // Add main text
        var lines = wrapText(text, canvas.width - 40); // 20px padding on each side
        var lineHeight = 30;
        var startY = canvas.height / 2 - (lines.length / 2) * lineHeight;
    
        for (var i = 0; i < lines.length; i++) {
            context.fillText(lines[i], canvas.width / 2, startY + i * lineHeight);
        }
    
        // Set subtext properties (if any)
        context.font = 'Bold 16px Comic Sans MS';
        context.fillStyle = '#00FFFF'; // Subtext color: cyan/aqua
        context.fillText(subtext, canvas.width / 2, canvas.height - 30); // Position subtext at the bottom
    
        // Add border
        context.strokeStyle = '#0056b3'; // Border color: cyan/aqua
        context.lineWidth = 10; // Border width
        context.strokeRect(0, 0, canvas.width, canvas.height);
    
        var texture = new THREE.CanvasTexture(canvas);
        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        return material;
    }
    

    function loadImageMaterial(image) {
        var textureLoader = new THREE.TextureLoader();
        return new THREE.MeshBasicMaterial({ map: textureLoader.load(image) });
    }

    // Create cubes
    createCube(loadImageMaterial(images[0])); // Image 1: magic.png
    createCube(createTextMaterial("Magical Friend")); // Text 1: "Magical Friend"
    createCube(createTextMaterial("in friendship with")); // Text 2: "in association"
    createCube(loadImageMaterial(images[1])); // Image 2: logo.png
    createCube(createTextMaterial("Facebook")); // Text 3: "Facebook"

    createCube(createTextMaterial("Presents")); // Text 4: "Presents"
    createCube(loadImageMaterial(images[2])); // Image 3: userimage
    createCube(createTextMaterial(username)); // Text 5: username
    createCube(createTextMaterial("as Magical Friend")); // Text 6: "as magical friend"

    
    function fadeIn(cube, duration, rotationSpeedX, rotationSpeedY, opacityIncrement, callback) {
        cube.material.opacity = 0;
        cube.rotation.x = -0.2; // Skew for more dynamic appearance
        cube.rotation.y = -0.4;
        var fadeInCube = setInterval(function() {
            if (cube.material.opacity < 1) {
                cube.material.opacity += opacityIncrement;
                cube.rotation.x += rotationSpeedX; // Slowly rotating to face the camera
                cube.rotation.y += rotationSpeedY;
            } else {
                clearInterval(fadeInCube);
                if (callback) callback();
            }
        }, duration / 100);
    }
    

    function slideIn(cube, startX, endX, duration, rotationSpeedX, rotationSpeedY, opacityIncrement, callback) {
        cube.position.x = startX;
        cube.rotation.x = 0.3; // Initial skew
        cube.rotation.y = 0.3;
        cube.material.opacity = 0;
        var startTime = Date.now();
        var slideInCube = setInterval(function() {
            var elapsed = Date.now() - startTime;
            var progress = elapsed / duration;
            if (progress < 1) {
                cube.position.x = startX + (endX - startX) * progress;
                cube.material.opacity = progress;
                cube.rotation.x -= rotationSpeedX; // Slowly rotating to face the camera
                cube.rotation.y += rotationSpeedY;
            } else {
                clearInterval(slideInCube);
                cube.position.x = endX;
                cube.material.opacity = 1;
                if (callback) callback();
            }
        }, 10);
    }
    

    function removeCube(cube) {
        scene.remove(cube);
        cube.geometry.dispose();
        cube.material.dispose();
        cube = undefined;
    }

    function stopAnimation() {
        isAnimating = false;
        isPlaying = false;
        cancelAnimationFrame(animationFrameId);
        audio.pause();
        audio.currentTime = 0;
        playButton.innerHTML = "&#9658;";
        currentCubeIndex = 0;
        currentAudioTime = 0;
        
    }

    function startAnimation() {
       
        animateCubes();
        audio.play();
        audio.currentTime = 0;
        playButton.innerHTML = "&#10073;&#10073;";
        currentCubeIndex = 0;
        currentAudioTime = 0;
        isAnimating = true;
        isPlaying = true;
    }


    function animateCubes() {
        isAnimating = true; // Start animation flag
        var fadeDuration = 6000; // 6 seconds
        var slideDuration = 10000; // Adjust as needed
        
        fadeIn(cubes[currentCubeIndex], fadeDuration, 0.002, 0.004, 0.01, function() {
            removeCube(cubes[currentCubeIndex]);
            currentCubeIndex ++;
            fadeIn(cubes[currentCubeIndex], fadeDuration, 0.002, 0.006, 0.01, function() {
                removeCube(cubes[currentCubeIndex]);
                currentCubeIndex ++;
                fadeIn(cubes[currentCubeIndex], fadeDuration +1500 , 0.002, -0.015, 0.015, function() {
                    removeCube(cubes[currentCubeIndex]);
                    currentCubeIndex ++;
                    fadeIn(cubes[currentCubeIndex], fadeDuration + 4500, 0.002, 0.004, 0.015, function() {
                        removeCube(cubes[currentCubeIndex]);
                        currentCubeIndex ++;
                        fadeIn(cubes[currentCubeIndex], fadeDuration + 4000, 0.004, -0.015, 0.02, function() {
                            removeCube(cubes[currentCubeIndex]);
                            currentCubeIndex ++;
                            // Start the slide-in animations after the last fade-in
                            slideIn(cubes[currentCubeIndex], -10, 0, slideDuration + 2500, -0.010, 0.006, 1, function() {
                                removeCube(cubes[currentCubeIndex]);
                                currentCubeIndex ++;
                                slideIn(cubes[currentCubeIndex], -10, 0, slideDuration + 3000, 0.004, 0.005, 0.8, function() {
                                    removeCube(cubes[currentCubeIndex]);
                                    currentCubeIndex ++;
                                    slideIn(cubes[currentCubeIndex], -10, 0, slideDuration, 0.004, 0.003, 0.9, function() {
                                        removeCube(cubes[currentCubeIndex]);
                                        currentCubeIndex ++;
                                        slideIn(cubes[currentCubeIndex], -10, 0, slideDuration +500, 0.002, 0.006, 1.1, function() {
                                            removeCube(cubes[currentCubeIndex]);
                                            stopAnimation();                                           
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });

            
        });

        animate();
    }


    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
   

    var playButton = document.getElementById('play-trailer');
    var audio = document.getElementById('audio-trailer');
  

    audio.addEventListener('ended', function() {
        stopAnimation();
    });

    playButton.addEventListener('click', function() {
        if (!isAnimating && !isPlaying) {
            // Start animation from the beginning
            startAnimation();
        } else if (isAnimating && isPlaying) {
            // Pause animation and audio
            cancelAnimationFrame(animationFrameId);
            currentAudioTime = audio.currentTime;
            audio.pause();
            playButton.innerHTML = "&#9658;"; // Change button to play icon
            isPlaying = false;
            isAnimating = false;
        } else if (!isAnimating && isPlaying) {
            // Resume animation and audio from where it stopped
            animateCubes();
            audio.currentTime = currentAudioTime;
            audio.play();
            playButton.innerHTML = "&#10073;&#10073;"; // Change button to pause icon
            isAnimating = true;
            isPlaying = true;
        } else if (currentCubeIndex === cubes.length) {
            // Restart animation and audio
            startAnimation();
        } else {
            // Animation sequence ended
            stopAnimation();
        }
    });
    
    

   
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});
//===========================================================================================================================


