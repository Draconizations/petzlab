uniform float fuzzAmount;
uniform vec2 viewportSize;
uniform float ballSize;
uniform float zAdd;
uniform vec3 zCenterPetWorld;

varying vec3 vPos;
varying vec2 centerFrag;
varying float radius;

float random(float x) {
  return fract(sin(dot(vec2(x), vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 center = centerFrag.xy;
  vec2 stretch = vPos.xy;
  
  float r = random(gl_FragCoord.y - center.y);
  // Stretch random number between -1.0 and 1.0
  r = (r * 2.0) - 1.0;
  // Increase distortion by fuzz amount
  r *= fuzzAmount;
  // Offset x line by the final random amount
  stretch.x += r;
  
  vec2 centerP = (center * 0.5 + 0.5);

  float pct = step(length(stretch - center / viewportSize), (ballSize * 0.5));
  
  gl_FragColor = vec4(vec3(pct * vec3(0.4118, 1.0, 0.851)), 1.0 - step(pct, 0.0));
}