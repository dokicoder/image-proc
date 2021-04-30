import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Scene,
  WebGLRenderer,
  Material,
  ShaderMaterial,
  PerspectiveCamera,
  Mesh,
  BufferGeometry,
  BufferAttribute,
  Texture,
  TextureLoader,
} from 'three';

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

const v0 = [-1.0, -1.0, 1.0];
const uv0 = [0.0, 0.0];
const v1 = [1.0, -1.0, 1.0];
const uv1 = [1.0, 0.0];
const v2 = [1.0, 1.0, 1.0];
const uv2 = [1.0, 1.0];
const v3 = [-1.0, 1.0, 1.0];
const uv3 = [0.0, 1.0];

async function loadTexture() {
  return new TextureLoader().loadAsync(
    'https://images.unsplash.com/photo-1619665760845-d009188ef271?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'
  );
}

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
}

export const WebGlTexture: React.FC<IProps> = ({ fragmentShader, vertexShader, texture, uniforms }) => {
  const renderSceneRef = useRef<() => void>(null);
  const rendererRef = useRef<WebGLRenderer>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  useEffect(
    () => {
      // add scene
      const scene = new Scene();
      const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

      // add renderer
      const renderer = new WebGLRenderer();
      // identifiable clear color for debugging
      renderer.setClearColor('#880400');
      imageRef.current.appendChild(renderer.domElement);

      const material = new ShaderMaterial({
        uniforms,
        fragmentShader,
        vertexShader,
      });

      scene.add(Plane(material));

      materialRef.current = material;
      rendererRef.current = renderer;
      renderSceneRef.current = () => {
        console.log('rerender WebGL');

        renderer.render(scene, camera);
      };

      return () => {
        imageRef.current.removeChild(renderer.domElement);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (texture) {
      if (!materialRef.current.uniforms.imageTexture) {
        materialRef.current.uniforms.imageTexture = {
          type: 't',
          value: null,
        } as any;
      }

      materialRef.current.uniforms.imageTexture.value = texture;

      rendererRef.current.setSize(texture.image.width, texture.image.height);
      renderSceneRef.current();
    }
  }, [texture]);

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

    renderSceneRef.current();
  }, [vertexShader, fragmentShader, uniforms]);

  const aspect = useMemo(() => {
    if (!texture.image) return 0;

    const { width, height } = texture.image;

    return width / height;
  }, [texture]);

  console.log(aspect);

  return <div className="image-after" ref={imageRef} />;
};

export const WebGlTextureDefault: React.FC = () => {
  const [texture, setTexture] = useState<Texture>();

  const uniforms = {
    blend: { value: 1.0 },
  };

  useEffect(() => {
    loadTexture().then(loadedTexture => setTexture(loadedTexture));
  }, []);

  return texture ? (
    <WebGlTexture texture={texture} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
  ) : null;
};
