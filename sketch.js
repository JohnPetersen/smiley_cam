
let video;
let poseNet;
let foundPoses = [];
let skeleton;
let face;

function preload() {
  face = loadImage('smile.png');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  imageMode(CENTER);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    foundPoses = poses;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, width / 2, height / 2);
  for (let i = 0; i < foundPoses.length; i++) {
    drawPose(foundPoses[i]);
  }
}

function drawPose(data) {
  let pose = data.pose;
  let skeleton = data.skeleton;

  if (pose && pose.score > 0.30) {
    
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let earL = pose.leftEar;
    let earR = pose.rightEar;
    let headWidth = dist(earL.x, earL.y, earR.x, earR.y);
    let headHeight = 2 * headWidth;

    strokeWeight(4);
    stroke(255);
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }

    noStroke();
    fill(0, 255, 0);
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      ellipse(x, y, 16, 16);
    }

    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    image(face, pose.nose.x, pose.nose.y, headHeight, headHeight);
  }
}