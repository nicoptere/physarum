
uniform sampler2D points;
uniform sampler2D input_texture;
uniform vec2 resolution;
uniform float time;
uniform float decay;
varying vec2 vUv;
void main(){

    vec2 res = 1. / resolution;
    float pos = texture2D(points, vUv).r;
    
    //accumulator
    float col = 0.;
    
    //blur box size
    const float dim = 1.;

    //weight
    float weight = 1. / pow( 2. * dim + 1., 2. );

    for( float i = -dim; i <= dim; i++ ){
    
        for( float j = -dim; j <= dim; j++ ){
    
            vec3 val = texture2D( input_texture, fract( vUv+res*vec2(i,j) ) ).rgb;
            col += val.r * weight + val.g * weight * .5;

        }
    }

    vec4 fin = vec4( pos * decay, col * decay, .5, 1. );
    gl_FragColor = clamp( fin, 0.01, 1. );
    

}