# Fields of Fire — Local Turn Assistant

Assistant local et autonome pour Fields of Fire Deluxe. Ouvrir `index.html` directement ou lancer `python3 -m http.server 8000` puis ouvrir `http://localhost:8000`.

## Version 0.5.0

Cette version étend l'architecture de mission à l'ensemble des campagnes intégrées au projet : Normandy, Keep Up The Fire!, Naktong River, Heartbreak Ridge et Vietnam.

Le sélecteur de campagne adapte désormais la liste des scénarios. Les dossiers de mission affichent le type, la durée, la visibilité, la carte, l'objectif, les Potential Contact et les principales particularités du scénario. Le moteur de séquence reste commun aux campagnes.

Le système de Potential Contact utilise les tables spécifiques aux missions lorsqu'elles sont encodées. Keep Up The Fire! dispose de ses packages allemands et de sa table Friendly Higher HQ Events. Les autres campagnes disposent de leurs tables de correspondance PC A/B/C ; lorsque le contenu détaillé d'un Enemy Force Package n'est pas encore transcrit dans l'interface, le numéro du package est affiché afin d'utiliser directement le tableau du livret de mission.

Les explications de phase sont présentées sous forme de paragraphes et restent centrées sur les règles pertinentes à la phase. Le site ne demande jamais de saisir un numéro de carte Action.

## Sources du projet

- Series Rules — 3rd Edition
- Errata & Clarifications — May 10, 2025
- Normandy Campaign
- Naktong River Campaign
- Heartbreak Ridge Campaign
- Vietnam Campaign
- Keep Up The Fire! stand-alone mission
- Player Aids et Field Manuals intégrés au projet

## Limite volontaire de cette version

Les tables détaillées de Friendly/Enemy Higher HQ Events et les descriptions complètes des Enemy Force Packages ne sont pas encore transcrites pour chaque mission de toutes les campagnes. Aucune donnée non vérifiée n'est inventée : lorsque l'interface ne possède pas encore la table détaillée, elle indique de revenir au livret de mission.


## v0.5.2

- Traduction complète de la phase 3.1 Friendly Higher HQ dans l’interface.
- Traduction française de toutes les entrées des tables Friendly Higher HQ actuellement intégrées.
- Conservation des termes de jeu officiels (CO HQ, BN HQ, Commands, PC Marker, R#, etc.) lorsque nécessaire.

## v0.5.1
- Ajout de la campagne **Battle of the Bulge** issue des *Missions Living Rules 2025*.
- 7 missions intégrées avec type, durée, visibilité, objectifs, Potential Contact, Enemy Activity/Experience et particularités de mission.
- La campagne est disponible dans le sélecteur avec les autres campagnes.


## v0.7.1 — Tables missionnelles complètes
- Reconstruction des tables propres à chaque mission à partir des livrets de campagne intégrés.
- Tables intégrées selon disponibilité : appui-feu, événements HQ supérieur ami, événements HQ supérieur ennemi, packages de forces ennemies/allemands, packages de contact, table de déclenchement des attaques, contre-attaque PC A et placement des unités/packages.
- Affichage contextuel des tables dans les phases concernées et accès à l’ensemble du dossier des tables de la mission.
- Traduction française des tableaux, avec conservation des termes techniques officiels de Fields of Fire (VOF, PDF, PC A, R#, LOS, Exposed, Pinned, Commands, etc.).
- Données de mission issues des livrets intégrés au projet, notamment Normandy, Heartbreak Ridge, Naktong River, Vietnam, Battle of the Bulge et Keep Up The Fire!.


### v0.7.1
- Les « tables complètes » sont maintenant rendues comme de véritables tableaux HTML avec colonnes et la même fonte que l’interface.
- Le déroulement détaillé des phases utilise de nouveau des listes à puces.


## v0.7.2
- Ajout d’un bouton « Séquence précédente » à côté du bouton de progression pour chaque séquence.
- La navigation arrière fonctionne également à l’intérieur des sous-séquences de la Mutual Combat Phase (3.7).
- En début de tour, le retour précédent ramène à la dernière phase du tour précédent.


## v0.7.3

- 3.7.4 : ajout d’une table de référence des résultats de combat.
- Conservation des références officielles `MISS`, `PIN`, `HIT`, `C`, `P`, `L`, `F` et `A`.
- Explications des effets entièrement présentées en français.


## v0.7.4
- Suppression de la colonne latérale gauche de l'interface.
- L'espace principal utilise désormais toute la largeur disponible.
