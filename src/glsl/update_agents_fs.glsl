
uniform sampler2D input_texture;
uniform sampler2D data;

uniform vec2 resolution;
uniform float time;
uniform float sa;
uniform float ra;
uniform float so;
uniform float ss;


const float PI  = 3.14159265358979323846264;// PI
const float PI2 = PI * 2.;
const float RAD = 1./PI;
const float PHI = 1.61803398874989484820459 * .1;// Golden Ratio   
const float SQ2 = 1.41421356237309504880169 * 1000.;// Square Root of Two
float rand(in vec2 coordinate){
    return fract(tan(distance(coordinate*(time+PHI),vec2(PHI,PI*.1)))*SQ2);
}

float getDataValue(vec2 uv){
    return texture2D(data,fract( uv ) ).r;
}

float getTrailValue(vec2 uv){
    return texture2D(data,fract(uv)).g;
}

varying vec2 vUv;
void main(){
    
    //converts degree to radians (should be done on the CPU)
    float SA = sa * RAD;
    float RA = ra * RAD;

    //downscales the parameters (should be done on the CPU)
    vec2 res = 1. / resolution;//data trail scale
    vec2 SO = so * res;
    vec2 SS = ss * res;

    //uv = input_texture.xy
    //where to sample in the data trail texture to get the agent's world position
    vec4 src = texture2D(input_texture,vUv);
    vec4 val = src;
    
    //agent's heading 
    float angle = val.z * PI2;

    // compute the sensors positions 
    vec2 uvFL=val.xy+vec2(cos(angle-SA),sin(angle-SA)) * SO;
    vec2 uvF =val.xy+vec2(cos(angle),sin(angle)) * SO;
    vec2 uvFR=val.xy+vec2(cos(angle+SA),sin(angle+SA))*SO;

    //get the values unders the sensors 
    float FL = getTrailValue(uvFL);
    float F  = getTrailValue(uvF);
    float FR = getTrailValue(uvFR);

    // original implement not very parallel friendly
    // TODO remove the conditions
    if( F > FL && F > FR ){
    }else if( F<FL && F<FR ){
        if( rand(val.xy) > .5 ){
            angle +=RA;
        }else{
            angle -=RA;
        }
    }else if( FL<FR){
            angle+=RA;
    }else if(FL>FR){
            angle-=RA;
    }

    vec2 offset = vec2(cos(angle),sin(angle)) * SS;
    val.xy += offset;

    //condition from the paper : move only if the destination is free
    // if( getDataValue(val.xy) == 1. ){
    //     val.xy = src.xy;
    //     angle = rand(val.xy+time) * PI2;
    // }

    //warps the coordinates so they remains in the [0-1] interval
    val.xy = fract( val.xy );

    //converts the angle back to [0-1]
    val.z = ( angle / PI2 );
    
    gl_FragColor = val;

}