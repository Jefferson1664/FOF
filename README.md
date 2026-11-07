# Fields of Fire — Turn Assistant

**Version 0.4.1** (local)

Version 0.1 : SPA sans dépendances externes.

## Lancer

Ouvrir `index.html` dans un navigateur moderne. Pour un serveur local simple :

`python3 -m http.server 8000`

puis ouvrir `http://localhost:8000`.

## Choix de conception
- Aucun état complet de la carte n'est demandé.
- L'utilisateur saisit les résultats des Action Cards.
- Les tables sont affichées au moment où elles sont utiles.
- La campagne Normandy est intégrée comme premier jeu de données.
- Le moteur de séquence est séparé des données de mission pour permettre l'ajout des autres campagnes.

## Sources projet utilisées
- Fields of Fire Deluxe Series Rules, Third Edition.
- Errata & Clarifications — May 10, 2025.
- Normandy Campaign Mission Book.
- Player Aid — Sequence of Play.
- Player Aid — Charts & Tables.

## V0.2 — Potential Contact / Contact

Dans la phase 3.7.2, l'assistant ne demande plus le résultat textuel de l'Action Card. Il demande :
- le PC marker et le Current Activity Level ;
- si le tirage produit Contact ;
- si Contact, le R# 1–10 du tirage du German Contact Package ;
- puis le R# 1–8 de la table Unit Placement.

Les tables de German Contact Packages et Unit Placement sont intégrées par mission pour la campagne Normandy.
