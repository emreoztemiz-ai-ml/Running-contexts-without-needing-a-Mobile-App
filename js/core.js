// Menu JS
var linkClicked = document.getElementsByClassName('nav-link');
var numClass = linkClicked.length;
for (var i = 0; i < numClass; i++) {
    linkClicked[i].addEventListener('click', function() {
        var onTheMoment = document.getElementsByClassName('active');
        onTheMoment[0].className = onTheMoment[0].className.replace(' active', '');
        this.className += ' active';
    }, false);
}


function clear(){
    //Start loading element and remove previous predictions
    document.getElementById("loading").classList.add("spinner");
    document.getElementById('uploaded-images').innerHTML = "";
}

//Clear all current predictions 
function reset(){
    document.getElementById('uploaded-images').innerHTML = "";
}

// File Upload
function handleFileSelect(evt) {
    clear();
    var files = evt.target.files; 
    for (var i = 0, f; f = files[i]; i++) {
        //Only process images 
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader();
        // Get the image information 
        reader.onload = (function(theFile) {
            return function(e) {
               var img=escape(theFile.name);
               classify(img, e.target.result,0);
    
            };
        })(f);       
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }

}

$('#files').change(handleFileSelect);

// Parameters for the function Classify:  
        // img: image id, 
        // src: image content or url, 
        // type: 1=from sample, 0=multiple images 

function classify(img,src,type){
    if(type==1){ 
        clear(); 
    }
    //Create image preview and card with predictions
    var div = document.createElement('div');
    div.innerHTML = [ '<div class="card"><img id="',img,'" class="img-thumbnail" src="',src, '" title="', img, ' class="card-img-top" alt="..."> <div class="card-body"><h5 class="card-title">',img,'</h5><p class="card-text"> <div class="mb-1 text-muted">Possible Labels: <br> <ul id="predictions-',img,'"> </ul></div>   </div> </div>'
    ].join('');
    //Append uploaded image into the HTML 
    document.getElementById('uploaded-images').insertBefore(div, null);
    //Call function to predict image and get tags 
    predict(img);
}


//TensorFlow prediction
function predict(image) {
    const img = document.getElementById(image);
    //Load the model from MobileNet
    mobilenet.load().then(model => {
        //Send image for classification 
        model.classify(img).then(predictions => {
            //When classified parse the predictions 

            // console.log(predictions);
            for (var i = 0; i < predictions.length; i++) {
                // Create new list elements with the predictions for each tag
                var li = document.createElement('li');
                //Print out probablily in % and the possible class Name 
                var tag = predictions[i].className.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                var probability=(predictions[i].probability * 100).toFixed(2) + '%';
                li.innerHTML = ["<span class='badge badge-success text-wrap'>Predictions:</span> " + tag + ".  <span class='badge badge-primary text-wrap'>Probability:</span> " + probability].join('');
                //Output results
                document.getElementById('predictions-'+image).insertBefore(li, null);
                document.getElementById("loading").classList.remove("spinner");


            }
        });
    });
}