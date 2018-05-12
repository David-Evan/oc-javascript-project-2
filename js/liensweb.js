/**
Activité 2 - Création d'un gestionnaire de lien
*/

/**
 * Pour la réalisation de cette activité, j'ai souhaité partir sur approche totalement orienté objet. Ce choix a été fait
 * pour plusieurs raison :
 *  - Le code produit est très modulable (possibilité d'utiliser le Gestionnaire de lien sans évenements etc...)
 *  - Le code peut être évolutif facilement (ajout d'une fonction de modification des liens par exemple )
 *  - Le code peut être séparer facilement en tant que composant et venir se greffer dans une base déjà existante
 *
 *  Mais aussi :
 *  - Pour moi, cette approche était plus complexe à appréhender. L'eventManager m'a créé quelques difficultés avec
 *  la portée de la variable this et le fonctionnement des fonctions anonymes.
 *
 *
 * Je me suis fixé pour contrainte de :
 *  - Aucun code javascript au sein de la page html (l'approche onclick="(EventManager.supprimerlien(url)))" aurait été bien plus simple à mettre en oeuvre ...
 *  - Aucune utilisation de librairie tierce (jQuery ...)
 *  - Un code répondant aux bonnes pratiques de programmation (ceux que je connais jusqu'à maintenant ...).
 *  - Rajouter la possibilité de supprimmer les liens
 *
 * Je me suis seulement permis d'intégrer le fichier css de bootstrap pour donner une alure plus agréable à l'application.
 * La maitrise du langage css n'étant pas le but de cet exercice
 *
 *
 * Grâce à cet exercice j'ai pu découvrir / approfondir :
 *  - Le fonctionnement du modèle objet javascript
 *  - Le fonctionnement des évenements
 *  - L'utilisation de la documentation https://developer.mozilla.org/fr/docs/Web/JavaScript
 *  et bien d'autre !
 *
 * J'ai volontairement choisi de ne pas extraire les prototypes d'objets de ce fichier pour éviter de multiplier les fichiers.
 * Idéalement, celui-ci devrait être stocké dans un fichier séparé.
 */



/**
 * Liste de lien faisant office de données initiale
 */
var listeLiens = [
    {
        titre: "So Foot",
        url: "http://sofoot.com",
        auteur: "yann.usaille"
    },
    {
        titre: "Guide d'autodéfense numérique",
        url: "http://guide.boum.org",
        auteur: "paulochon"
    },
    {
        titre: "L'encyclopédie en ligne Wikipedia",
        url: "http://Wikipedia.org",
        auteur: "annie.zette"
    }
];

/**
 * L'eventManager du gestionnaire de lien a pour rôle de :
 *    - Ajouter les listener d'évenement sur les différents composants
 *    - Lancer les actions correspondantes
 *
 *    Il ne manipule pas directement les liens et a besoin d'un objet "GestionnaireDeLien" pour pouvoir fonctionner.
 *    Son rôle se limite à "manager" les événements
 */
