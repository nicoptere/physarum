uniform sampler2D agents;
uniform float pointSize;
varying vec2 vUv;
void main(){
    vUv = uv;
    vec2 val = texture2D(agents,uv).xy;
    gl_Position=vec4(val*2.0-1.,0.,1.);
    gl_PointSize = pointSize;
}