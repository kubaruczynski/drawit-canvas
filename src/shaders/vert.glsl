attribute vec3 prev_position;
attribute vec3 position;
attribute vec3 next_position;
attribute float side;
attribute vec2 uv;

uniform vec2 u_resolution;
uniform float width;

void main() {
    //ratio wyświetlania
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1);
    //przeliczanie z -1,1 na pixele
    vec2 nextScreen = next_position.xy * aspect;
    vec2 prevScreen = prev_position.xy * aspect;
    //tg do wyliczenia punktu po środku
    vec2 tangent = normalize(nextScreen - prevScreen);
    //odwrócamy vector
    vec2 normal = vec2(-tangent.y, tangent.x);
    //dzielimy przez aspect, żeby wrócić do -1,1
    normal /= aspect;
    //10% ekranu, bo o -1,1;
    //normal *= 0.1;
    normal *= (1.0 - pow(abs(uv.y - 0.5) * 2.0, 2.0)) * width;
    float dist = length(nextScreen - prevScreen);
    normal *= smoothstep(0.0, 0.05, dist);

    vec4 current = vec4(position,1);
    current.xy -= normal * side;

    gl_Position = current;
}
