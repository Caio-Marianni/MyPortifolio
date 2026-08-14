import * as THREE from "./vendor/three.module.min.js";

/* Ferramenta local de render. Não faz parte do bundle do site:
   `three` é devDependency e nada em src/ importa este arquivo.
   Cena reconstruída a partir do config exposto no payload RSC do raycast.com. */

const canvas = document.getElementById("cv");
const stage = document.getElementById("stage");
const hud = document.getElementById("hud");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true   // necessário para o toBlob do export
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // conversão feita no pós
renderer.setClearColor(0x07090a, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090a);
const camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 200);

scene.add(new THREE.AmbientLight(0xffffff, 0.18));
const key = new THREE.DirectionalLight(0xffffff, 0.6);
key.position.set(3, 5, 8);
scene.add(key);

/* ── O cubo é a única fonte de cor da cena ───────────────────── */
const cubeMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uScale: { value: 0.99 },
    uC1: { value: new THREE.Color(0xf4feff) },
    uC2: { value: new THREE.Color(0xff7a98) },
    uC3: { value: new THREE.Color(0xb80232) },
    uC4: { value: new THREE.Color(0xff162a) }
  },
  vertexShader: /* glsl */ `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    varying vec3 vPos;
    uniform float uTime, uScale;
    uniform vec3 uC1, uC2, uC3, uC4;

    float hash(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
    float vnoise(vec3 p){
      vec3 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
        mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
    }
    float fbm(vec3 p){ return vnoise(p) * 0.6 + vnoise(p * 2.1) * 0.3 + vnoise(p * 4.3) * 0.1; }

    void main() {
      vec3 p = vPos * uScale + vec3(0.0, 0.0, uTime);
      float n1 = fbm(p);
      float n2 = fbm(p * 1.7 + 13.0);
      // Carmim é a base, vermelho a massa, rosa o acento.
      // Branco é raro de propósito: só onde os dois ruídos batem alto.
      vec3 c = mix(uC3, uC4, smoothstep(0.36, 0.66, n1));
      c = mix(c, uC2, smoothstep(0.56, 0.84, n2) * 0.8);
      c = mix(c, uC1, smoothstep(0.66, 0.88, n1 * 0.55 + n2 * 0.55));

      // Borda suave: sem isso a silhueta do cubo aparece como um losango chapado.
      // É também o que dá o formato contido de luz que o original tem.
      float r = length(vPos.xy) * 2.0;
      float fall = 1.0 - smoothstep(0.28, 1.0, r);
      gl_FragColor = vec4(c * fall * fall, 1.0);
    }`
});
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMat);
scene.add(cube);

/* ── Os 16 cilindros de vidro: lentes que refratam o cubo ────── */
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0.35,
  transmission: 1,
  ior: 1.5,
  thickness: 1,
  transparent: true
});

const glass = new THREE.Group();
scene.add(glass);
let cylGeo = null;

function buildGlass(count, radius, gap, segments) {
  glass.clear();
  if (cylGeo) cylGeo.dispose();
  cylGeo = new THREE.CylinderGeometry(radius, radius, 15, segments, 1);
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(cylGeo, glassMat);
    m.position.x = (i - (count - 1) / 2) * gap;
    glass.add(m);
  }
}

