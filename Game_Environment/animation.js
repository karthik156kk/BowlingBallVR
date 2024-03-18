import * as BABYLON from "@babylonjs/core";
import { startMenuGUI } from "../Game_GUI/startMenuGUI";
import config from "../config.json" assert {type: "json"};

//creating a camera animation with the data from config 
export const createAnimations = (camera, scene, game) => {

  const movement = new BABYLON.Animation(
    "movement",
    "position",
    config.animation.frameRate,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    true
  );
  const movement_keys = [];

  for (const {frame, x, y, z} of config.animation.movementAnimationValues){
    const position = new BABYLON.Vector3(x, y, z);
    movement_keys.push({
      frame: frame * config.animation.frameRate, // Multiply frame by frameRate
      value: position
    });
  }
  movement.setKeys(movement_keys);

  const rotation = new BABYLON.Animation(
    "rotate",
    "rotation.y",
    config.animation.frameRate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    true
  );
  const rotate_keys = [];

  for (const {frame, yRotation} of config.animation.rotationAnimationValues){
    rotate_keys.push({
      frame: frame * config.animation.frameRate, // Multiply frame by frameRate
      value: yRotation
    });
  }

  rotation.setKeys(rotate_keys);


  //Starting the animation on the scene
  scene.beginDirectAnimation(
    camera,
    [movement, rotation],
    config.animation.startFrame,
    config.animation.endFrame * config.animation.frameRate,
    false,
    1,
    () => {
      startMenuGUI(scene, game);
    }
  );
};
