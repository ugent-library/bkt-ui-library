# Verificatie — wie gebruikt de querytaal echt, en hoe?

*Volledige pass over de frontend query log (2025-12-31 → 2026-07-09, 101.940.897 regels), 2026-08-03. Aanvulling op `REPORT-search-log-analysis.md`, gericht op de advanced/expert tiers — het bewijs onder de query-builder-bet. Zelfde privacyregels als het hoofdrapport: alleen aggregaten, geen namen of ruwe queries.*

## De ene alinea

De querytaal heeft twee totaal verschillende gebruikersgroepen. **Mensen die queries schrijven** zijn zeldzaam (3.589 form-queries in ruim zes maanden, ~19/dag) maar hun queries zijn precies wat een builder moet kunnen: 1–3 condities uit een klein veldenlijstje, AND-gekoppeld, met als enige veelvoorkomende OR-vorm een *waardenlijst binnen één veld* (75% van alle menselijke OR's). **Machines die queries afspelen** zijn de massa: 64,4M direct-hits (63% van al het verkeer), 51% uniek (hoofdrapport), gedomineerd door gegenereerde author/keyword/parent-permalinks en embeds. De builder is dus geen zoek-UI voor de massa — het is de **authoring-omgeving voor het permalink/embed-contract**: de ~19 queries die mensen per dag bouwen, worden daarna miljoenen keren afgespeeld.

## Menselijke power-queries (advanced/form n=3.107, expert/form n=482)

**Aantal condities (advanced/form):** 64% één conditie, 26% twee, 10% drie of meer (max 10). De builder moet uitblinken in het 1–3-conditiegeval.

**Velden, advanced/form (top):** author 887 · basic/vrije tekst 676 · year 393 · title 377 · type 355 · publication 274 · parent 274 · id 234 · affiliation 214 · external 199 · classification 190 · project 75 · abstract 66 · file.access 63 · publicationstatus 61.

**Velden, expert/form (top):** author 1.163 · doi 644 · file.access 263 · year 239 · affiliation 230 · classification 202 · type 142 · publication_status 73 · project.id 72 · external 58 · parent 41 · embargo 31 · subject 30 · editor 22.

De unie is ~16 velden. Een builder die deze dekt, dekt vrijwel alles wat mensen vandaag typen.

**Boolean-gebruik.** OR komt voor in 181 van 3.589 menselijke power-queries (5%). Vorm-classificatie van die 181:

| vorm | n | wat het is |
|---|---:|---|
| zelfde-veld OR | 136 (75%) | waardenlijst binnen één veld: batches van id's, DOI's, author-ID's; classification B1 OR B2 |
| gemengd-veld OR | 45 (25%) | grotendeels het author/editor-idioom (zie onder) plus enkele echt samengestelde gevallen |

De dominante menselijke OR is dus **"veld is een van [lijst]"** — vaak lange geplakte lijsten (id-batches tot 100+ waarden, DOI-lijsten van 50+). Dat is een *batch-lookup-taak* ("maak een lijst van precies deze records"), geen boolean redeneertaak. Een plak-een-lijst-invoer is een eersteklas use case.

**Het author/editor-idioom.** De meest voorkomende gemengd-veld OR is `author=X or (type any "bookEditor issueEditor" and editor=X)` — "alles waar X auteur óf editor van is". In het direct-verkeer is dit patroon gigantisch: 18,4M hits (54% van expert/direct). Dit hoort geen boolean-UI te zijn maar een **systeemvoorziening** (bv. een vinkje "ook editor-rollen" bij een persoon-conditie).

**Bereiken.** 195 menselijke power-queries (5,4%) gebruiken >=, <=, < of > — vrijwel altijd year. Een jaar-bereik-input volstaat.

## Het machine-contract (direct: 30,0M advanced + 34,4M expert)

**Velden advanced/direct (steekproef 1:1009):** author 23.209 · keyword 12.212 · parent 5.018 · issn 1.194 · affiliation 550 · publisher 458 · classification 135 · promoter 127 · project.id 115. Dit zijn de scoped-navigation- en embed-permalinks uit het hoofdrapport.

**Uniciteit:** binnen de steekproef is 92% van de direct-queries uniek, maar dat cijfer overschat de populatie-uniciteit structureel (een URL met honderden hits verschijnt in een 1:1009-sample vaak maar één keer en oogt dan "uniek"). Het betrouwbare cijfer is dat van het hoofdrapport op volledige data: **51% uniek**. De kwalitatieve conclusie blijft: een lange staart van gebookmarkte, geciteerde, geëmbedde URL's, met een zware kop van veel-herafgespeelde permalinks. Embed-parameters (`;hide_info=1`, `;style=`) komen in het wild voor.

**Expert/direct is machinaal:** OR in ~100% van de queries, maar 54% is het ene author/editor-idioom — gegenereerde boilerplate, geen menselijke boolean-compositie.

## Wat dit betekent voor de query-builder-bet

1. **Doelgroep bevestigd, maar herframed.** Er is geen massapubliek voor een rijkere zoek-UI (bevestigt hoofdrapport P3). Er is wél een kleine populatie die query-URL's *maakt* die daarna 63% van al het verkeer dragen. De builder is een authoring-tool voor dat contract — succes meet je aan de kwaliteit en het gebruik van de *geproduceerde permalinks/embeds*, niet aan zoekvolume.
2. **Platte rijen volstaan.** 90% van de menselijke queries is 1–2 condities; AND-gekoppeld.
3. **"Is any of" met plak-ondersteuning dekt 75% van de OR-behoefte.** Volwaardige OR-groepen (Zapier-model) zijn pas nodig voor de resterende 25% — en de helft dáárvan verdwijnt als het author/editor-idioom een vinkje wordt.
4. **~16 velden, 4 input-soorten:** tekst (contains/exact), keuzelijst (type, classification, affiliation, file.access, publicationstatus, external), persoon/record-typeahead (author, editor, project, parent/publication), jaar-bereik, plus plak-een-lijst (id, doi).
5. **URL/Embed/API als tabs is gevalideerd:** embeds met parameters bestaan al in het wild; de permalink is een duurzaam, geciteerd artefact.

## Methodenoot

Volledige log gecomprimeerd verwerkt (9× zstd-chunks, +8 regel-artefacten op chunkgrenzen, verwaarloosbaar). Form-tiers volledig geëxtraheerd (168.826 regels); direct/link/bot/results gesampled 1:1009 (108.061 regels). Veldextractie via patroon `veld (=|<|>|exact|any|all)`. Alle verwerking lokaal; geen ruwe queries of identifiers in dit rapport.
