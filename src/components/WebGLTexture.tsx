import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Scene, WebGLRenderer, Camera } from 'three';
import { Slider } from './Slider';

const vertexShader = `
varying vec2 _uv;

void main() {
  _uv = uv; 

  gl_Position = vec4(position, 1.0); 
}
`;

const fragmentShader = `
uniform float blend;
uniform sampler2D imageTexture;

varying vec2 _uv;

void main () {
  gl_FragColor = texture2D(imageTexture, _uv) * blend;
}`;

let mount: HTMLDivElement = undefined;
let camera: Camera = undefined;
let scene: THREE.Scene = undefined;
let renderer: WebGLRenderer | undefined = undefined;

const uniforms = {
  blend: { value: 0 },
  imageTexture: {
    type: 't',
    value: 0,
  },
};

const material = new THREE.ShaderMaterial({
  uniforms,
  fragmentShader,
  vertexShader,
});

const v0 = [-1.0, -1.0, 1.0];
const uv0 = [0.0, 0.0];
const v1 = [1.0, -1.0, 1.0];
const uv1 = [1.0, 0.0];
const v2 = [1.0, 1.0, 1.0];
const uv2 = [1.0, 1.0];
const v3 = [-1.0, 1.0, 1.0];
const uv3 = [0.0, 1.0];

async function loadTexture() {
  return new THREE.TextureLoader().loadAsync(
    'https://images.unsplash.com/photo-1619665760845-d009188ef271?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'
  );
}

const Plane = () => {
  const vertices = new Float32Array([v0, v1, v2, v2, v3, v0].flat());
  const uvs = new Float32Array([uv0, uv1, uv2, uv2, uv3, uv0].flat());

  const geometry = new THREE.BufferGeometry()
    .setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    .setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  return new THREE.Mesh(geometry, material);
};

export const WebGlTexture: React.FC = () => {
  const renderScene = () => {
    renderer?.render(scene, camera);
  };

  const [blendState, updateBlend] = useState(0.5);
  const [texture, setTexture] = useState<THREE.Texture>();

  useEffect(() => {
    // add scene
    scene = new Scene();

    camera = new THREE.PerspectiveCamera(75, uniforms.blend.value, 0.1, 1000);

    // add renderer
    renderer = new WebGLRenderer();
    // identifiable clear color for debugging
    renderer.setClearColor('#880400');
    mount.appendChild(renderer.domElement);

    scene.add(Plane());

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    loadTexture().then(loadedTexture => setTexture(loadedTexture));
  }, []);

  useEffect(() => {
    if (texture) {
      (material.uniforms as any).imageTexture.value = texture;

      // calculate aspect and scale texture to container size
      // TODO: this only works if the container has no other contents. it also breaks when changing zoom level (we need to trigger a rerender with native handlers then)
      const aspectWidth = Math.round(aspect * (mount?.clientHeight ?? 0));
      const aspectHeight = Math.round((aspect && mount?.clientHeight) || 0);

      renderer.setSize(aspectWidth, aspectHeight);

      renderScene();
    }
  }, [texture]);

  useEffect(() => {
    console.log('rerender WebGL');

    (material.uniforms as any).blend.value = blendState;

    renderScene();
  }, [blendState]);

  const aspect = useMemo(() => {
    return texture?.image.width && texture?.image.height ? texture?.image.width / texture?.image.height : 0;
  }, [texture]);

  return (
    <div className="image-after" ref={m => (mount = m)}>
      <div />
      {/* TODO: debounce */}

      {false && <Slider value={blendState} update={value => updateBlend(value)} label="Shader blend value example" />}
    </div>
  );
};
