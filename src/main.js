import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";
import { Renderer, GlassesTransformDict, RenderOptions } from "./Renderer.js";

window.addEventListener("load", main);

function main() {
  const videoElement = document.getElementById("input_video");
  const outputCanvas = document.getElementById("output_canvas");
  const renderer = new Renderer(outputCanvas, "./glasses1.gltf");
  renderer.setGlassesModel("./glasses1.gltf");
  const image1 = document.getElementById("image1");
  const image2 = document.getElementById("image2");

  image1.addEventListener("click", function () {
    image1.classList.add("selected");
    image2.classList.remove("selected");
    renderer.setGlassesModel("./glasses1.gltf");
  });

  image2.addEventListener("click", function () {
    image2.classList.add("selected");
    image1.classList.remove("selected");
    renderer.setGlassesModel("./glasses2.gltf");
  });

  videoElement.style.display = "none";

  const stats = Stats();
  document.body.appendChild(stats.dom);

  const faceMesh = new FaceMesh({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
  });
  faceMesh.setOptions({
    cameraNear: 1,
    cameraFar: 2000,
    cameraVerticalFovDegrees: 66,
    enableFaceGeometry: true,
    selfieMode: true,
    maxNumFaces: 1,
    refineLandmarks: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults((faceMeshResults) => {
    renderer.render(faceMeshResults);

    stats.update();
  });

  // 	Construct camera input
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({ image: videoElement });
    },
    width: outputCanvas.width,
    height: outputCanvas.height,
  });
  camera.start();

  // 	debugger
  const gui = new GUI();
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(renderer.camera, "fov", 10, 100).onChange(() => {
    renderer.camera.updateProjectionMatrix();
  });

  // 	offset
  const glassesTransformDict = GlassesTransformDict;
  const glassesFolder = gui.addFolder("Glasses");
  glassesFolder
    .add(glassesTransformDict.position, "x", -5, 5, 0.001)
    .onChange(() => renderer.updateGlassesOffsetPosition(glassesTransformDict));
  glassesFolder
    .add(glassesTransformDict.position, "y", -5, 5, 0.001)
    .onChange(() => renderer.updateGlassesOffsetPosition(glassesTransformDict));
  glassesFolder
    .add(glassesTransformDict.position, "z", -5, 5, 0.001)
    .onChange(() => renderer.updateGlassesOffsetPosition(glassesTransformDict));
  glassesFolder
    .add(glassesTransformDict, "scale", 1, 2, 0.001)
    .onChange(() => renderer.updateGlassesOffsetScale(glassesTransformDict));

  const renderOptionFolder = gui.addFolder("RenderOptions");
  renderOptionFolder
    .add(renderer, "isOrbitalView")
    .onChange((isOrbitalView) => {
      if (isOrbitalView) {
        renderer.orbitControls.enabled = true;
        renderer.camera.position.set(5, 5, 5);
        renderer.camera.lookAt(0, 0, 0);
      }
      else {
        renderer.orbitControls.enabled = false;
        renderer.camera.position.set(0, 0, 0);
        renderer.camera.lookAt(0, 0, -1);
      }
    });
  renderOptionFolder.add(renderer.renderOptions, "isGlasses");
  renderOptionFolder.add(renderer.renderOptions, "isFaceTexture");
  renderOptionFolder.open();
}
