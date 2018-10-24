var imageData, detector, markers, currentUser;

var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var posXCard, posYCard;
var widthCard = 400;
var heightCard = 360;

var downloadCanvas = document.getElementById('downloadCanvas');

var listeUsers = [
    {
        markerId : 0,
        avatar : '../img/feuille.jpg',
        firstName : 'Benjamin',
        lastName : 'NGOUM',
        filiere : 'Développement Web',
        annee : 'Mastère 2',
        optionalInfos : {
            age: {
                icone: '../img/cake.png',
                val: '24 ans',
            },
            relationShipStatus: {
                icone: '../img/relationship.png',
                val: 'En couple',
            },
            hobby: {
                icone: '../img/hobby.png',
                val: 'Football',
            },
            telephone: {
                icone: '../img/mobile.png',
                val: '06.27.12.05.90',
            },
            email: {
                icone: '../img/email.png',
                val: 'benjamin.ngoum@gmail.com',
            },
        }
    },
    {
        markerId : 1,
        firstName : 'Lisa',
        lastName : 'Comelli',
        filiere : 'Webdesign',
        annee : 'Mastère 2',
        avatar : '../img/donuts.jpg',
        optionalInfos : {
            age: {
                icone: '../img/cake.png',
                val: '23 ans',
            },
            relationShipStatus: {
                icone: '../img/relationship.png',
                val: 'En couple',
            },
            hobby: {
                icone: '../img/hobby.png',
                val: 'Manger',
            },
            telephone: {
                icone: '../img/mobile.png',
                val: '',
            },
            email: {
                icone: '../img/email.png',
                val: '',
            },
        }
    },
    {
        markerId : 2,
        firstName : 'Elmar',
        lastName : 'Tavares',
        filiere : 'Développement Web',
        annee : "Mastère 2",
        avatar : '../img/sky.jpg',
        optionalInfos : {
            age: {
                icone: '../img/cake.png',
                val: '22 ans',
            },
            relationShipStatus: {
                icone: '../img/relationship.png',
                val: 'En couple',
            },
            hobby: {
                icone: '../img/hobby.png',
                val: 'Basket',
            },
            telephone: {
                icone: '../img/mobile.png',
                val: '',
            },
            email: {
                icone: '../img/email.png',
                val: 'elmar.tavares@gmail.com',
            },
        }
    },
    {
        markerId : 3,
        firstName : 'Vincent',
        lastName : 'Deplais',
        filiere : 'Développement Web',
        annee : 'Mastère 2',
        avatar : '../img/night.jpg',
        optionalInfos : {
            age: {
                icone: '../img/cake.png',
                val: '23 ans',
            },
            relationShipStatus: {
                icone: '../img/relationship.png',
                val: '',
            },
            hobby: {
                icone: '../img/hobby.png',
                val: 'Fortnite',
            },
            telephone: {
                icone: '../img/mobile.png',
                val: '06.27.12.05.90',
            },
            email: {
                icone: '../img/email.png',
                val: '',
            },
        }
    }
]

