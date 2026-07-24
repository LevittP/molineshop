const ARCHIVE_DOWNLOAD_URL =
"https://archive.org/download/ugsfiles/";

const ARCHIVE_METADATA_URL =
"https://archive.org/metadata/ugsfiles";

let currentGameURL = null;

# /*

# LOAD ALL GAMES

*/

async function loadGames() {

const fileList =
document.getElementById("file-list");

const loading =
document.getElementById("loading");

try {

```
const response =
  await fetch(
    ARCHIVE_METADATA_URL
  );


if (!response.ok) {

  throw new Error(
    "Internet Archive connection failed."
  );

}


const data =
  await response.json();


const files =

  data.files

    .map(
      file =>
        file.name
    )

    .filter(

      name =>

        name &&

        name
          .toLowerCase()
          .endsWith(".html")

    )

    .sort();


loading.style.display =
  "none";


if (
  files.length === 0
) {

  fileList.innerHTML =
    "<p>No games found.</p>";

  return;

}


files.forEach(
  file => {

    const button =
      document.createElement(
        "div"
      );


    button.className =
      "game-button";


    button.textContent =
      file.replace(
        /\.html$/i,
        ""
      );


    button.onclick =
      () => openGame(file);


    fileList.appendChild(
      button
    );

  }
);
```

}

catch (error) {

```
console.error(
  error
);


loading.textContent =
  "Could not load games.";
```

}

}

# /*

# OPEN GAME

*/

async function openGame(file) {

const gameList =
document.getElementById(
"game-list"
);

const gameContainer =
document.getElementById(
"game-container"
);

const gameFrame =
document.getElementById(
"game-frame"
);

gameList.style.display =
"none";

gameContainer.style.display =
"block";

gameFrame.srcdoc = `

```
<!DOCTYPE html>

<html>

<body style="
  margin:0;
  background:black;
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  height:100vh;
  font-family:Arial;
">

  <h2>
    Loading game...
  </h2>

</body>

</html>
```

`;

try {

```
/*
Fetch the HTML game launcher
*/

const response =

  await fetch(

    ARCHIVE_DOWNLOAD_URL +

    encodeURIComponent(
      file
    )

  );


if (!response.ok) {

  throw new Error(
    "Could not fetch game."
  );

}


let html =
  await response.text();


/*
Add Internet Archive as
the base URL for resources
*/

const baseURL =
  ARCHIVE_DOWNLOAD_URL;


if (

  !html
    .toLowerCase()
    .includes("<base")

) {

  html = html.replace(

    /<head([^>]*)>/i,

    `<head$1>
      <base href="${baseURL}">
    `

  );

}


/*
Create a temporary HTML file
*/

const blob =
  new Blob(

    [html],

    {
      type:
        "text/html"
    }

  );


/*
Create temporary URL
*/

currentGameURL =
  URL.createObjectURL(
    blob
  );


/*
Load game
*/

gameFrame.src =
  currentGameURL;
```

}

catch (error) {

```
console.error(
  error
);


gameFrame.srcdoc = `

  <!DOCTYPE html>

  <html>

  <body style="
    background:black;
    color:white;
    text-align:center;
    font-family:Arial;
    padding-top:100px;
  ">

    <h1>
      Game Failed to Load
    </h1>

    <p>
      ${error.message}
    </p>

  </body>

  </html>

`;
```

}

}

# /*

# BACK BUTTON

*/

const backButton =
document.getElementById(
"back-button"
);

if (backButton) {

backButton.onclick =
function() {

```
  const gameFrame =
    document.getElementById(
      "game-frame"
    );


  /*
  Stop the game
  */

  gameFrame.src =
    "about:blank";


  /*
  Delete temporary Blob URL
  */

  if (
    currentGameURL
  ) {

    URL.revokeObjectURL(
      currentGameURL
    );

    currentGameURL =
      null;

  }


  /*
  Hide game player
  */

  document
    .getElementById(
      "game-container"
    )
    .style.display =
    "none";


  /*
  Show game list
  */

  document
    .getElementById(
      "game-list"
    )
    .style.display =
    "block";

};
```

}

# /*

# START WEBSITE

*/

loadGames();
