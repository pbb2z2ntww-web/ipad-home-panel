# Home Panel – iPad mini 2/3 (iOS 12)

Eine statische, deutschsprachige, fünfseitige Touch-Oberfläche für den alten Safari-Browser unter iOS 12. Kein Build, kein Framework, kein Konto zur Nutzung der Oberfläche erforderlich.

## Funktionen

- **Home**: Funktionierende lokale Uhr und Datum, Wetter für Hannover (standardmäßig), Kalenderstatus, Smart-Home-Vorschau.
- **Smart Home**: Interaktive **Demo**-Schalter, keine Gerätesteuerung.
- **Musik**: Spotify-**Demo**, Link zu Spotify im Browser, *keine echte Player-Steuerung*.
- **Fotos**: Lokale Bilder über die Dateiauswahl, Diashow; Bilder bleiben nur für die aktuelle Sitzung im Browser und werden nicht hochgeladen.
- **Einstellungen**: Dark/Light, 12/24-Stunden-Uhr, Wetterstandort (Hannover, Berlin, Hamburg, München), Fotointervall. Browser speichert nur diese Einstellungen lokal.

**Apple Kalender ist nicht verbunden.** Die Oberfläche zeigt das korrekt an. Für private iCloud-Kalender wird später eine geschützte Schnittstelle benötigt; gib private ICS-URLs oder Zugangsdaten niemals im öffentlichen GitHub-Repository an.

## Einrichtung via GitHub Pages (kostenlos)

1. Ein neues **öffentliches** Repository auf GitHub erstellen, z. B. `ipad-home-panel`.
2. Den **Inhalt dieses Ordners** in die Wurzel des Repositories hochladen: `index.html`, `style.css`, `app.js`, `assets/` und optional `README.md`.
3. Im Repository **Settings → Pages** auswählen.
4. Unter **Build and deployment → Source** `Deploy from a branch` wählen, Branch `main`, Ordner `/ (root)` auswählen und speichern.
5. Die angezeigte URL öffnen: gewöhnlich `https://DEIN-NAME.github.io/ipad-home-panel/` (der echte Name ist von deinem Repository abhängig).
6. Diese URL in **Safari auf dem iPad** aufrufen → **Teilen → Zum Home-Bildschirm** → als `Home Panel` hinzufügen.
7. Das Home-Bildschirm-Icon starten. Für Daueranzeige: **Einstellungen → Anzeige & Helligkeit → Automatische Sperre**, sofern verfügbar `Nie` wählen; ggf. **Geführter Zugriff** verwenden.

**Hinweis:** GitHub Pages ist öffentlich. Die App enthält keine privaten Daten oder Zugangsdaten. Die Fotos werden nicht auf GitHub gespeichert, sofern du sie nicht selbst in dein Repository hochlädst.

## Lokal testen

Auf dem Mac im Ordner `ipad-mini-dashboard`:

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` im Mac-Browser öffnen; auf dem iPad im selben WLAN ggf. `http://MAC-IP:8000` verwenden. **Für den dauerhaften Betrieb ist dieser Mac-Server nicht nötig**, sobald die Seite auf GitHub Pages veröffentlicht wurde.

## iOS-12-Kompatibilität

- HTML/CSS/Vanilla JavaScript im ES5-Stil; kein Modul-System oder Bundler.
- Keine `fetch`, `async/await`, optional chaining oder modernen CSS-Abhängigkeiten.
- Wetter über HTTPS/XMLHttpRequest an `api.open-meteo.com`, CORS und Internetverbindung erforderlich.
- Bei älteren Safari-Versionen kann der Wetterdienst oder Spotify aufgrund von TLS-/Browser-Anforderungen nicht funktionieren. Die lokale Uhr, Navigation und Demo bleiben nutzbar.
- Web-App-Modus auf dem Home-Bildschirm kann je nach iOS-Verhalten leicht von echtem Vollbild abweichen.
- Das Gerät hat einen alten Akku: auf Erwärmung/Akkuzustand achten und bei dauerhafter Nutzung die Helligkeit reduzieren.

## Dateien

- `index.html` – fünf Seiten, Navigation, Content.
- `style.css` – Dark/Light und Landscape/Portrait Responsive Layout.
- `app.js` – Uhr, Wetter, Tabs, Settings, Demo, Fotos.
- `assets/apple-touch-icon.png` – Home-Screen-Icon.
- `assets/icon.svg` – Browser-Favicon (ältere Browser ignorieren es ggf.).

## Spätere Integrationen

Für iCloud-Kalender oder Smart-Home-Geräte eine **private, authentifizierte Backend-Schnittstelle** verwenden. Keine Spotify-Client-Secrets, Home-Assistant-Token oder privaten ICS-URLs im Frontend hinterlegen.
