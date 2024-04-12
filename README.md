# WebRTC Project - Multiplayer Game

Questo repository contiene il materiale relativo al progetto universitario di WebRTC dell'anno 2024.

## Descrizione

Lo scopo del progetto è l'implementazione di un semplice gioco multiplayer web che prevede la competizione tra più giocatori che cercano di eliminarsi a vicenda.

Prendendo ispirazione dal film e gioco Tron, i giocatori si muovono lasciando dietro di loro una scia. Nel momento in cui un giocatore si scontra contro la scia di un altro verrà eliminato e farà guadagnare all'avversario un punto.

L'aspetto multiplayer è stato sviluppato prima con la libreria Socket.IO e poi con un'altra chiamata Geckos.IO (basata su WebRTC), con lo scopo di mettere a confronto le due tecnologie.

## Installazione

Nella directory sono presenti le due cartelle con le diverse implementazioni, la prima con Socket.IO la seconda con Geckos.IO.

### Docker

Per installare una delle due app tramite docker basta aprire un terminale nella cartella corrispondente e digitare il comando

```
 docker compose up --build
```

### Node

Nel caso si volesse far partire l'app direttamente con NodeJS basterà utilizzare il comando

```
 npm install
 npm start
```

## Documentazione

Nella cartella è presente la documentazione prodotta durante lo sviluppo. Un breve video che mostra la demo del software è disponibile al seguente [URL](https://drive.google.com/file/d/1jwCI-GQ0hXI76niullt7hPVWUH20w4gP/view?usp=sharing)

## Authors

- [Andrea Dinetti](https://github.com/AndreaDino)
- [Marika Sasso](https://github.com/MarikaSasso)
