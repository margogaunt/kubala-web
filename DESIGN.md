# DESIGN.md: Autoopravna Kubala

Zdroj pravdy pro vzhled webu. Návrh: jedna úvodní stránka, bez podstránek.

## 1. Vizuální téma a atmosféra
Čistý, produktivní a tmavý web, který působí jako dobře uklizený ponk. Člověk s rozbitým autem má do pěti vteřin vědět, jestli mu to opraví, jestli ho neošidí a jak se dovolá.
Klíčová slova: věcné, přehledné, tmavé, skutečné fotky.

## 2. Barvy a role
| Token | Hex | RGB | Role |
|---|---|---|---|
| `--bg` | #121315 | 18 19 21 | pozadí stránky |
| `--surface` | #1B1D20 | 27 29 32 | panely |
| `--line` | #2E3136 | 46 49 54 | linky a rámečky |
| `--text` | #F3F1ED | 243 241 237 | hlavní text |
| `--muted` | #A9ABAF | 169 171 175 | vedlejší text |
| `--accent` | #EE6A13 | 238 106 19 | tlumená neonová oranžová z loga, hlavní tlačítko, ikony |
| `--accent-hover` | #FF7E2B | 255 126 43 | hover tlačítka |
| `--on-accent` | #141211 | 20 18 17 | text na oranžové |
| `--ok` | #5FC48A | 95 196 138 | stav „otevřeno“ |

Hex hodnoty jsou jen v `:root`. Oranžová je jediný akcent.

## 3. Typografie
Písmo **Ubuntu** (Google Fonts, 400/500/700, latin-ext), záloha `system-ui, sans-serif`.
- H1: `clamp(2.1rem, 3.7vw, 3.25rem)`, 700, řádkování 1,08
- Nadpis panelu: 0,8125rem, 500, velká písmena, `--muted`
- Text: 15–17 px, řádkování 1,5
- Bez přechodů a stínů v textu.

## 4. Komponenty
- **Hlavní tlačítko:** oranžové, tmavý text, výška 52 px. Hover: světlejší. Active: `--accent` a posun o 1 px. Focus: obrys 3 px v `--text`.
- **Vedlejší tlačítko:** průhledné, rámeček `--line`. Hover: rámeček `--muted`. Focus stejný jako výše.
- **Panel:** `--surface`, rámeček 1 px `--line`, rádius 8 px.
- **Služby:** seznam s ikonou a linkou, ne karty.
- **Galerie:** velká fotka a 4 náhledy (tlačítka). Aktivní náhled má oranžový rámeček.
- **Stav otevřeno/zavřeno:** tečka a text podle času v Praze. Bez JS se nezobrazí.
- **Disabled:** web žádné neaktivní ovládací prvky nemá.

## 5. Rozvržení
Maximální šířka 1400 px, okraj 24 px, mezery 12 px. Na desktopu 2 sloupce (7:5) a pod nimi 3 panely (recenze, kontakt, mapa). Cíl: při 1280×800 se vše vejde na jednu obrazovku.

## 6. Hloubka
Žádné stíny. Hloubku dělá jen rozdíl `--bg` a `--surface` a linky.

## 7. Animace
Úroveň **L1**. Jen hover 150 ms a prolnutí fotky v galerii 200 ms. `prefers-reduced-motion` je vypíná.

## 8. Co dělat a co ne
**Dělat**
1. Telefon stále na očích.
2. Používat jen ověřené údaje (Firmy.cz, Instagram, Mapy Google).
3. Používat skutečné fotky z dílny.
4. Psát lidsky, bez žargonu.
5. Recenze citovat doslova, se jménem a zdrojem.

**Zakázané**
1. Slidery, vyskakovací okna, běžící pásy, parallax a animace písmen.
2. Fotky z fotobanky.
3. Superlativy typu „nejlepší servis v Ostravě“.
4. Vymyšlené ceny, záruky a sliby („všechny značky“, „zavoláme s cenou“), dokud je nepotvrdí majitel.
5. Prázdné sekce (ceník se přidá, až budou ceny).
6. Dlouhé scrollování a podstránky.
7. Rozmazané fotky (Kia).
8. Černo-červený „závodní“ vzhled.

## 9. Responzivita
Zlomy 960 / 760 / 480 px. Pod 960 px jeden sloupec. Pod 760 px pevná spodní lišta „Zavolat“ a „Navigovat“. Dotykové plochy aspoň 44 px, žádný vodorovný scroll.
