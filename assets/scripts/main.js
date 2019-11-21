//Connecting to socket io
const socket = io.connect('http://localhost:8080')

function surligne(champ, erreur)
{
   if(erreur)
      champ.style.backgroundColor = "#fba";
   else
      champ.style.backgroundColor = "";
}

//On controle que c'est bien une URL video


//On envoie la vidéo au serveur qui le stocket

