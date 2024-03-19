import {
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core";
import config from "../config.json";

// positions of leftwall, rightwall, pindeck, backgroundwall, camerawall, roof respectively
const positions = [];
for (const { x, y, z } of config.wall.positions) {
  const position = new Vector3(x, y, z);
  positions.push(position);
}

//rotations of leftwall, rightwall, pindeck, backgroundwall, camerawall, roof respectively
const rotations = [];
for (const { x, y, z } of config.wall.rotations) {
  const rotation = new Vector3(x, y, z);
  rotations.push(rotation);
}

<<<<<<< HEAD
export const createEnvironment = async(scene) => {

=======
export const createEnvironment = (scene) => {
>>>>>>> 4a028ac45bb1b01e6d045ef41ebadcd7a1d6bb25
  //creation of ground
  const ground = MeshBuilder.CreateGround("ground", {
    width: config.ground.width,
    height: config.ground.height,
  });
  const groundMat = new StandardMaterial("ground-mat");
  groundMat.diffuseTexture = new Texture("Images/Neon-floor.jpg");
  ground.material = groundMat;

  //creating the left side wall of the game room
  const leftWall = new MeshBuilder.CreatePlane("plane", {
    height: config.wall.height[0],
    width: config.wall.width[0],
  });
  leftWall.position = positions[0];
  leftWall.rotation = rotations[0];
  const leftWallMat = new StandardMaterial("back-wall-material");
  leftWallMat.diffuseTexture = new Texture("Images/Neon-sidewall.jpg");
  leftWall.material = leftWallMat;

  //creating the right side wall of the game room
  const rightWall = new MeshBuilder.CreatePlane("plane", {
    height: config.wall.height[1],
    width: config.wall.width[1],
  });
  rightWall.position = positions[1];
  rightWall.rotation = rotations[1];
  const rightWallMat = new StandardMaterial("back-wall-material");
  rightWallMat.diffuseTexture = new Texture("Images/Neon-sidewall.jpg");
  rightWall.material = rightWallMat;

  //Place where the pins fall after getting hit by the bowling ball
  const pinDeck = new MeshBuilder.CreatePlane("pinDeck", {
    height: config.wall.height[2],
    width: config.wall.width[2],
  });
  pinDeck.position = positions[2];
  pinDeck.rotation = rotations[2];
  const pinDeckMat = new StandardMaterial();
  pinDeckMat.diffuseColor = Color3.Black();
  pinDeck.material = pinDeckMat;

  //Background wall where the game image is displayed
  const backgroundWall = new MeshBuilder.CreatePlane("plane", {
    height: config.wall.height[3],
    width: config.wall.width[3],
  });
  backgroundWall.position = positions[3];
  backgroundWall.rotation = rotations[3];
  const backgroundWallMat = new StandardMaterial();
  backgroundWallMat.diffuseTexture = new Texture("Images/Backwall.jpg");
  backgroundWall.material = backgroundWallMat;
  const backgroundWallAggregate = new PhysicsAggregate(
    backgroundWall,
    PhysicsShapeType.BOX,
    {
      mass: config.wall.mass,
      restitution: config.wall.restitution,
    }
  );

  //Wall behind the camera
  const cameraWall = new MeshBuilder.CreatePlane("plane", {
    height: config.wall.height[4],
    width: config.wall.width[4],
  });
  cameraWall.rotation = rotations[4];
  cameraWall.position = positions[4];
  const cameraWallMat = new StandardMaterial();
  cameraWallMat.diffuseTexture = new Texture("Images/Neon-backsidewall.jpg");
  cameraWall.material = cameraWallMat;

  //adding a roof
  const roof = MeshBuilder.CreatePlane("roof", {
    width: config.wall.width[5],
    height: config.wall.height[5],
  });
  const roofMat = new StandardMaterial("roof-mat");
  roofMat.diffuseTexture = new Texture("Images/Neon-floor.jpg");
  roof.material = roofMat;
  roof.rotation = rotations[5];
  roof.position = positions[5];

<<<<<<< HEAD
  //Adding invisible planes at the sides of bowling lane to prevent pins from leaving the lane.
  const laneProtector1 = new BABYLON.MeshBuilder.CreatePlane("laneProtector", {
    height: 50,
    width: 300
  });
  laneProtector1.position.x = -15;
  laneProtector1.position.y = 25;
  laneProtector1.rotation.y = -Math.PI / 2;
  laneProtector1.isVisible = false;

  const laneProtector1Agg = new BABYLON.PhysicsAggregate(
    laneProtector1,
    BABYLON.PhysicsShapeType.BOX,
    {
      mass: 0,
      restitution: 0.25,
    }
  );


  const laneProtector2
   = new BABYLON.MeshBuilder.CreatePlane("laneProtector", {
    height: 50,
    width: 300
  });
  laneProtector2.position.x = 15;
  laneProtector2.position.y = 25;
  laneProtector2.rotation.y = Math.PI / 2;
  laneProtector2.isVisible = false;

  const laneProtector2Agg = new BABYLON.PhysicsAggregate(
    laneProtector2,
    BABYLON.PhysicsShapeType.BOX,
    {
      mass: 0,
      restitution: 0.25,
    }
  );
  const xrhelper = await scene.createDefaultXRExperienceAsync({ floorMeshes: [ground] });
  console.log(xrhelper);
=======
  //var xr = scene.createDefaultXRExperienceAsync({ floorMeshes: [ground] });
>>>>>>> 4a028ac45bb1b01e6d045ef41ebadcd7a1d6bb25
};
