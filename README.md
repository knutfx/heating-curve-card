# Heating Curve Card

Eine Custom Card für Home Assistant zur Visualisierung der Heizkurve. Zeigt die Beziehung zwischen Außentemperatur und Vorlauf-/Rücklauftemperatur an.

## Installation

### HACS (empfohlen)

1. Öffnen Sie HACS in Home Assistant
2. Gehen Sie zum Tab "Frontend"
3. Klicken Sie auf das "+" Symbol
4. Suchen Sie nach "Heating Curve Card"
5. Klicken Sie auf "Herunterladen"
6. Starten Sie Home Assistant neu

### Manuelle Installation

1. Laden Sie die Datei `heating-curve-card.js` herunter
2. Kopieren Sie sie in den `config/www` Ordner
3. Fügen Sie folgende Resource in Ihre `configuration.yaml` ein:

```yaml
lovelace:
  resources:
    - url: /local/heating-curve-card.js
      type: module
```

## Konfiguration

### Über die UI

1. Öffnen Sie Ihr Dashboard zum Bearbeiten
2. Klicken Sie auf "Karte hinzufügen"
3. Suchen Sie nach "Heating Curve Card"
4. Füllen Sie die Konfiguration aus

### YAML Konfiguration

```yaml
type: custom:heating-curve-card
title: Heizkurve
entities:
  vorlauf: sensor.heizung_temperatur_vorlauftemperatur
  ruecklauf: sensor.heizung_temperatur_r_cklauftemperatur
  aussen: sensor.home_temperatur
update_interval: 300  # Optional: Update-Intervall in Sekunden (Standard: 300)
```

## Optionen

| Option | Typ | Pflicht | Standard | Beschreibung |
|--------|-----|----------|---------|--------------|
| type | string | ja | - | `custom:heating-curve-card` |
| title | string | nein | Heizkurve | Titel der Karte |
| entities | object | ja | - | Sensor-Entitäten |
| update_interval | number | nein | 300 | Update-Intervall in Sekunden |

## Funktionen

- Zeigt Vorlauf- und Rücklauftemperatur in Abhängigkeit von der Außentemperatur
- Linien können einzeln ein-/ausgeblendet werden
- Automatische Aktualisierung der Daten
- Interaktive Tooltips zeigen genaue Temperaturwerte
