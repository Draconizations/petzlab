uniform float ballSize;
uniform vec2 viewportSize;
uniform float fuzzAmount;

varying vec2 centerFragcoord;
varying vec4 centerView;
varying float zCenterBall;
varying float zCenterPet;

varying vec3 vPos;
varying vec2 centerFrag;
varying float radius;

void main() {
  vPos = position;
  
  // calculate the centerpoint and radius
  // https://stackoverflow.com/a/52569671 for future reference
  vec4 centerV = modelViewMatrix * vec4(vec3(0.0), 1.0);
  vec4 edgeV = vec4(centerV.x, centerV.y + ballSize, centerV.zw);
  
  vec4 centerH = projectionMatrix * centerV;
  vec4 edgeH = projectionMatrix * centerH;
  
  // Apply perspective divide:
  // needed for the ball to change size
  // depending on how far it is from the camera
  vec3 centerPoint = centerH.xyz / centerH.w;
  centerFrag = floor(vec2(centerPoint.xy) / viewportSize) + 0.5;
  vec3 edgePoint = edgeH.xyz / edgeH.w;
  
  radius = length(edgePoint - centerPoint);
  
  // scale with fuzz
  float fuzzScale = 1.0 + fuzzAmount;

  // billboard effect
  gl_Position =  projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) + vec4(vec2(position.xy) * fuzzScale, 0.0, 0.0));
}
