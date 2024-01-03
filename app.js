const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname + "/src"));

app.use("/three/", express.static(path.join(__dirname, "node_modules/three")));
app.use(
  "/jsm/",
  express.static(path.join(__dirname, "node_modules/three/examples/jsm/"))
);

app.use(
  "/dat.gui/",
  express.static(path.join(__dirname, "node_modules/dat.gui"))
);

app.use(
  "/three-wtm/",
  express.static(path.join(__dirname, "node_modules/three-wtm/"))
);
app.use(
  "/wwobjloader2/",
  express.static(path.join(__dirname, "node_modules/wwobjloader2/"))
);

app.use(
  "/mediapipe/",
  express.static(path.join(__dirname, "node_modules/@mediapipe"))
);

app.use(
  "/file-saver/",
  express.static(path.join(__dirname, "node_modules/file-saver"))
);

app.listen(3000, () => console.log("Visit http://localhost:3000"));
