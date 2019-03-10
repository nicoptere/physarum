
uniform sampler2D input_texture;
uniform sampler2D data;
uniform sampler2D info;

uniform vec2 resolution;
uniform float time;
uniform float sa;
uniform float ra;
uniform float so;
uniform float ss;


varying vec2 vUv;

const float PI  = 3.14159265358979323846264;// PI
const float PI2 = PI * 2.;
const float RAD = 1./PI;
const float PHI = 1.61803398874989484820459 * .1;// Golden Ratio   
const float SQ2 = 1.41421356237309504880169 * 1000.;// Square Root of Two

float rand(in vec2 coordinate){
    return fract(tan(distance(coordinate*(time+PHI),vec2(PHI,PI*.1)))*SQ2);
}

//forces the uvs to stay in the range ([0-1])
vec2 wrap( inout vec2 pos ){
    // pos = clamp(pos, vec2(0.), vec2(1.))
    pos.xy=fract(pos.xy);//+vec2(1.,-1.));
    return pos;
}

float getDataValue(vec2 uv){
    return texture2D(data,fract( uv ) ).r;
}

float getTrailValue(vec2 uv){
    return texture2D(data,fract(uv)).g;
}

vec4 when_eq(vec4 x,vec4 y){
    return 1.-abs(sign(x-y));
}

vec4 when_neq(vec4 x,vec4 y){
    return abs(sign(x-y));
}

vec4 when_gt(vec4 x,vec4 y){
    return max(sign(x-y),0.);
}

vec4 when_lt(vec4 x,vec4 y){
    return max(sign(y-x),0.);
}

vec4 when_ge(vec4 x,vec4 y){
    return 1.-when_lt(x,y);
}

vec4 when_le(vec4 x,vec4 y){
    return 1.-when_gt(x,y);
}

void main(){
    
    float SA = sa * RAD;
    float RA = ra * RAD;

    //downscales the parameters 
    vec2 res = 1. / resolution;//data trail scale
    vec2 SO = so * res;
    vec2 SS = ss * res;

    //data uv=val.xy = where to sample in the data trail texture (position in the world)
    vec4 src = texture2D(input_texture,vUv);
    vec4 val = src;

    //extra params passed through the "info" texture    
    vec4 inf = texture2D(info,vUv);
    float angle = val.z * PI2;

    // compute the sensors positions 
    vec2 uvFL=val.xy+vec2(cos(angle-SA),sin(angle-SA)) * SO;
    vec2 uvF =val.xy+vec2(cos(angle),sin(angle)) * SO;
    vec2 uvFR=val.xy+vec2(cos(angle+SA),sin(angle+SA))*SO;

    //get the values unders the sensors 
    float FL = getTrailValue(uvFL);
    float F     = getTrailValue(uvF);
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

    val.xy = fract( val.xy );
    val.z = ( angle / PI2 );

    gl_FragColor = val;

}