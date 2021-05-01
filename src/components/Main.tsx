import React from 'react';
import { WebGlTextureDefault } from './WebGLTexture';
import { BeforeAfterImageWithSlider } from './BeforeAfterImageWithSlider';
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';

export const Main: React.FC = () => {
  console.log('ImgProc 🖼️');

  const renderer = new WebGLRenderer();
  // add scene
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

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

  return (
    <div id="main">
      <BeforeAfterImageWithSlider
        before={
          <img src="https://images.unsplash.com/photo-1619665760845-d009188ef271?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" />
        }
        after={<WebGlTextureDefault renderer={renderer} scene={scene} camera={camera} />}
      />
      <button className="download-button" onClick={saveResult}>
        Download
      </button>
    </div>
  );
};
