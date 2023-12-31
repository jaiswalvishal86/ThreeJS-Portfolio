uniform vec2 uFrequency;
uniform float uTime;
uniform vec2 uMouse;


// attribute float aRandom;



varying vec2 vUv;



void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.5;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.5;
    

    // modelPosition.z += aRandom;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;


    gl_Position = projectedPosition;

    vUv = uv;
    
}