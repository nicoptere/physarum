uniform sampler2D agents;
void main(){
    vec2 uv = texture2D(agents,uv).xy;
    gl_Position=vec4(uv*2.0-1.,0.,1.);
    gl_PointSize = 1.;
}