import * as THREE from "three";
import gsap from "gsap";
import "./style.css";
import globeImg from "./images/globe.jpg";
// @ts-ignore
import vertexShader from "./shaders/vertex.glsl";
// @ts-ignore
import fragmentShader from "./shaders/fragment.glsl";
// @ts-ignore
import atmosphereVertex from "./shaders/atmosphereVertex.glsl";
// @ts-ignore
import atmosphereFragment from "./shaders/atmosphereFragment.glsl";
import { Float32BufferAttribute } from "three";

const canvasContainer = document.querySelector<HTMLDivElement>('#canvasContainer')!;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas")!,
});


renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(7, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load(globeImg),
      },
    },
  })
);

scene.add(sphere);

// create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(7, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);

atmosphere.scale.set(1.15, 1.15, 1.15);

scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});

const starVertices = [];

for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  starVertices.push(x, y, z);
}

console.log("starsVertices", starVertices);
starGeometry.setAttribute(
  "position",
  new Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 15;

const mouse: {
  x: number | undefined;
  y: number | undefined;
} = {
  x: undefined,
  y: undefined,
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.002;
  gsap.to(group.rotation, {
    x: mouse.y ? -mouse.y * 0.3 : 0,
    y: mouse.x ? mouse.x * 0.5 : 0,
    duration: 2,
  });
}

animate();

addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = (e.clientY / innerHeight) * 2 + 1;
});
