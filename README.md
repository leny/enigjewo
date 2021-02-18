# enigjewo

> An open-source _remake_ of [**GeoGuessr**](https://www.geoguessr.com).

* * *

## About

This app is an open-source *remake* of the famous [**GeoGuessr**](https://www.geoguessr.com) game, made with [ParcelJS](https://v2.parceljs.org), [React](https://reactjs.org), [Firebase](https://firebase.google.com) & [Bulma](https://bulma.io).

This is originally inspired by [Geoguess](https://github.com/GeoGuess/Geoguess), as a _pegagogic project_ made for [BeCode](//becode.org), answering the question "*this should be so difficult to made a game like that by ourselves*".

### Features

- Solo game
- Multiplayer game over the internet
- 25 maps (random positions):
   - 🗺 3 Geographic Areas
	- 🌍 6 Continents
	- 🚩 14 Countries
   - 🌐 3 Misc Challenge Maps
	   - 🗿 Unesco (World Heritage List)
	   - 🏙 Biggest Cities (40 biggest cities of the world)
	   - 🔥 Inferno - two complex cities - Santa Cruz de la Sierra (Bolivia) & Touba (Senegal)

#### 👉 NOTE

This project was originally a _pegagogic project_ made for [BeCode](//becode.org).  
The project is still maintained, but I can't promess that I will be _reactive_ to fix bugs (the game is, still, _stable_) or adding new features.

However, feel free to propose stuff by creating a *Pull Request*.

## Deploy your instance

### 1. Prepare your env vars

#### 1.1 Get your Google Maps API key

- Go to [Google Maps Platform](https://cloud.google.com/maps-platform/)
- Click on **Get Started**
- On first time, a page will open to ask to activate *billing*

> Every month, Google [offers ±200$ of credits usage](https://cloud.google.com/maps-platform/pricing) for Google Maps API - its _way more_ than enough for normal usage

- Create Billing Account
- Go to [Google Developers Console](https://console.developers.google.com), then **Create a Project**
- In the **Library** menu, search for **Maps JavaScript API** & activate for the project
- In the **Credentials** menu, create an *API Key*

> You can (and should) come back later to add **key restriction** for your own domain only.

- Note the key for later

> 👉 You can get more detailed information here: [https://developers.google.com/maps/gmp-get-started](https://developers.google.com/maps/gmp-get-started).

#### 1.2 Get your Firebase App keys & vars

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new **Firebase Project** (you can disable *Google Analytics*)
- In the left menu, select **Realtime Database** (in the *Build* section), then create a database.
- In your database, go to **Rules** section, and replace the content with the following, then **Publish**.

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
- In the left menu, select **Project Overview**, then, under the main title, select the "Web" button (with the symbol `</>`).
- Name and register your app, then note the variables given in the "configuration" part of the script.

### 2. Deploy

#### 2.1 Deploy the code

Simply click the following button:  
[![](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/leny/enigjewo)  
Your app will not be ready yet - we need to set all our variables in the netlify admin.

> Usually, the netlify process should ask you for the variables - if not, follow the next section.

#### 2.2 Setup our variables

- In Netlify admin page, go to **Site Settings**, then **Build & Deploy**, then finally to **Environment**
- Create every following variable with your own values:
	- `GMAP_API_KEY`
	- `FIREBASE_API_KEY`
	- `FIREBASE_AUTH_DOMAIN`
	- `FIREBASE_PROJECT_ID`
	- `FIREBASE_DATABASE_URL`
	- `FIREBASE_STORAGE_BUCKET`
	- `FIREBASE_MESSAGE_SENDER_ID`
	- `FIREBASE_APP_ID`
- Come back to the 	**Deploys** page of Netlify then use the **Trigger deploy** button to deploy with the good values for your variables.

### 3. Enjoy!

Finally, you can click on the link netlify has generated for you, generally _some-weird-wordsAndNumbers.netlify.app_ and enjoy the game!

## Contribute - install locally

If you want to install the game locally for dev or testing, it's fairly easy - you only need [NodeJS](https://nodejs.org).

After cloning the repo and creating your env vars as explained before, rename the `.env.sample` to `.env` and fill it with your variables.

Now, run the following commands from within your repository:

- `npm install`
- `npm run work`

This will run a local server wich will reload at every changes in the code.

* * *

February 2021, leny  
Background photo by [Tabea Damm](https://unsplash.com/@tabeadamm?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)  
UI Sounds by [Kenney](https://kenney.nl)
