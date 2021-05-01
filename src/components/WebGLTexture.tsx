import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Scene,
  WebGLRenderer,
  Material,
  ShaderMaterial,
  Camera,
  Mesh,
  BufferGeometry,
  BufferAttribute,
  Texture,
} from 'three';

const v0 = [-1.0, -1.0, 1.0];
const uv0 = [0.0, 0.0];
const v1 = [1.0, -1.0, 1.0];
const uv1 = [1.0, 0.0];
const v2 = [1.0, 1.0, 1.0];
const uv2 = [1.0, 1.0];
const v3 = [-1.0, 1.0, 1.0];
const uv3 = [0.0, 1.0];

const Plane = (material: Material) => {
  const vertices = new Float32Array([v0, v1, v2, v2, v3, v0].flat());
  const uvs = new Float32Array([uv0, uv1, uv2, uv2, uv3, uv0].flat());

  const geometry = new BufferGeometry()
    .setAttribute('position', new BufferAttribute(vertices, 3))
    .setAttribute('uv', new BufferAttribute(uvs, 2));

  return new Mesh(geometry, material);
};

interface IProps {
  fragmentShader: string;
  vertexShader: string;
  // TODO: strong type
  uniforms: any;
  texture: Texture;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: Camera;
}

export const WebGlTexture: React.FC<IProps> = ({
  fragmentShader,
  vertexShader,
  texture,
  uniforms,
  renderer,
  scene,
  camera,
}) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const renderScene = useCallback(() => {
    console.log('rerender WebGL');

    renderer.render(scene, camera);
  }, [renderer, scene, camera]);

  useEffect(() => {
    // identifiable clear color for debugging
    renderer.setClearColor('#880400');
    imageRef.current.appendChild(renderer.domElement);

    const material = new ShaderMaterial({
      uniforms,
      fragmentShader,
      vertexShader,
    });

    scene.clear();
    scene.add(Plane(material));

    materialRef.current = material;

    return () => {
      imageRef.current.removeChild(renderer.domElement);
    };
  }, [renderer, uniforms]);

  useEffect(() => {
    if (texture) {
      if (!materialRef.current.uniforms.imageTexture) {
        materialRef.current.uniforms.imageTexture = {
          type: 't',
          value: null,
        } as any;
      }

      materialRef.current.uniforms.imageTexture.value = texture;

      renderer.setSize(texture.image.width, texture.image.height);
      renderScene();
    }
  }, [texture, renderer, renderScene]);

  useEffect(() => {
    if (vertexShader && fragmentShader) {
      materialRef.current.setValues({
        uniforms: {
          ...uniforms,
          imageTexture: {
            type: 't',
            value: texture,
          },
        },
        fragmentShader,
        vertexShader,
      });
    }

    renderScene();
  }, [vertexShader, fragmentShader, uniforms]);

  const aspect = useMemo(() => {
    if (!texture.image) return 0;

    const { width, height } = texture.image;

    return width / height;
  }, [texture]);

  console.log({ aspect });

  return <div className="image-after" ref={imageRef} />;
};
