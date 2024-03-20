import "@babylonjs/loaders";
import * as BABYLON from "@babylonjs/core"
import { updateGameScores } from "../Game_GUI/scoreBoard";
import config from "../config.json"
import { Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";
import { startMenuGUI } from "../Game_GUI/startMenuGUI";
import {
  overallScoreBoardDisplay,
  currentRollScoreBoardDisplay,
} from "../Game_GUI/renderScoreBoard";


/* 

import { Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";
import { startMenuGUI } from "../Game_GUI/startMenuGUI";
import {
  overallScoreBoardDisplay,
  currentRollScoreBoardDisplay,
} from "../Game_GUI/renderScoreBoard";
import { updateGameScores } from "../Game_GUI/scoreBoard";
import config from "../config.json"

export const pointerDown = (mesh, getPointerPosition) => {
  const startingPoint = getPointerPosition();
  return [mesh, startingPoint];
};



export const pointerUp = (
  startingPoint,
  aim,
  game,
  ballMovementObjects,
  bowlingPinResult,
  createBowlingPins,
  scene
) => {
  const bowlingBallPosition = ballMovementObjects.bowling_ball.absolutePosition;

  //Mapping ball Speed with respect to the dragiing of the ball
  const ballSpeed = (config.ballcontrol.initialPosition - bowlingBallPosition.z) * config.ballcontrol.speedConstant;
  console.log(config.ballcontrol.initialPosition, bowlingBallPosition.z, ballSpeed)
  if (bowlingBallPosition.z < config.ballcontrol.threshold) {
    //Applying impulse to the ball
    ballMovementObjects.bowlingAggregate.body.applyImpulse(
      new Vector3(-aim.rotation.y * config.ballcontrol.dirConstant, 0, ballSpeed),
      ballMovementObjects.bowling_ball.getAbsolutePosition()
    );
    window.globalShootmusic.play();
    setTimeout(function () {
      window.globalShootmusic.stop();
    }, config.time.ballRollSoundTime);
    game.ballIsRolled = true;
  }

  if (game.ballIsRolled === true) {
    setTimeout(() => {
      //Getting back the pin to it's original position
      ballMovementObjects.setPins.forEach((pin) => {
        pin.dispose();
      });
      ballMovementObjects.setPins = createBowlingPins(bowlingPinResult);

      //Getting back the ball to it's initial position
      ballMovementObjects.bowlingAggregate.body.setLinearVelocity(
        Vector3.Zero()
      );
      ballMovementObjects.bowlingAggregate.body.setAngularVelocity(
        Vector3.Zero()
      );
      ballMovementObjects.bowling_ball.rotation = Vector3.Zero()
      ballMovementObjects.bowling_ball.position = new Vector3(
        config.ball.position[0],
        config.ball.position[1],
        config.ball.position[2]
      );
      //update the score board GUI -- current and overall scores
      updateGameScores(game);
      //if every player has rolled (5) all attempts, 
      //stop the game -- controls, GUI and then reset the game
      if (
        game.currentFrameIndex === game.totalAttempts - 1 &&
        game.currentPlayerIndex === game.players.length - 1
      ) {
        game.isGameStarted = false;
        setTimeout(() => {
          overallScoreBoardDisplay.isVisible = false;
          currentRollScoreBoardDisplay.isVisible = false;
          startMenuGUI(scene, game);
        }, config.time.endGameTimeAfterLastThrow);
      }
      //switch to the next player -- marks the end of the roll
      game.switchPlayer();
      game.ballIsRolled = false;
      game.initializePins();
    }, config.time.timeToNextThrow);
  }
  return [startingPoint, null];
};

export const pointerMove = (
  startingPoint,
  getPointerPosition,
  ballMovementObjects,
  aim,
  currentMesh
) => {
  const currentPosition = getPointerPosition();

  if (currentMesh != ballMovementObjects.bowling_ball) return;

  let aimAngle =
    (ballMovementObjects.bowling_ball.position.x + currentPosition.x) * config.ballcontrol.aimConstant;

  if (aimAngle > config.ballcontrol.aimLimit) aimAngle = config.ballcontrol.aimLimit;
  else if (aimAngle < -config.ballcontrol.aimLimit) aimAngle = -config.ballcontrol.aimLimit;

  aim.rotation.y = aimAngle;

  const differenceFromCurrentPoint = currentPosition.subtract(startingPoint);
  differenceFromCurrentPoint.x = 0;

  // Define the limits for z movement
  const minZ = config.ballcontrol.minZ; // Minimum z value
  const maxZ = config.ballcontrol.maxZ; // Maximum z value

  const newZ = ballMovementObjects.bowling_ball.position.z + differenceFromCurrentPoint.z;

  // Check if the new position exceeds the limits
  if (newZ < minZ) {
    differenceFromCurrentPoint.z = minZ - ballMovementObjects.bowling_ball.position.z;
  } else if (newZ > maxZ) {
    differenceFromCurrentPoint.z = maxZ - ballMovementObjects.bowling_ball.position.z;
  }

  ballMovementObjects.bowling_ball.position.addInPlace(differenceFromCurrentPoint);

  startingPoint = currentPosition;
  return startingPoint;
};

export const ballMovement = (bowling_ball, pressedArrow) => {
  if (bowling_ball.position.x <= config.ballcontrol.maxX && bowling_ball.position.x >= config.ballcontrol.minX) {
    if (pressedArrow == "ArrowLeft" && bowling_ball.position.x != config.ballcontrol.maxX)
      bowling_ball.position.x += config.ballcontrol.inc;
    if (pressedArrow == "ArrowRight" && bowling_ball.position.x != config.ballcontrol.minX)
      bowling_ball.position.x -= config.ballcontrol.inc;
  }
};


*/


export const toggleTeleportation = (xr) => {
  if(xr.teleportation.attached){
    xr.teleportation.detach();
    xr.pointerSelection.detach();
  }
  else {
    xr.teleportation.attach();
    xr.pointerSelection.attach();
  }
};
 
export const ballShoot = (
  aim,
  game,
  ballMovementObjects,
  bowlingPinResult,
  createBowlingPins,
  scene,
  thumbStickComponent,
  mapValue
) => {
  const bowlingBallPosition = ballMovementObjects.bowling_ball.absolutePosition;
    game.ballIsRolled = true;
     const speed = mapValue(thumbStickComponent.axes.y, -1, 1, 5, 20);
     console.log(thumbStickComponent.value);
    //Applying impulse to the ball
    ballMovementObjects.bowlingAggregate.body.applyImpulse(
      new BABYLON.Vector3(-aim.rotation.y * config.ballcontrol.dirConstant, 0, speed),
      ballMovementObjects.bowling_ball.getAbsolutePosition()
    );
    window.globalShootmusic.play();
    setTimeout(function () {
      window.globalShootmusic.stop();
    }, 1500);
 
  if (game.ballIsRolled === true) {
    setTimeout(() => {
      //Getting back the pin to it's original position
      ballMovementObjects.setPins.forEach((pin) => {
        pin.dispose();
      });
      ballMovementObjects.setPins = createBowlingPins(bowlingPinResult);

      //Getting back the ball to it's initial position
      ballMovementObjects.bowlingAggregate.body.setLinearVelocity(
        Vector3.Zero()
      );
      ballMovementObjects.bowlingAggregate.body.setAngularVelocity(
        Vector3.Zero()
      );
      ballMovementObjects.bowling_ball.rotation = Vector3.Zero()
      ballMovementObjects.bowling_ball.position = new Vector3(
        config.ball.position[0],
        config.ball.position[1],
        config.ball.position[2]
      );
      //update the score board GUI -- current and overall scores
      updateGameScores(game);
      //if every player has rolled (5) all attempts, 
      //stop the game -- controls, GUI and then reset the game
      if (
        game.currentFrameIndex === game.totalAttempts - 1 &&
        game.currentPlayerIndex === game.players.length - 1
      ) {
        game.isGameStarted = false;
        setTimeout(() => {
          overallScoreBoardDisplay.isVisible = false;
          currentRollScoreBoardDisplay.isVisible = false;
          startMenuGUI(scene, game);
        }, config.time.endGameTimeAfterLastThrow);
      }
      aim.rotation.y = 0;
      //switch to the next player -- marks the end of the roll
      game.switchPlayer();
      game.ballIsRolled = false;
      game.initializePins();
    }, config.time.timeToNextThrow);
  }
}

export const angleToAim = (aimToBallControlling, value, ballMovementObjects, aim, mapValue) => {
  const newZ = mapValue(value.y , 0, 1, -6.2, -6.7);
  ballMovementObjects.bowling_ball.position.z = newZ;

  if(aimToBallControlling) {
    const newX = mapValue(value.x, -1, 1, 1.2, -1.2);
    ballMovementObjects.bowling_ball.position.x = newX;
  }
  else {
    const aimAngle = mapValue(value.x, -1, 1, config.ballcontrol.aimLimit, -config.ballcontrol.aimLimit)
    aim.rotation.y = aimAngle;
  }
}