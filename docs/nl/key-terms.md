---
title: "Begrippen: wenselijke moeilijkheden, never-skilling en de eeuwige junior"
description: "Korte definities van de begrippen achter leren programmeren met AI: wenselijke moeilijkheden, productief falen, cognitief uitbesteden, vaardigheidsverlies, never-skilling, de eeuwige junior en meer."
---
# Begrippen

De begrippen achter dit project, elk in één zin gedefinieerd, met de bron en het deel van het [literatuuronderzoek](research.md) waar het over gaat.

## Wenselijke moeilijkheden (desirable difficulties)

**Wenselijke moeilijkheden** zijn omstandigheden die oefenen trager en zwaarder laten voelen, maar onthouden en transfer op lange termijn verbeteren, zoals spreiden, ophalen uit je geheugen en zelf een antwoord bedenken (Bjork, 1994; Bjork & Bjork, 2011). Een AI-assistent haalt precies die moeilijkheden weg, en daarom brengt de harnas er een deel van terug. Zie [§2.2](research.md#22-frictie-wenselijke-moeilijkheden-desirable-difficulties-tegenover-vastlopen).

## Illusie van competentie

Een **illusie van competentie** is het idee dat je iets hebt geleerd omdat het oefenen makkelijk voelde, een oordeel dat systematisch verkeerd is (Koriat & Bjork, 2005). Werkende code en vlotte uitleg van een AI maken die illusie sterker. Zie [§2.2](research.md#22-frictie-wenselijke-moeilijkheden-desirable-difficulties-tegenover-vastlopen).

## Productief falen (productive failure)

**Productief falen** is worstelen met een probleem voordat je uitleg krijgt, wat begrip en transfer kan verbeteren, zolang er daarna uitleg volgt die op je poging voortbouwt (Kapur, 2008, 2016). Een meta-analyse van 53 studies vond een gemiddeld voordeel (g = 0,36; Sinha & Kapur, 2021). Zie [§2.2](research.md#22-frictie-wenselijke-moeilijkheden-desirable-difficulties-tegenover-vastlopen).

## Cognitief uitbesteden (cognitive offloading)

**Cognitief uitbesteden** is een hulpmiddel gebruiken om het denkwerk van een taak te verminderen, wat mensen doen zodra dat goedkoper is (Risko & Gilbert, 2016). Je onthoudt de uitbestede inhoud dan slechter, vooral als je geen expliciet doel hebt om die te leren. Zie [§2.10](research.md#210-automatisering-uitbesteden-overmatige-afhankelijkheid-en-vaardigheidsverlies).

## Vaardigheidsverlies (deskilling)

**Vaardigheidsverlies** is een vaardigheid kwijtraken die je had, omdat automatisering het werk nu doet. Wie het routinewerk automatiseert, haalt de oefening weg die mensen nodig hebben voor de zeldzame moeilijke gevallen (Bainbridge, 1983). Het eerste sterke signaal uit de praktijk komt uit de geneeskunde: na routinematig gebruik van AI vonden ervaren endoscopisten zonder AI minder adenomen (Budzyń et al., 2025). Zie [§2.10](research.md#210-automatisering-uitbesteden-overmatige-afhankelijkheid-en-vaardigheidsverlies).

## Never-skilling

**Never-skilling** is een vaardigheid helemaal niet opbouwen, omdat AI het werk doet voordat je het ooit leerde. Medisch opleiders gebruiken de term voor artsen in opleiding (Abdulnour, Gin & Boscardin, 2025). Voor een student of een junior is dit het scherpere risico: een expert moet een vaardigheid *houden*, een beginner moet hem nog *verwerven*. Zie [§2.10](research.md#210-automatisering-uitbesteden-overmatige-afhankelijkheid-en-vaardigheidsverlies).

## Het eeuwige-juniorprobleem

Het **eeuwige-juniorprobleem** ontstaat als een junior developer werk aan een AI-agent geeft voordat hij het zelf kan: het werk komt af, maar de vaardigheden die van een junior een medior of senior maken, groeien niet. Dit onderzoek bedacht de term; het is never-skilling op het werk. Zie [§2.12](research.md#212-het-eeuwige-juniorprobleem) en [Voor junior developers](for-juniors.md).

## Paradox van toezicht

De **paradox van toezicht** is dat het controleren van AI-uitvoer precies de vaardigheden vraagt die het uitbesteden aan AI laat slijten. Anthropic gaf het die naam na interviews met de eigen engineers (bron van een leverancier). Zie [§2.10](research.md#210-automatisering-uitbesteden-overmatige-afhankelijkheid-en-vaardigheidsverlies).

## Opbouwen, uitbesteden, onderhouden

**Opbouwen, uitbesteden, onderhouden** is de afweging die dit project voorstelt: bouw een vaardigheid eerst met de hand op, besteed die uit aan de AI zodra je hem beheerst, en houd hem bij met korte herhalingen in je eigen werk. Elk onderdeel volgt een principe met empirische steun; de combinatie is niet getest. Zie [§2.11](research.md#211-synthese-ontwerpprincipes) en [Voor onderzoekers](researchers.md).

## Autonomieladder (L0–L4)

De **autonomieladder** is een niveau per vaardigheid dat bepaalt hoeveel de AI mag doen: van L0 (de AI doet het voor op een ander onderwerp) tot L4 (de AI doet het, jij houdt toezicht). Op L1–L3 houdt een hook de AI tegen om jouw code te schrijven, te bouwen of te testen. Zie [Hoe het werkt](how-it-works.md#niveaus-per-vaardigheid) en [§5.2](research.md#52-de-autonomieladder-per-vaardigheid).

## Hintladder

Een **hintladder** is hulp in treden die elk iets meer weggeven: een vraag, een vindplaats, een schets, een klein voorbeeld over een ander onderwerp, en pas dan een uitgewerkte oplossing. De volgende trede komt pas na een zichtbare poging. Zie [Hoe het werkt](how-it-works.md#de-hintladder-l2) en [§5.3](research.md#53-frictie-afstemmen-en-de-hintladder).

## Gespreide herhaling

**Gespreide herhaling** is een beheerste vaardigheid herhalen met groeiende tussenpozen, zodat hij niet wegzakt. Gespreid oefenen werkt beter dan alles in één keer (Cepeda et al., 2006), en cognitieve vaardigheden zoals correcte code uit je hoofd schrijven zakken sneller weg dan fysieke (Arthur et al., 1998). In de harnas is een herhaling op L4 het volgende moment dat de vaardigheid in je eigen werk langskomt. Zie [§2.5](research.md#25-onthouden-na-beheersing-gespreid-oefenen-ophalen-en-verval-van-vaardigheden) en [§5.7](research.md#57-gespreide-herhaling-na-beheersing).

## Transfertaak

Een **transfertaak** is een nieuwe oefening in een ander domein, zonder enige hint opgelost, die laat zien dat een vaardigheid ook buiten de oefeningen werkt waarop je oefende. In de harnas is die nodig voordat een vaardigheid van L3 naar L4 gaat. Zie [Hoe het werkt](how-it-works.md#doorstromen-en-herhalingen).
