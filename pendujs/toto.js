function testerLettre(lettre, mot)
{
    res = mot.indexOf(lettre);
    if (res == -1)
    {
        return -1;
    }
    else
    {
        return 1;
    }
}

function creerPos(lettre, mot) {

    res = mot.indexOf(lettre);
    var tabPos = [];
    for (let i = 0; i < mot.length; i++) {
            var reponse = res;
            tabPos.push(reponse);
            depart = mot.indexOf(lettre, res + 1);
    }
    return tabPos;
}

function ajouterLettre(mot, index, lettre) {


    mot = mot.substr(0, index) + lettre + mot.substr(index + 1);

    return mot;
}

function ajouterLesLettre(motCoder, mot, lettre) {

    var tabPos =  creerPos(lettre, mot)

    if (tabPos != null) {
        for (let i = 0; i < tabPos.length; i++) {

            let index = tabPos[i];
            motCoder = ajouterLettre(motCoder, index, lettre);
        }
    }

    return motCoder;
}



//v1
function afficherMot(motCoder)
{
    afficheMot.innerHTML = '<h3>' + motCoder + '</h3>';
}

function testerLettre(lettre, mot, depart) {

    res = mot.indexOf(lettre, depart);
    var tabPos = [];
    for (let i = depart; i < mot.length; i++) {
        if (res == -1) {
            return tabPos;

        }
        else {
            var reponse = res;
            tabPos.push(reponse);
            res = mot.indexOf(lettre, res + 1);
        }
    }
    return tabPos;
}

function ajouterLettre(mot, index, lettre) {


    mot = mot.substr(0, index) + lettre + mot.substr(index + 1);

    return mot;
}

function ajouterLesLettre(motCoder, tabPos, lettre) {

    if (tabPos != null) {
        for (let i = 0; i < tabPos.length; i++) {

            let index = tabPos[i];
            motCoder = ajouterLettre(motCoder, index, lettre);
        }
    }

    return motCoder;
}

function testerGagner(nbErreurs, motCoder )
{
    if (nbErreurs == 8) // si nb erreur =8, partie perdue
    {
        return -1;
    }
    else if (motCoder.indexOf("_") == -1) // s'il y a un _ dans le tableau, la partie est en cours
    {
        return 1;
    }
    else
    {
        return 0;
    }
}