import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { startMenuGUI } from "../Game_GUI/startMenuGUI";
import {
  overallScoreBoardDisplay,
  currentRollScoreBoardDisplay,
} from "../Game_GUI/renderScoreBoard";
import { updateGameScores } from "../Game_GUI/scoreBoard";
 
export const pointerDown2 = (xr) => {
  if(xr.teleportation.attached){
    xr.teleportation.detach();
    xr.pointerSelection.detach();
  }
  else {
    xr.teleportation.attach();
    xr.pointerSelection.attach();
  }
 
};
 
export const pointerUp2 = (
  aim,
  game,
  ballMovementObjects,
  bowlingPinResult,
  createBowlingPins,
  scene,
  triggerComponent,
  mapValue
) => {
  const bowlingBallPosition = ballMovementObjects.bowling_ball.absolutePosition;
    game.ballIsRolled = true;
     const speed = mapValue(triggerComponent.value, 0, 1, 50, 200);
     console.log(triggerComponent.value, speed)
    //Applying impulse to the ball
    ballMovementObjects.bowlingAggregate.body.applyImpulse(
      new BABYLON.Vector3(-aim.rotation.y * 120, 0, speed),
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
        new BABYLON.Vector3(0, 0, 0)
      );
      ballMovementObjects.bowlingAggregate.body.setAngularVelocity(
        new BABYLON.Vector3(0, 0, 0)
      );
      ballMovementObjects.bowling_ball.rotation = new BABYLON.Vector3(0, 0, 0);
      ballMovementObjects.bowling_ball.position = new BABYLON.Vector3(
        0,
        4,
        -62
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
        }, 1500);
      }
      //switch to the next player -- marks the end of the roll
      game.switchPlayer();
      game.ballIsRolled = false;
      game.initializePins();
    }, 5000);
  }
}
 
export const pointerMove2 = (value, ballMovementObjects, aim, mapValue) => {
  const newX = mapValue(value.x, -1, 1, 12, -12);
  ballMovementObjects.bowling_ball.position.x = newX;
  const aimAngle = mapValue(value.x, -1, 1, -0.15, 0.15)
  aim.rotation.y = aimAngle;
};