export const getProfile = (token) => {
  console.log("token --- ", token);
  return fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("profile ", data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const initialiseDrive = (token) => {
  const folderName = "excalidraw";
  const mimeTypeFolder = "application/vnd.google-apps.folder";

  // Search for folders with the specified name
  return fetch(
    "https://www.googleapis.com/drive/v3/files?q=" +
      encodeURIComponent(
        `name='${folderName}' and mimeType='${mimeTypeFolder}' and trashed=false`
      ) +
      "&fields=files(id,name)",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      let files = data.files;
      if (files && files.length > 0) {
        console.log("Found folder:", files[0].id);
      } else {
        console.log("Folder not found, creating...");
        createFolder(folderName, token);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  function createFolder(name, authToken) {
    const fileMetadata = {
      name: name,
      mimeType: mimeTypeFolder,
    };

    fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileMetadata),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Created Folder Id: ", data.id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};