function onLoad () {
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
                    // drawId(markers);
                    card(markers, element);

                    currentUser = element.firstName + '_' + element.lastName;
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
      
      context.strokeStyle = "green";
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

function card(markers, element) {
    var cornerXHautGauche = markers[0].corners[0].x;
    var cornerYHautGauche = markers[0].corners[0].y;
    var cornerYBasGauche = markers[0].corners[2].y;
    var cornerXHautDroit = markers[0].corners[1].x;

    var widthMarker = cornerXHautDroit - cornerXHautGauche;
    var heightMarker = cornerYBasGauche - cornerYHautGauche;

    posXCard = (cornerXHautGauche + (widthMarker / 2)) - (widthCard / 2);
    posYCard = (cornerYHautGauche + (heightMarker / 2)) - (heightCard / 2);

    // Dessin de la forme de la carte
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.fillRect(posXCard, posYCard, widthCard, heightCard);

    // Placement de l'avatar
    var avatar = new Image();
    avatar.src = element.avatar;
    var widthAvatar = 180;
    var heightAvatar = heightCard;

    var posXAvatar = posXCard;
    var posYAvatar = posYCard;

    context.drawImage(avatar, posXAvatar, posYAvatar, widthAvatar, heightAvatar);

    // Picto enregistrement de la carte
    var pictoSave = new Image();
    pictoSave.src = '../img/smartphone.png';
    var widthPictoSave = 50;
    var heightPictoSave = 50;
    var posXPictoSave = posXCard;
    var posYPictoSave = posYCard;
    downloadCanvas.style.top = posYPictoSave + (heightAvatar - heightPictoSave - 25) + 'px';
    downloadCanvas.style.left = posXPictoSave + 60 + 'px';

    context.drawImage(pictoSave, posXPictoSave + 65, (posYPictoSave + (heightAvatar - heightPictoSave - 20)), widthPictoSave, heightPictoSave);

    // Bandeau séparation
    var posXBandeau = posXAvatar + widthAvatar;
    var posYBandeau = posYAvatar;

    context.fillStyle = '#00a0e6';
    context.fillRect(posXBandeau, posYBandeau, 10, heightCard);

    // Textes
    var mesureEcvText = context.measureText("ECV Digital");
    var widthEcvText = mesureEcvText.width;
    context.font = "15px Arial";
    context.fillStyle = "#00a0e6";
    context.fillText("ECV Digital", (posXBandeau + 135), posYBandeau + 20);

    // Info user
    // Nom de l'utilisateur
    context.font = "30px Arial";
    context.fillStyle = "#00a0e6";
    context.fillText(element.firstName, (posXBandeau + 30), posYBandeau + 60);
    context.fillText(element.lastName, (posXBandeau + 30), posYBandeau +100);

    // Texte année
    context.font = "25px Arial";
    context.fillText(element.annee, (posXBandeau + 30), posYBandeau + 140);

    // Texte filière
    context.font = "18px Arial";
    context.fillText(element.filiere, (posXBandeau + 30), posYBandeau + 160);

    // Bandeau de séparation 
    context.fillRect(posXBandeau + 30, posYBandeau + 180, 170, 5);

    var posYOptionalInfos = 210;

    // Parcours tous les éléments de l'objet listeUsers
    for (var i in element.optionalInfos) {
        // Si l'élément n'est pas vide et si le champs val n'est pas vide
        if (element.optionalInfos[i] != '' && element.optionalInfos[i]["val"] != '') {
            // On parcours cette élément
            for (var a in element.optionalInfos[i]) {
                if (a === "icone") {
                    var picto = new Image();
                    picto.src = element.optionalInfos[i][a];
                    var widthPicto = 24;
                    var heightPicto = 24;
                    context.drawImage(picto, (posXBandeau + 30), posYBandeau + posYOptionalInfos - heightPicto + 5, widthPicto, heightPicto);
                } else if ( a === "val" ) {
                    context.fillText(element.optionalInfos[i][a], (posXBandeau + 60), posYBandeau + posYOptionalInfos);
                }
                
            //     if (i === "email") {
            //     var lines = a.split(/(?=@)/g);

            //     for (var ite = 0 ; ite < lines.length ; ite++) {
            //         context.fillText(lines[ite], (posXBandeau + 30), posYBandeau + posYOptionalInfos);
            //         posYOptionalInfos += 20
            //     }
            // } else {
            //     context.fillText(element.optionalInfos[i], (posXBandeau + 30), posYBandeau + posYOptionalInfos);
            // }
            
            }
            posYOptionalInfos += 30;   
        }
    }
}

downloadCanvas.addEventListener('click', function (){
    var canvasDownload = document.createElement('canvas');
    canvasDownload.width = widthCard;
    canvasDownload.height = heightCard;
    canvasDownload.getContext('2d').drawImage(canvas, posXCard, posYCard, widthCard + 150, heightCard, 0, 0, widthCard + 150, heightCard);
    downloadCanvas.href = canvasDownload.toDataURL();
    downloadCanvas.download = "card_" + currentUser + ".png";
});

window.onload = onLoad;