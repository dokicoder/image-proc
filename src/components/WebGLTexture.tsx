import React, { useEffect, useState } from 'react';
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

varying vec2 _uv;

void main () {
    gl_FragColor = vec4 (_uv * blend, 0., 1.);
}`;

let mount: HTMLDivElement = undefined;
let camera: Camera = undefined;
let scene: THREE.Scene = undefined;
let renderer: WebGLRenderer | undefined = undefined;

const uniforms = {
  blend: { value: 0 },
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

  useEffect(() => {
    const { clientWidth: width, clientHeight: height } = mount;

    // add scene
    scene = new Scene();

    camera = new THREE.PerspectiveCamera(75, uniforms.blend.value, 0.1, 1000);

    // add renderer
    renderer = new WebGLRenderer({ antialias: true });
    // identifiable clear color for debugging
    renderer.setClearColor('#880400');
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    scene.add(Plane());

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    console.log('rerender WebGL');

    (material.uniforms as any).blend.value = blendState;

    renderScene();
  }, [blendState]);

  return (
    <>
      <div style={{ width: '500px', height: '800px' }} ref={m => (mount = m)} />
      {/* TODO: debounce */}
      <div>
        <Slider value={blendState} update={value => updateBlend(value)} label="Some shader value" />
      </div>
    </>
  );
};
