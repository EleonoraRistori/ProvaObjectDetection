let model =undefined;
await cocoSsd.load().then(modelCoco => {
    model = modelCoco
})
console.log(model)
console.log('MobileNet loaded Succesfully!')
const webcam = document.getElementById('camera--view');



function eucDistance(a, b) {
    return a
            .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
            .reduce((sum, now) => sum + now) // sum
        ** (1 / 2)
}

function closestDetail(features, webcamFeatures) {
    let distance = undefined;
    let minDistance = Number.MAX_SAFE_INTEGER;
    let detail = undefined;

    for (let i = 0; i < features.length; i++) {
        distance = eucDistance(JSON.parse(features[i]['features']), webcamFeatures);
        if (distance < minDistance) {
            minDistance = distance;
            detail = features[i]['artwork'];
        }
    }
    if (minDistance < 17) {
        return detail
    }
    return null;
}


const detailContainer = document.getElementById('detailContainer')
let video = document.querySelector('#camera--view')
let canvas = document.getElementById('canvas_no_display');
const body = document.getElementById('camera')

function drawBoxes(x, y, width, height, classification){
    let box = document.createElement('p');
    body.appendChild(box)
    x = x * document.documentElement.clientWidth / webcam.videoWidth;
    y = y * document.documentElement.clientHeight / webcam.videoHeight;
    width = width * document.documentElement.clientWidth / webcam.videoWidth;
    height = height * document.documentElement.clientHeight/ webcam.videoHeight;
    box.style.position = 'fixed'
    box.style.zIndex = '9999'
    box.style.left = String(x) + 'px';
    box.style.top =String(y) + 'px';
    box.style.width = String(width) + 'px';
    box.style.height = String(height) + 'px';
    box.style.border = '2px solid white';
    box.innerText = classification;
    box.style.color = 'white'

}

async function calculateFeaturesOnCurrentFrame(webcam){

    return await model.detect(webcam).then(predictions => {
        console.log('Predictions: ', predictions);
        for (let i = 0; i < predictions.length; i++) {
            drawBoxes(predictions[i].bbox[0], predictions[i].bbox[1], predictions[i].bbox[2], predictions[i].bbox[3], predictions[i].class)
        }
        return predictions
    })
}




function predictLoop() {
    let imageFeatures = calculateFeaturesOnCurrentFrame(webcam);
    let p = document.getElementsByTagName(`p`)
    for (let i=0; i < p.length; i++){
        p[i].remove();
    }
    window.requestAnimationFrame(predictLoop);


}

function startPredictLoop() {
    if (webcam.readyState >= 2) {
        console.log('Ready to predict')
        predictLoop()
    } else {
        setInterval(startPredictLoop, 1000)
    }

}

startPredictLoop();





