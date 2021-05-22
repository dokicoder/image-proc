import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WebGlTexture } from './WebGLTexture';
import { BeforeAfterImageWithSlider } from './BeforeAfterImageWithSlider';
import { WebGLRenderer, Scene, PerspectiveCamera, Texture, TextureLoader } from 'three';
import { Slider } from './Slider';

const renderer = new WebGLRenderer();
// add scene
const scene = new Scene();
const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

const vertexShader = `
varying vec2 _uv;

void main() {
  _uv = uv; 

  gl_Position = vec4(position, 1.0); 
}
`;

const fragmentShader = `
uniform float gamma;
uniform sampler2D imageTexture;

varying vec2 _uv;

void main () {
  vec4 color = texture2D(imageTexture, _uv);

  gl_FragColor = pow(color, vec4(gamma));
}`;

async function loadTexture() {
  return new TextureLoader().loadAsync(
    'https://images.unsplash.com/photo-1619665760845-d009188ef271?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'
  );
}

export const Main: React.FC = () => {
  const [texture, setTexture] = useState<Texture>();
  const [gamma, setGamma] = useState(1);

  useEffect(() => {
    loadTexture().then(loadedTexture => setTexture(loadedTexture));
  }, []);

  const imageContainerRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      gamma: { value: gamma },
    }),
    [gamma]
  );

  const [viewportDimensions, setViewportDimensions] = useState<{ width: number; height: number }>();

  const saveResult = () => {
    renderer.render(scene, camera);

    const dataUrl = renderer.domElement.toDataURL();

    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = 'result';

    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => document.body.removeChild(anchor));
  };

  return texture ? (
    <div className="image-container" ref={imageContainerRef} style={viewportDimensions}>
      <BeforeAfterImageWithSlider
        ref={imageContainerRef}
        before={
          <div
            className="image-before"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1619665760845-d009188ef271?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80")',
            }}
          />
        }
        after={
          <WebGlTexture
            renderer={renderer}
            scene={scene}
            camera={camera}
            texture={texture}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            onCalculateDimensions={(width, height) => {
              setViewportDimensions({ width, height });
            }}
          />
        }
      />
      <div className="gamma-slider">
        <Slider value={gamma} update={setGamma} label="Gamma" range={[0, 3]} />
      </div>

      <button className="download-button" onClick={saveResult}>
        Download
      </button>
    </div>
  ) : null;
};
