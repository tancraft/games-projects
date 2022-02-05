
// //creation du plateau de jeu
// var cases = document.querySelectorAll('.case');
// var j = 0;

// var tab1 = [1, 2, 3, 4, 5, 6, 7, 8];
// var tab2 = new Array;

// for (let i = 0; i < tab1.length; i++) {
//     tab2[i] = [tab1[i], Math.floor(Math.random() * 100)]
// }
// tab2.sort((a, b) => a[1] - b[1]);

// for (let i = 0; i < tab1.length; i++) {
//     tab1[i] = tab2[i][0];
// }

// var valeur = parseInt(tab1.length);
// tab1[valeur] = "vide";


// do {
//     let nb = tab1[j];
//     cases[j].setAttribute('id', nb);
//     if(j == valeur)
//     {
//         cases[j].textContent = "";
//     }
//     else
//     {
//         cases[j].textContent = nb;
//     }
    
//     j++
// } while (j < cases.length);

// //videX.videY

// // xc = e.target.getAttribute("x");
// // yc = e.target.getAttribute("y");

// // 1-2=1
// // videx-videy ==1 xor vidx-clicy==1

/* on mémorise l'emplacement de la case vide */
var videLig = 3;
var videCol = 3;

var nbclicks = 0;

/* Fonction qui échange la case (lig,col) avec la case vide */
function deplace(e) {
    var boutonClique = e.target;//recup de la case clicker
    var monID = boutonClique.id;//recup de son id
    //on recupere les coordonnees
    var lig = monID.substring(4, 5);
    var col = monID.substring(5, 6);
    var idVide = "case" + videLig + videCol
    var boutonVide = document.getElementById(idVide);
    //on regarde si la case cliquée est éloignée de 1 par rapport à la case vide (on exclu la diagonnale)
    // Math.abs donne la valeur absolue, c'est à dire la valeur sans signe
    // ^correspond au XOR
    if (Math.abs(videLig - lig) == 1 ^ Math.abs(videCol - col) == 1) {
        /* mise à jour du nombre de clics */
        nbclicks = nbclicks + 1;
        /* on récupère l'élément compteur */
        var noeud_compteur = document.getElementById('compteur');
        /* mettre à jour la valeur */
        noeud_compteur.innerHTML = nbclicks;

        /*On change les textes*/
        boutonVide.innerHTML = boutonClique.innerHTML;
        boutonClique.innerHTML = "";
        /* on échange les classes des deux boutons */
        boutonVide.setAttribute('class', boutonClique.getAttribute("class"));
        boutonClique.setAttribute('class', 'emptycase');
        /* on enlève le "focus" sur le bouton cliqué */
        boutonClique.blur();
        /* on mémorise l'emplacement de la case vide */
        videLig = lig;
        videCol = col;

    }
}

function initGame() {
    var tab = [];
    for (let i = 1; i < 9; i++) {
        tab[i - 1] = i;
    }
    var lesCases = document.getElementsByClassName("case");
    for (let i = 0; i < 8; i++) {
        alea = Math.ceil(Math.random() * tab.length - 1);
        var laClasse = "case"+tab[alea];//permet de creer le nom de la classe supplementaire
        lesCases[i].classList.add(laClasse);//permet de creer la classe dans la balise
        tab.splice(alea, 1);
        lesCases[i].addEventListener("click", deplace);
        
    }
    document.getElementsByClassName("emptycase")[0].addEventListener("click", deplace);
    console.log(lesCases);
}

initGame();
