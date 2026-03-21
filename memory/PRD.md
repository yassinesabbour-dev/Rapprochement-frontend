# PRD — Rapprochement factures / relevés bancaires

## Problème initial
comment faire pour rapprochez mes factures avec les relever bancaires

## Choix et attentes utilisateur
- Application web simple en français
- Import multi-format pour factures et relevés
- Rapprochement automatique par montant, date et référence
- Gestion des virements qui regroupent plusieurs factures
- Résultats attendus : payées / partielles / non rapprochées / à vérifier
- Export CSV du rapprochement
- Support PDF demandé ensuite pour factures et relevés
- Mélange de PDF texte et PDF scannés
- Extraction de toutes les informations utiles détectables
- Documents surtout en français standard
- Devises utilisées : MAD et EUR

## Décisions d’architecture
- Frontend React + React Router + Tailwind + composants shadcn/ui
- Backend FastAPI avec persistance MongoDB
- Atelier unique de rapprochement stocké en base (`reconciliation_workspaces`)
- Moteur de rapprochement séparé dans `backend/reconciliation_engine.py`
- Service PDF dédié dans `backend/pdf_extraction_service.py`
- Stratégie PDF hybride :
  - PDF texte : extraction locale via `pypdf` + heuristiques standards
  - PDF plus difficiles / scannés : OCR/vision via LLM avec sortie JSON structurée
- Matching multi-devises : rapprochement autorisé uniquement à devise identique
- Export CSV côté backend pour sortie comptable simple

## Ce qui a été implémenté
- Interface complète avec pages Accueil, Import, Rapprochement, Résultats
- Chargement d’un jeu de démonstration orienté virements multi-factures
- Import factures et relevés en CSV / XLS / XLSX / JSON / PDF
- Lecture PDF des factures et relevés bancaires
- Support des PDF texte et des PDF scannés testés avec exemples MAD
- Extraction des champs utiles depuis PDF avec devise, dates, références, libellés, montants
- Gestion des devises MAD / EUR dans le matching, les métriques et l’affichage UI
- API de rapprochement : workspace, démo, reset, import, run, manual-match, export CSV
- Vue de rapprochement avec sélection d’un virement et association manuelle à plusieurs factures
- Tableau de résultats avec métriques par devise, statuts et export
- Correctifs appliqués après tests : validation stricte du manual match, parsing ISO des dates, prompt PDF banque corrigé, affichage correct des zéros par devise
- Jeux de test persistants ajoutés dans `/app/tests/data/`

## Backlog priorisé
### P0
- Permettre la suppression/modification d’une association manuelle existante
- Ajouter une vue de validation explicite des champs PDF incertains avant rapprochement
- Afficher diff exacte entre total sélectionné et montant du virement dans la zone manuelle

### P1
- Support avancé de relevés bancaires multi-lignes / multi-pages avec regroupement plus fin
- Modèles PDF/CSV téléchargeables pour guider les imports
- Export Excel enrichi avec onglets synthèse, écarts et exceptions

### P2
- Historique multi-dossiers / multi-périodes
- Règles de matching configurables par client ou banque
- Journal d’audit plus détaillé pour usage comptable

## Prochaines tâches recommandées
1. Ajouter édition/annulation des rapprochements manuels
2. Ajouter écran de validation des données PDF extraites
3. Ajouter filtres, recherche et segmentation des exceptions
4. Ajouter modèles d’import téléchargeables pour accélérer l’usage réel
