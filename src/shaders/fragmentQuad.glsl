uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uGrain;
uniform vec2 uMouse;
varying vec2 vUv;



float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))*43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main()
{
     vec4 image = texture2D(uTexture, vUv);
     vec4 grain = texture2D(uGrain, vUv);

     float dist = length(vUv - vec2(0.5));
    //  if(dist > 0.5) discard;
     float r = 0.59;

     float g_out = pow(dist/r, 110.);
     float mag_out = 0.5 - cos(g_out - 1.);
     vec2 uv_out = dist < r ? vUv + mag_out * (vUv - vec2(0.5)) : vUv;

     float g_in = pow(dist/r, -8.);
     vec2 g_in_power = vec2(sin(vUv.x - 0.5), sin(vUv.y - 0.5));

     float mag_in = 0.5 - cos(g_in - 1.);

     vec2 uv_in = dist > r ? vUv : (vUv - vec2(0.5)) * mag_in * g_in_power;

     vec2 gridUv = vec2(
        floor(vUv.x * 10.0) + 1.,
        floor(vUv.y * 10.0) + 1.
    );
    float strength = random(gridUv);

    



     gl_FragColor = vec4(0., 1., 1., 1.);
     gl_FragColor = image;
     gl_FragColor = grain;

     vec2 uv_display = vUv + uv_out * 0.01 + uv_in * sin(uTime) + (grain.rg - vec2(0.5)) * -0.1;

     vec4 uvTexture = texture2D(uTexture, uv_display);




     gl_FragColor = vec4(uv_out, 0., 1.);
     gl_FragColor = vec4(vec3(mag_in), 1.);
     gl_FragColor = vec4(vec3(uv_display, 0.), 1.);
     gl_FragColor = uvTexture;
}