var GestionnaireDeLienEventManager = {

    listID : {
        zoneDeNotification : "zoneDeNotification",
        zoneListeDeLien : "contenu",

        btnDeGestion : "btnDeGestion",
        btnAfficherFormulaireAjoutLien : "btnAfficherFormulaireAjoutLien",
        btnViderListe : "btnViderListe",
        btnValiderAjoutLien : "btnValiderAjoutLien",
        btnAnnulerAjoutLien : "btnAnnulerAjoutLien",

        champAuteur : "auteur",
        champTitre : "titre",
        champUrl : "url",

        zoneFormulaireAjouterLien : "zoneFormulaireAjouterLien",
        formulaireAjouterLien : "formulaireAjouterLien"
    }, // Liste d'element id="xxx" utilisé par gérer les composants HTML
    gestionnaireDeLien : null, // Lien vers le gestionnaire de lien (qui sera manipulé par l'objet EventManager)


    /**
     * Initialise l'eventManager en lui indiquant le gestionnaire de lien à utiliser
     * @param gestionnaireDeLien
     */
    init: function (gestionnaireDeLien) {
        this.gestionnaireDeLien = gestionnaireDeLien;
        this.actionReinitialiserControles();
    },

    /**
     * Affiche le formulaire d'ajout de lien
     */
    afficherFormulaireAjoutLien: function () {
        document.getElementById(this.listID.formulaireAjouterLien).style.display = null;
        document.getElementById(this.listID.btnDeGestion).style.display = "none";
    },

    /**
     * Affiche un message de notification à l'utilisateur, puis le supprime au bout de x sec avec un effet de "fadeOut"
     * @param message - Message à afficher
     * @param dureeAffichage - Temps en millisecondes d'affichage du message
     */
    afficherNotification : function (message, dureeAffichage = 2000) {
        let zoneDeNotification = document.getElementById(this.listID.zoneDeNotification);
        zoneDeNotification.innerText = message;

        zoneDeNotification.style.opacity = '1';

        setTimeout(() =>{
            // Diminution progressive de l'opacité pour éviter l'effet brutal
           let intervalID = setInterval( ()=>{
                let currentOpacity = parseFloat(zoneDeNotification.style.opacity);

                if (currentOpacity === 0)
                    clearInterval(intervalID);

                zoneDeNotification.style.opacity = currentOpacity-0.01;
            }, 10);
        }, dureeAffichage);
    },

    /**
     * Permet l'ajout d'un lien à la liste.
     */
    actionAjouterLien: function() {

        let auteur = document.getElementById(this.listID.champAuteur).value;
        let titre = document.getElementById(this.listID.champTitre).value;
        let url = document.getElementById(this.listID.champUrl).value;
        let lien = this.gestionnaireDeLien.creerLien(titre, url, auteur);

        this.gestionnaireDeLien.ajouterLien(lien);
        this.gestionnaireDeLien.afficherTousLesLiens();
        this.afficherNotification('Le lien '+titre+' a bien été ajouté à la liste');

        this.actionReinitialiserControles();
        this.addListenerSupprimerLien(); // Ajout un listener sur le nouveau lien crée.
    },

    /**
     * Réinitialise les controles de l'interface utilisateur
     */
    actionReinitialiserControles: function(){
        let formulaire = document.getElementById(this.listID.formulaireAjouterLien);
        formulaire.reset();
        formulaire.style.display = "none";

        document.getElementById(this.listID.btnDeGestion).style.display = null;
    },

    /**
     * Supprime le lien défini par l'url
     * @param url
     */
    actionSupprimerLien: function(url) {
        this.gestionnaireDeLien.supprimerLien(url);
        this.afficherNotification('Votre lien vers "'+url+'" à bien été supprimé');
        this.addListenerSupprimerLien();
    },

    /**
     * Vide la liste de lien
     */
    actionViderListe: function () {
        this.gestionnaireDeLien.supprimerTousLesLiens();
        this.afficherNotification("La liste de lien vient d'être effacée !")
    },

    /**
     * Démmare tous les listeners
     */
    startAllListeners:function () {
        this.addListenerAfficherFormulaireAjoutLien();
        this.addListenerReinitialiserControles();
        this.addListenerViderListe();
        this.addListenerAjouterLien();
        this.addListenerSupprimerLien();
    },

    /**
     * Ajoute un listener sur le formulaire d'ajout de lien
     */
    addListenerAfficherFormulaireAjoutLien:function () {
            document.getElementById(this.listID.btnAfficherFormulaireAjoutLien).addEventListener('click',
                () => this.afficherFormulaireAjoutLien(this))
    },

    /**
     * Ajoute un listener sur le bouton Ajouter Lien
     */
    addListenerAjouterLien: function () {

        document.getElementById(this.listID.formulaireAjouterLien).addEventListener('submit', (e) => {
                e.preventDefault();
                this.actionAjouterLien(this);
            });
    },

    /**
     * Ajoute un listener sur le bouton "Annuler"
     */
    addListenerReinitialiserControles :function () {
        document.getElementById(this.listID.btnAnnulerAjoutLien).addEventListener('click',
            () => this.actionReinitialiserControles(this));
    },

    /**
     * Ajoute un listener sur chaque bouton supprimé (associé chacun à un lien)
     */
    addListenerSupprimerLien : function () {
        let listeBoutonsSupprimer = document.querySelectorAll('.'+this.gestionnaireDeLien.nomBtnSupprimer);

        listeBoutonsSupprimer.forEach( (btnSupprimer) => {
            btnSupprimer.addEventListener('click', () =>
                this.actionSupprimerLien(btnSupprimer.dataset.url, this));
        });
    },

    /**
     * Ajoute un listener sur le bouton "Vider Liste"
     */
    addListenerViderListe:function () {
        document.getElementById(this.listID.btnViderListe).addEventListener('click',
            () => this.actionViderListe(this));
    },
};

/**
 * Le Gestionnaire de Lien à pour rôle de :
 *    - Manipuler une liste de lien (ajout, supression ...)
 *    - Créer / Supprimer les composants HTML.
 *
 *    Il ne réagit directement à aucun événement et n'a pas besoin de l'EventManager pour fonctionner.
 */
