
void main(){
    float d = 1.-length( .5 - gl_PointCoord.xy );
    gl_FragColor=vec4( d,0.,0.,1.);
}