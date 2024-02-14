uniform float fuzzAmount;
uniform vec2 viewportSize;
uniform float ballSize;
uniform float zAdd;
uniform vec3 zCenterPetWorld;

varying vec2 centerFragcoord;
varying vec4 centerView;
varying float zCenterBall;
varying float zCenterPet;

varying vec3 vPos;

float random(float x) {
  return fract(sin(dot(vec2(x), vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 c = centerFragcoord.xy;
  vec2 st = vPos.xy;
  
  // FUZZING
  // Find random number based on y-pixel, offset to center of ball
  float r = random(st.y - c.y);
  // Stretch random number between -1.0 and 1.0
  r = (r * 2.0) - 1.0;
  // Increase distortion by fuzz amount
  r *= fuzzAmount;
  // Offset x line by the final random amount
  st.x += r;
  
  //DRAWING
  vec2 vector_from_center = st - c;
  
  float pct = step(length(vector_from_center), (ballSize / 2.0));
  vec2 center_uv = (centerFragcoord.xy / viewportSize) - (1.0);
  
  gl_FragColor = vec4(vec3(pct * vec3(0.4118, 1.0, 0.851)), 1.0 - step(pct, 0.0));
}