const ARCHIVE_DOWNLOAD_URL =
"https://archive.org/download/ugsfiles/";

const ARCHIVE_METADATA_URL =
"https://archive.org/metadata/ugsfiles?format=json";

let currentGameURL = null;

# /*

# LOAD ALL GAMES

*/

async function loadGames() {

const fileList =
document.getElementById(
"file-list"
);

const loading =
document.getElementById(
"loading"
);

try {

```
console.log(
  "Loading Internet Archive files..."
);


const response =
  await fetch(
    ARCHIVE_METADATA_URL
  );


if (!response.ok) {

  throw new Error(
    "Internet Archive returned HTTP " +
    response.status
  );

}


const data =
  await response.json();


if (
  !data.files
) {

  throw new Error(
    "No files found."
  );

}


/*
Get all HTML files
*/


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


console.log(
  "Found games:",
  files.length
);


loading.style.display =
  "none";


/*
No games
*/


if (
  files.length === 0
) {

  fileList.innerHTML =

    "<p>No HTML games found.</p>";

  return;

}


/*
Create game buttons
*/


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


    button.addEventListener(

      "click",

      () =>
        openGame(
          file
        )

    );


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
  "Game loading error:",
  error
);


loading.innerHTML = `

  <p>
    Could not load games.
  </p>

  <p style="
    color: #999;
    font-size: 14px;
  ">

    ${error.message}

  </p>

`;
```

}

}

# /*

# OPEN GAME

*/

async function openGame(
file
) {

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

/*
Hide game list
*/

gameList.style.display =
"none";

/*
Show game player
*/

gameContainer.style.display =
"block";

/*
Show loading screen
*/

gameFrame.srcdoc = `

```
<!DOCTYPE html>

<html>

<body style="
  margin: 0;
  background: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial;
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
Get game HTML
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
    "Could not fetch game. HTTP " +
    response.status
  );

}


/*
Read HTML
*/


let html =

  await response.text();


/*
Add base URL
*/


if (

  !html
    .toLowerCase()
    .includes(
      "<base"
    )

) {


  html = html.replace(

    /<head([^>]*)>/i,

    `<head$1>

      <base href="${ARCHIVE_DOWNLOAD_URL}">

    `

  );

}


/*
Create Blob
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
  "Game error:",
  error
);


gameFrame.srcdoc = `

  <!DOCTYPE html>

  <html>

  <body style="
    margin: 0;
    background: black;
    color: white;
    text-align: center;
    font-family: Arial;
    padding-top: 100px;
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

if (
backButton
) {

backButton.onclick =

```
function() {


  const gameFrame =

    document.getElementById(
      "game-frame"
    );


  /*
  Stop game
  */


  gameFrame.src =
    "about:blank";


  /*
  Delete Blob URL
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
  Hide player
  */


  document
    .getElementById(
      "game-container"
    )
    .style.display =
    "none";


  /*
  Show games
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

# START

*/

loadGames();