/* ── Pós: aberração cromática, vinheta, dither, linear → sRGB ── */
const rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: 4 });
const postScene = new THREE.Scene();
const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postMat = new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: { value: rt.texture },
    uRes: { value: new THREE.Vector2(1, 1) },
    uCA: { value: 3 },
    uVig: { value: 0.35 },
    uDither: { value: 0 },
    uDScale: { value: 4 }
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uCA, uVig, uDither, uDScale;

    // Bayer 8x8 ordenado, construção compacta (GLSL1)
    float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
    #define bayer4(a) (bayer2(0.5 * (a)) * 0.25 + bayer2(a))
    #define bayer8(a) (bayer4(0.5 * (a)) * 0.25 + bayer2(a))

    vec3 lin2srgb(vec3 c){
      return mix(c * 12.92, 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
    }

    void main() {
      vec2 d = vUv - 0.5;
      float amt = uCA / 1000.0;
      // Dispersão: cada canal amostra num raio ligeiramente diferente.
      vec3 c;
      c.r = texture2D(tDiffuse, vUv + d * amt).r;
      c.g = texture2D(tDiffuse, vUv).g;
      c.b = texture2D(tDiffuse, vUv - d * amt).b;

      c *= 1.0 - uVig * dot(d, d) * 2.4;
      c = lin2srgb(max(c, 0.0));

      if (uDither > 0.5) {
        float t = bayer8(gl_FragCoord.xy / uDScale) - 0.5;
        c += t / 255.0 * 2.0;
      }
      gl_FragColor = vec4(c, 1.0);
    }`
});
const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat);
// O vertex shader já emite clip space, então o quad ignora a câmera —
// mas o three ainda tentaria descartá-lo pelo frustum. Sem isso: tela preta.
postQuad.frustumCulled = false;
postScene.add(postQuad);

/* ── Controles ───────────────────────────────────────────────── */
const R = {
  rot: 100, count: 1, radius: 100, gap: 100, rough: 100, ior: 100, thick: 100, seg: 1,
  speed: 100, pscale: 100, cscale: 1, cubez: 10, camz: 100, fov: 1, ca: 10, vig: 100, dscale: 1
};
const DEC = { count: 0, seg: 0, cscale: 0, fov: 0, dscale: 0 };
const ids = Object.keys(R);
const el = {};
const defaults = {};
ids.forEach(function (id) {
  el[id] = document.getElementById(id);
  defaults[id] = el[id].value;
});
const chk = {
  dither: document.getElementById("dither"),
  anim: document.getElementById("anim"),
  mouse: document.getElementById("mouse")
};
const cols = ["c1", "c2", "c3", "c4"].map(function (id) { return document.getElementById(id); });

function val(id) { return Number(el[id].value) / R[id]; }

let needsGlass = true;

function syncLabels() {
  ids.forEach(function (id) {
    const o = document.querySelector('[data-o="' + id + '"]');
    if (o) o.textContent = val(id).toFixed(DEC[id] === undefined ? 2 : DEC[id]);
  });
}

function applyParams() {
  glassMat.roughness = val("rough");
  glassMat.ior = val("ior");
  glassMat.thickness = val("thick");

  glass.rotation.z = val("rot");
  cube.position.z = val("cubez");
  // Achatado em Z para poder ser largo o bastante para sair do quadro sem
  // atravessar o vidro em z=0. Girado para a aresta não ficar alinhada ao eixo.
  const cs = val("cscale");
  cube.scale.set(cs, cs, cs * 0.35);
  cube.rotation.z = 0.62;
  cubeMat.uniforms.uScale.value = val("pscale");
  cols.forEach(function (c, i) { cubeMat.uniforms["uC" + (i + 1)].value.set(c.value); });

  camera.position.z = val("camz");
  camera.fov = val("fov");
  camera.updateProjectionMatrix();

  postMat.uniforms.uCA.value = val("ca");
  postMat.uniforms.uVig.value = val("vig");
  postMat.uniforms.uDither.value = chk.dither.checked ? 1 : 0;
  postMat.uniforms.uDScale.value = val("dscale");

  if (needsGlass) {
    buildGlass(Math.round(val("count")), val("radius"), val("gap"), Math.round(val("seg")));
    needsGlass = false;
  }
}

ids.forEach(function (id) {
  el[id].addEventListener("input", function () {
    if (id === "count" || id === "radius" || id === "gap" || id === "seg") needsGlass = true;
    syncLabels();
    applyParams();
  });
});
cols.forEach(function (c) { c.addEventListener("input", applyParams); });
Object.keys(chk).forEach(function (k) { chk[k].addEventListener("change", applyParams); });

document.getElementById("reset").addEventListener("click", function () {
  ids.forEach(function (id) { el[id].value = defaults[id]; });
  needsGlass = true;
  syncLabels();
  applyParams();
});

document.getElementById("dump").addEventListener("click", function (e) {
  const cfg = {};
  ids.forEach(function (id) { cfg[id] = Number(val(id).toFixed(3)); });
  cfg.colors = cols.map(function (c) { return c.value; });
  cfg.dither = chk.dither.checked;
  navigator.clipboard.writeText(JSON.stringify(cfg, null, 2)).then(function () {
    const b = e.target;
    b.textContent = "Copiado";
    setTimeout(function () { b.textContent = "Copiar config JSON"; }, 1400);
  });
});

/* ── Mouse: o cubo reage, como no original ───────────────────── */
const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
addEventListener("pointermove", function (e) {
  target.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
});

/* ── Resize ──────────────────────────────────────────────────── */
function fit() {
  const pad = 40;
  let w = stage.clientWidth - pad;
  let h = stage.clientHeight - pad;
  if (w / h > 16 / 9) w = h * (16 / 9); else h = w * (9 / 16);
  setSize(Math.round(w), Math.round(h), Math.min(devicePixelRatio, 2));
}
function setSize(w, h, pr) {
  renderer.setPixelRatio(pr);
  renderer.setSize(w, h, true);
  rt.setSize(Math.round(w * pr), Math.round(h * pr));
  postMat.uniforms.uRes.value.set(w * pr, h * pr);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener("resize", fit);

/* ── Loop ────────────────────────────────────────────────────── */
let t = 0, last = performance.now(), fps = 0;

function draw() {
  renderer.setRenderTarget(rt);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  renderer.render(postScene, postCam);
}

function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  fps = fps * 0.9 + (1 / dt) * 0.1;

  if (chk.anim.checked) {
    t += dt * val("speed");
    cubeMat.uniforms.uTime.value = t;
  }
  if (chk.mouse.checked) {
    mouse.lerp(target, 0.05);
    cube.rotation.y = mouse.x * 0.3;
    cube.rotation.x = mouse.y * 0.3;
    cube.position.x = mouse.x * val("cscale") * 0.2;
    cube.position.y = -mouse.y * val("cscale") * 0.2;
  }

  draw();
  hud.textContent =
    renderer.domElement.width + "×" + renderer.domElement.height +
    "  ·  " + Math.round(fps) + " fps  ·  " + glass.children.length + " cilindros";
}

/* ── Export ──────────────────────────────────────────────────── */
document.querySelectorAll("[data-x]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const w = Number(btn.dataset.x);
    const h = Math.round(w * 9 / 16);
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = "…";

    requestAnimationFrame(function () {
      setSize(w, h, 1);
      draw();
      renderer.domElement.toBlob(function (blob) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "hero-" + w + ".png";
        a.click();
        URL.revokeObjectURL(a.href);
        fit();
        btn.disabled = false;
        btn.textContent = label;
      }, "image/png");
    });
  });
});

syncLabels();
applyParams();
fit();
requestAnimationFrame(loop);
