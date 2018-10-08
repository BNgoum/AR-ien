var video, canvas, context, imageData, detector, markers;

var listeUsers = [
    {
        markerId : 0,
        firstName : 'Benjamin',
        lastName : 'NGOUM',
        filiere : 'Développement Web',
        annee : 'Mastère 2',
        avatar : '../img/feuille.jpg',
    },
    {
        markerId : 1,
        firstName : 'Lisa',
        lastName : 'Comelli',
        filiere : 'Webdesign',
        annee : 'Mastère 2',
        avatar : '../img/donuts.jpg',
    },
    {
        markerId : 2,
        firstName : 'Elmarino',
        lastName : 'Tavares',
        filiere : 'Développement Web',
        annee : "Mastère 2",
        avatar : '../img/sky.jpg',
    },
    {
        markerId : 3,
        firstName : 'Vince',
        lastName : 'Deplais',
        filiere : 'Développement Web',
        annee : 'Mastère 2',
        avatar : '../img/night.jpg',
    }
]

function onLoad () {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
        }
    }

    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function(stream) {
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            video.src = window.URL.createObjectURL(stream);
        }
        })
        .catch(function(err) {
        console.log(err.name + ": " + err.message);
        }
    );
        
    detector = new AR.Detector();
    requestAnimationFrame(tick);
}



function tick(){
    requestAnimationFrame(tick);
    
    if (video.readyState === video.HAVE_ENOUGH_DATA){
        snapshot();
        // markers est un array content les marqueurs detectés 
        markers = detector.detect(imageData);

        // Si on en detecte plus d'un...
        if (markers.length > 0) {
            // On compare l'id du marqueur detecté avec les ids de la base de données
            listeUsers.forEach(element => {
                // Si un élément de la base de données correspond avec l'id du marqueur detecté...
                if (element.markerId === markers[0].id) {
                    drawCorners(markers);
                    drawId(markers);
                    card(markers, element);
                }
            });
        }
    }
}

function snapshot(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function drawCorners(markers){
    var corners, corner, i, j;
  
    context.lineWidth = 3;
    for (i = 0; i !== markers.length; ++ i){
      corners = markers[i].corners;
      
      context.strokeStyle = "red";
      context.beginPath();
      
      for (j = 0; j !== corners.length; ++ j){
        corner = corners[j];
        context.moveTo(corner.x, corner.y);
        corner = corners[(j + 1) % corners.length];
        context.lineTo(corner.x, corner.y);
      }
      context.stroke();
      context.closePath();
      
      context.strokeStyle = "green";
      context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
    }
}

  function drawId(markers, element){
    var corners, corner, x, y, i, j;
    
    context.strokeStyle = "blue";
    context.lineWidth = 1;
    
    for (i = 0; i !== markers.length; ++ i){
      corners = markers[i].corners;
      
      x = Infinity;
      y = Infinity;
      
      for (j = 0; j !== corners.length; ++ j){
        corner = corners[j];
        
        x = Math.min(x, corner.x);
        y = Math.min(y, corner.y);
      }
    context.strokeText(markers[i].id, x, y)
    }
}

function card(markers, element) {
    var cornerXHautGauche = markers[0].corners[0].x;
    var cornerYHautGauche = markers[0].corners[0].y;
    var cornerYBasGauche = markers[0].corners[2].y;
    var cornerXHautDroit = markers[0].corners[1].x;

    var widthMarker = cornerXHautDroit - cornerXHautGauche;
    var heightMarker = cornerYBasGauche - cornerYHautGauche;

    var widthCard = 600;
    var heightCard = 350;

    var posXCard = (cornerXHautGauche + (widthMarker / 2)) - (widthCard / 2);
    var posYCard = (cornerYHautGauche + (heightMarker / 2)) - (heightCard / 2);

    // Dessin de la forme de la carte
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.fillRect(posXCard, posYCard, widthCard, heightCard);

    // Placement de l'avatar
    var avatar = new Image();
    avatar.src = element.avatar;
    var widthAvatar = 280;
    var heightAvatar = 350;

    var posXAvatar = posXCard;
    var posYAvatar = posYCard;

    context.drawImage(avatar, posXAvatar, posYAvatar, widthAvatar, heightAvatar);

    // Bandeau séparation
    var posXBandeau = posXAvatar + widthAvatar;
    var posYBandeau = posYAvatar;

    context.fillStyle = '#00a0e6';
    context.fillRect(posXBandeau, posYBandeau, 10, 350);

    // Textes
    var mesureEcvText = context.measureText("ECV Digital");
    var widthEcvText = mesureEcvText.width;
    context.font = "15px Arial";
    context.fillStyle = "#00a0e6";
    context.fillText("ECV Digital", (posXBandeau + 40), posYBandeau + 100);

    // Info user
    var mesureFirstName = context.measureText(element.firstName);
    var mesureLastName = context.measureText(element.lastName);
    var mesureFiliere = context.measureText(element.filiere);
    var mesureAnnee = context.measureText(element.annee);
    var widthFirstName = mesureFirstName.width;
    var widthLastName = mesureLastName.width;
    var widthFiliere = mesureFiliere.width;
    var widthAnnee = mesureAnnee.width;

    context.font = "30px Arial";
    context.fillStyle = "#00a0e6";
    context.fillText(element.firstName, (posXBandeau + 40), posYBandeau + 140);
    context.fillText(element.lastName, (posXBandeau + 40), posYBandeau +170);

    context.fillRect(posXBandeau + 40, posYBandeau + 190, 240, 10);

    context.fillText(element.annee, (posXBandeau + 40), posYBandeau + 235);

    context.font = "20px Arial";
    context.fillText(element.filiere, (posXBandeau + 40), posYBandeau + 260);
}

window.onload = onLoad;