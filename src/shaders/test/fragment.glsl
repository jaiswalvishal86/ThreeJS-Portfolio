precision mediump float;

uniform sampler2D uTexture;

uniform vec3 uColor;

varying vec2 vUv;



void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    gl_FragColor = textureColor;
}