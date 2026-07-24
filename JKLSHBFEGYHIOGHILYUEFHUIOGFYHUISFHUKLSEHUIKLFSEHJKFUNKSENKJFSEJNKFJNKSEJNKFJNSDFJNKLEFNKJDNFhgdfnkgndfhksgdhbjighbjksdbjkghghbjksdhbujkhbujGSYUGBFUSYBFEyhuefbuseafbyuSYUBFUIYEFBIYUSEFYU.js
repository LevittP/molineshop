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
document.getElementById(
"file-list"
);

const loading =
document.getElementById(
"loading"
);

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


loading.style.display =
  "none";


/*
Check if there are no games
*/


if (
  files.length === 0
) {

  fileList.innerHTML =
    "<p>No games found.</p>";

  return;

}


/*
Create buttons
*/


files.forEach(
  file => {


    const button =
      document.createElement(
        "div"
      );


    button.className =
      "game-button";


    /*
    Display filename
    without .html
    */


    button.textContent =
      file.replace(
        /\.html$/i,
        ""
      );


    /*
    Open game
    */


    button.onclick =
      () => openGame(
        file
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
Show game
*/

gameContainer.style.display =
"block";

/*
Show loading message
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
Fetch HTML from
Internet Archive
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


/*
Get HTML code
*/


let html =
  await response.text();


/*
Set Internet Archive
as base URL
*/


const baseURL =
  ARCHIVE_DOWNLOAD_URL;


/*
Add <base> tag
if one doesn't exist
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
      <base href="${baseURL}">
    `

  );

}


/*
Create HTML Blob
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


/*
Display error
*/


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
  Hide game
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
