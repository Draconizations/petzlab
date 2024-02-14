uniform float ballSize;
uniform vec2 viewportSize;
uniform float fuzzAmount;
uniform float zAdd;

varying vec2 centerFragcoord;
varying vec4 centerView;
varying float zCenterBall;
varying float zCenterPet;

varying vec3 vPos;

void main() {
  // billboard effect
  gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) + vec4(position.x, position.y, 0.0, 0.0));
  
  vPos = position.xyz;
}
