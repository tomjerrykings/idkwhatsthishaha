function playMusic() {
    var audioFile = document.getElementById('audioFile').files[0];
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var fileReader = new FileReader();
    var colorInterval;

    fileReader.onload = function(event) {
        var arrayBuffer = event.target.result;
        audioContext.decodeAudioData(arrayBuffer, function(buffer) {
            var source = audioContext.createBufferSource();
            source.buffer = buffer;

            var analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);
            analyser.connect(audioContext.destination);

            source.connect(analyser);
            source.start();

            var isLoud = false;

            function updateBackground() {
                analyser.getByteFrequencyData(dataArray);
                var maxFrequency = Math.max.apply(null, Array.from(dataArray));
                var threshold = 200;
                
                if (maxFrequency > threshold) {
                    var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                    document.body.style.backgroundColor = randomColor;
                    isLoud = true;
                } else if (isLoud) {
                    clearInterval(colorInterval);
                    colorInterval = setInterval(function() {
                        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                        document.body.style.backgroundColor = randomColor;
                    }, 100);
                    isLoud = false;
                }
            }

            colorInterval = setInterval(updateBackground, 100);
        });
    };

    fileReader.readAsArrayBuffer(audioFile);
}

