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
let win = document.createElement('a');
body.appendChild(win)
win.style.position = 'fixed'
win.style.zIndex = '99999'
win.style.left = '0';
win.style.top ='0';
win.style.width = String(document.documentElement.clientWidth - 8) + 'px';
win.style.height = String(document.documentElement.clientHeight - 8) + 'px';
win.style.border = '4px solid green';
win.style.margin = '0'


function drawBoxes(x, y, width, height, classification){
    let box = document.createElement('p');
    body.appendChild(box)
    if(document.documentElement.clientWidth / document.documentElement.clientHeight > webcam.videoWidth / webcam.videoHeight){
        let offsetY = (document.documentElement.clientWidth * 3/4 - document.documentElement.clientHeight) / 2
        x = x * document.documentElement.clientWidth / webcam.videoWidth;
        y = y *  document.documentElement.clientWidth / webcam.videoWidth - offsetY;
    }else{
        let offsetX = (document.documentElement.clientHeight * 4/3 - document.documentElement.clientWidth) / 2;
        x = x * document.documentElement.clientHeight / webcam.videoHeight - offsetX;
        y = y *  document.documentElement.clientHeight / webcam.videoHeight
    }


    width = width * document.documentElement.clientWidth / webcam.videoWidth;
    height = height * document.documentElement.clientWidth/ webcam.videoHeight;
    box.style.position = 'fixed'
    box.style.zIndex = '9999'
    box.style.left = String(x) + 'px';
    box.style.top =String(y) + 'px';
    box.style.width = String(width) + 'px';
    box.style.height = String(height) + 'px';
    box.style.border = '2px solid white';
    box.innerText = classification;
    box.style.color = 'white';
    box.style.margin = '0';

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




async function predictLoop() {
    let imageFeatures = await calculateFeaturesOnCurrentFrame(webcam);
    let p = document.getElementsByTagName(`p`)
    setInterval(function (){
        for (let i=0; i < p.length; i++){
            p[i].remove();
        }
    }, 50)

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





