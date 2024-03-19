import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

import { rollCollisionHandler } from "./Game_Logic/gameCollisionHandler";
import {
  pointerDown,
  pointerUp,
  pointerMove,
  ballMovement,
} from "./Game_Logic/ballMovementHandler";
import { pointerDown2, pointerUp2, pointerMove2 } from "./Game_Logic/motionControllerBallMovement";
import { createEnvironment } from "./Game_Environment/environment";
import {
  createLights,
  createGameMusic,
  createRollSound,
} from "./Game_Environment/lightsAndMusic";
import { createAnimations } from "./Game_Environment/animation";
import { createBowlingLane } from "./Game_Environment/bowlingLane";
import { createAim } from "./Game_Logic/aim";
import {
  createBowlingBall,
  createBowlingPins,
} from "./Game_Environment/bowlingBallAndPins";
import { renderScoreBoard } from "./Game_GUI/renderScoreBoard";
import { StartNewGame } from "./Game_Logic/newGameDataStructure";
import { startMenuGUI } from "./Game_GUI/startMenuGUI";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas);

async function createScene() {
  const scene = new BABYLON.Scene(engine);

  const havokInstance = await HavokPhysics();
  const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);
  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), havokPlugin);

  const camera = new BABYLON.UniversalCamera(
    "camera",
    new BABYLON.Vector3(0, 25, -100)
  );
  camera.setTarget(new BABYLON.Vector3(0, 0, 0));
  camera.inputs.clear();
  camera.attachControl();

  const bowlingPinResult = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "Models/",
    "bowling_pin.glb"
  );

  const bowlingBallResult = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "Models/",
    "bowling_ball.glb"
  );

  const aim = createAim();
  aim.isVisible = false;
  let [bowling_ball, bowlingAggregate] = createBowlingBall(bowlingBallResult);
  aim.parent = bowling_ball;
  createEnvironment(scene);
  createLights();
  createGameMusic(scene);
  const lane = createBowlingLane();

  let setPins = createBowlingPins(bowlingPinResult);

  let ballMovementObjects = { bowling_ball, bowlingAggregate, setPins };
  let startingPoint;
  let currentMesh;

  const getPointerPosition = () => {
    const pickinfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
      return mesh == lane;
    });
    if (pickinfo.hit) {
      return pickinfo.pickedPoint;
    }
    return null;
  };

  scene.onPointerObservable.add((pointerInfo) => {
    if (game.isGameStarted === true) {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if (
            pointerInfo.pickInfo.hit &&
            pointerInfo.pickInfo.pickedMesh == bowling_ball
          ) {
            aim.isVisible = true;
            [currentMesh, startingPoint] = pointerDown(
              pointerInfo.pickInfo.pickedMesh,
              getPointerPosition
            );
          }
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          aim.isVisible = false;
          [startingPoint, currentMesh] = pointerUp(
            startingPoint,
            aim,
            game,
            ballMovementObjects,
            bowlingPinResult,
            createBowlingPins,
            scene
          );
          break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
          startingPoint = pointerMove(
            startingPoint,
            getPointerPosition,
            ballMovementObjects,
            aim,
            currentMesh
          );
          break;
      }
    }
  });

  // Create a new instance of StartGame with generalPins
  let game = new StartNewGame(setPins, ["Player 1"]);
  createAnimations(camera, scene, game);
  createRollSound();
  renderScoreBoard(scene);

  havokPlugin.onCollisionEndedObservable.add((ev) =>
    rollCollisionHandler(ev, scene, window, game)
  );

  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        ballMovement(bowling_ball, kbInfo.event.key);
    }
  });

  const xr = await scene.createDefaultXRExperienceAsync({
 
    floorMeshes: [scene.ground]
  });
  xr.teleportation.addFloorMesh(scene.ground);

  function mapValue(value, fromMin, fromMax, toMin, toMax) {
    var normalizedValue = (value - fromMin) / (fromMax - fromMin);
    var mappedValue = normalizedValue * (toMax - toMin) + toMin;
    return mappedValue;
}

xr.input.onControllerAddedObservable.add((controller) => {
  controller.onMotionControllerInitObservable.add((motionController) => {
      if (motionController.handness === 'right') {
           let triggerComponent = motionController.getComponent("xr-standard-trigger");//xr-standard-trigger
           let buttonComponent = motionController.getComponent("b-button");//y-button
           let thumbStickComponent = motionController.getComponent("xr-standard-thumbstick");//xr-standard-thumbstick
           let shootButtonComponent = motionController.getComponent("xr-standard-squeeze");//y-button
           if(/* game.isGameStarted */ true){
            buttonComponent.onButtonStateChangedObservable.add(()=>{
                if(buttonComponent.pressed){
                  aim.isVisible = true;
                  pointerDown2(xr);
                  // console.log('hi')
                }
            });
            thumbStickComponent.onAxisValueChangedObservable.add((value)=>{
              if(!game.ballIsRolled) pointerMove2(value, ballMovementObjects, aim, mapValue)
            })
            shootButtonComponent.onButtonStateChangedObservable.add(() => {
              if(shootButtonComponent.pressed){
                if(!game.ballIsRolled){
                    aim.isVisible = false;
                    pointerUp2(aim, game, ballMovementObjects, bowlingPinResult, createBowlingPins, scene,triggerComponent,mapValue);
                }
              }
            });
          }
      };
  });
});

// startMenuGUI(scene, game);

  return scene;
}

createScene().then((scene) => {
  engine.runRenderLoop(function () {
    if (scene) {
      scene.render();
    }
  });
});
window.addEventListener("resize", function () {
  engine.resize();
});