var GestionnaireDeLien = {

    listeDeLiens: [], // Collection qui contiendra l'ensemble des liens
    containerID: "contenu", // ID de l'element dans lequel la liste de lien sera inséré
    nomBtnSupprimer : "btn-action-supprimer-lien",

    /**
     * Permet le démarrage du gestionnaire de lien.
     * Ajoute les données de démarrage et modifie l'ID du container si spécifié.
     * @param donneesInitiales - Données de démarrage.
     * @param containerID - ID de l'element dans lequel la liste de lien sera inséré
     */
    init: function(donneesInitiales = null, containerID = null) {
        if(containerID !== null)
            this.containerID = containerID;

        this.chargerDonneesInitiales(donneesInitiales);
    },

    /**
     * Permet la création d'un "lien" au format {titre: xxx, url: xxx, auteur:xxx }. Ajoute [http://] si le lien ne le possède pas
     * @param titre - Titre du lien
     * @param url - URL du lien. Si http:// ou https:// ne sont pas existant, l'ajoute.
     * @param auteur - Auteur du lien
     * @returns {{titre: string, url: string, auteur: string}}
     */
    creerLien: function(titre, url, auteur){

        let regExpUrl = new RegExp('^https?:\/\/');
        // Supprime les espaces dans le lien et le ramène en minuscule
        url = url.replace(/\s/g,'').toLowerCase();

        return  {
            titre: titre,
            url: (regExpUrl.test(url) ? url : 'http://' + url),
            auteur : auteur
        };
    },

    /**
     * Ajoute le lien à la liste en cours.
     * @param lien - format {titre: xxx, url: xxx, auteur:xxx }
     * @param insererAuDebut - Si insererAuDebut vaut true, alors le lien sera ajouté en haut de la liste.
     * @param rafraichirAffichage
     */
    ajouterLien: function(lien, insererAuDebut = true, rafraichirAffichage = true) {
        if(insererAuDebut)
            this.listeDeLiens.unshift(lien);
        else
            this.listeDeLiens.push(lien);

        if (rafraichirAffichage)
            this.afficherTousLesLiens(true);
    },

    /**
     * Permet l'ajout et l'affichage d'un élément au div #cible (format HTML)
     * @param lien - format { titre : string , url : string, auteur : string}
     */
    afficherLien: function (lien) {
    // Création de la balise "<div class="lien"></div>"
    let divElement = document.createElement('div');
    divElement.classList.add('lien');

    // Création de la balise "<a href="url">titre</a>
    let aElement = document.createElement('a');
    aElement.href = lien.url;
    aElement.textContent = lien.titre + ' ';
    // Ajout des élements de style ( style = "color: xxx....")
    aElement.style.color = "#428bca";
    aElement.style.fontWeight = 'bold';
    aElement.style.fontSize = "1.25em";
    aElement.style.textDecoration = 'none';

    // Création de la balise <span>url</span>
    let urlElement = document.createElement('span');
    urlElement.textContent = lien.url;

    // Création de balise <span> Ajouté par auteur</span>
    let authorElement = document.createElement('span');
    authorElement.textContent = "Ajouté par " + lien.auteur;

    // Création de la balise <span class="glyphicon glyphicon-cross-sign"></span
    let trashElement = document.createElement('span');
    trashElement.classList.add('glyphicon','glyphicon-remove', 'pull-right', this.nomBtnSupprimer);
    trashElement.style.color = '#d9534f';
    trashElement.style.cursor = 'pointer';
    trashElement.dataset.url = urlElement.textContent = lien.url;

    // Ajout des différents éléments
    divElement.appendChild(aElement);
    divElement.appendChild(urlElement);
    // Ajout d'un élément "<br />"
    divElement.appendChild(document.createElement('br'));
    divElement.appendChild(authorElement);
    divElement.appendChild(trashElement);

    // Insertion du nouveau <div> à l'interieur de "#contenu"
    document.getElementById(this.containerID).appendChild(divElement);
    },

    /**
     * Permet le chargement des données initiales si celles-ci existes
     * @param listeLiens - Tableau de données à charger.
     * @returns Number - Renvoi le nombre de données initiales chargées
     */
    chargerDonneesInitiales: function (listeLiens) {
        if (listeLiens !== null) {
            listeLiens.forEach((lien) => {
                this.ajouterLien(lien);
            });

            return listeLiens.length;
        }
        return 0;
    },

    /**
     * Permet l'affichage de toute la liste des liens
     * @param reinitialiserContainer - Réinitialise le contenu de CibleID avant l'affichage si reinitialiserContainer vaut true
     */
    afficherTousLesLiens: function (reinitialiserContainer = true) {
        if(reinitialiserContainer)
            document.getElementById(this.containerID).innerHTML = null;

        this.listeDeLiens.forEach((lien) => {
            this.afficherLien(lien)
        });
    },

    /**
     * Supprime le lien de la liste de lien identifié par son url
     * @param urlLien - URL du lien à supprimer
     * @param rafraichirAffichage - Si true, alors appel "afficherTousLesLiens" pour mettre à jour l'affichage
     */
    supprimerLien: function (urlLien, rafraichirAffichage = true) {

       this.listeDeLiens.forEach((lien, index) =>{
           if(lien.url === urlLien)
                this.listeDeLiens.splice(index, 1);
        });

       if (rafraichirAffichage)
           this.afficherTousLesLiens();
    },

    /**
     * Supprime tout les liens
     * @param rafraichirAffichage - Si true, met à jour l'affichage de la liste
     */
    supprimerTousLesLiens : function (rafraichirAffichage = true) {
        this.listeDeLiens = [];
        if (rafraichirAffichage)
            this.afficherTousLesLiens();
    },

};


var gestionnaireDeLien = Object.create(GestionnaireDeLien);
gestionnaireDeLien.init(listeLiens);
gestionnaireDeLien.afficherTousLesLiens();

var eventManager = Object.create(GestionnaireDeLienEventManager);
eventManager.init(gestionnaireDeLien);
eventManager.startAllListeners();