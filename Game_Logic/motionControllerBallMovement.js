import "@babylonjs/loaders";
import { updateGameScores } from "../Game_GUI/scoreBoard";
import config from "../config.json"
import { Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";
import { startMenuGUI } from "../Game_GUI/startMenuGUI";
import {
  overallScoreBoardDisplay,
  currentRollScoreBoardDisplay,
} from "../Game_GUI/renderScoreBoard";
import { createBowlingPins } from "../Game_Environment/bowlingBallAndPins";
import { circleOfConfusionPixelShader } from "@babylonjs/core/Shaders/circleOfConfusion.fragment";

function mapValue(value, fromMin, fromMax, toMin, toMax) {
  var normalizedValue = (value - fromMin) / (fromMax - fromMin);
  var mappedValue = normalizedValue * (toMax - toMin) + toMin;
  return mappedValue;
}

export const toggleTeleportation = (xr, xrTeleportation) => {
  if(xrTeleportation.attached){
    xrTeleportation.detach();
    xr.pointerSelection.detach();
  }
  else {
    xrTeleportation.attach();
    xr.pointerSelection.attach();
  }
  console.log(xrTeleportation.attached)
};
 
export const ballShoot = (
  aim,
  game,
  ballMovementObjects,
  bowlingPinResult,
  scene,
  thumbStickComponent,
  xr
) => {
    game.ballIsRolled = true;
     const speed = mapValue(thumbStickComponent.axes.y, config.motionController.minJoystickAxisY, 
      config.motionController.maxJoystickAxisY, config.ballcontrol.vrMinSpeed, config.ballcontrol.vrMaxSpeed);
    ballMovementObjects.bowlingAggregate.body.applyImpulse(
      new Vector3(-aim.rotation.y * config.ballcontrol.dirConstant, 0, speed),
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
          startMenuGUI(scene, game, xr);
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

export const angleToAim = (aimToBallControl, value, ballMovementObjects, aim) => {
  const newZ = mapValue(value.y , config.motionController.minJoystickAxisY, 
      config.motionController.maxJoystickAxisY, config.ballcontrol.maxZ, config.ballcontrol.minZ);
  ballMovementObjects.bowling_ball.position.z = newZ;
  if(aimToBallControl) {
    const newX = mapValue(value.x, config.motionController.minJoystickAxisX, 
      config.motionController.maxJoystickAxisX, config.ballcontrol.maxX, config.ballcontrol.minX);
    ballMovementObjects.bowling_ball.position.x = newX;
  }
  else {
    const aimAngle = mapValue(value.x, config.motionController.minJoystickAxisX, 
      config.motionController.maxJoystickAxisX, config.ballcontrol.aimLimit, -config.ballcontrol.aimLimit)
    aim.rotation.y = aimAngle;
  }
}