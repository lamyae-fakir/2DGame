# Jeu 2D Multijoueur

## Description
Un jeu 2D multijoueur où jusqu'à 4 joueurs peuvent participer simultanément. Les joueurs doivent naviguer à travers différents niveaux avec des obstacles statiques et mobiles pour atteindre la sortie.

## Fonctionnalités
- Support de 1 à 4 joueurs
- 10 niveaux prédéfinis + niveaux générés procéduralement
- Obstacles statiques et mobiles
- Système de score
- Chronomètre par niveau
- Compte à rebours au début de chaque niveau
- Affichage du gagnant à la fin de chaque niveau

## Contrôles
### Joueur 1 (Rouge)
- Flèches directionnelles (↑, ↓, ←, →)

### Joueur 2 (Bleu)
- Z : Haut
- S : Bas
- Q : Gauche
- D : Droite

### Joueur 3 (Vert)
- T : Haut
- G : Bas
- F : Gauche
- H : Droite

### Joueur 4 (Violet)
- I : Haut
- K : Bas
- J : Gauche
- L : Droite

### Contrôles généraux
- Espace : Passer au niveau suivant
- Bouton "Niveau Suivant" : Passer au niveau suivant

## Installation
1. Clonez le repository
2. Ouvrez le fichier `index.html` dans votre navigateur
3. lancer la commande live-server pour executer le jeu 

## Technologies utilisées
- HTML5
- CSS3
- JavaScript (Vanilla)
- Canvas API

## Structure des fichiers

├── index.html
├── style.css
├── game.js
└── README.md

## Comment jouer
1. Ouvrez le jeu dans votre navigateur
2. Sélectionnez le nombre de joueurs
3. Attendez le compte à rebours
4. Guidez votre personnage jusqu'à la sortie (cercle bleu)
5. Évitez les obstacles noirs (statiques) et verts (mobiles)
6. Passez au niveau suivant avec la touche espace ou le bouton

## Niveaux
- Niveaux 1-10 : Difficulté progressive avec des configurations prédéfinies
- Niveaux 11+ : Génération procédurale avec difficulté croissante

## Scoring
- +4 points pour atteindre la sortie
- Le temps est enregistré pour chaque niveau
