import { useEffect, useRef } from 'react';
import { LOGO } from '../constants';

// JPG used for shader — white background helps Poisson solve treat logo as one connected region
// PNG used for the loader placeholder only
const SHADER_SRC = '/logo.jpg';

const VERT = `#version 300 es
precision mediump float;
in vec2 a_position;
out vec2 vUv;
void main(){vUv=.5*(a_position+1.);gl_Position=vec4(a_position,0.,1.);}`;

const FRAG = `#version 300 es
precision mediump float;
in vec2 vUv;out vec4 fragColor;
uniform sampler2D u_image_texture;
uniform float u_time,u_ratio,u_img_ratio,u_patternScale,u_refraction,u_edge,u_patternBlur,u_liquid;
#define PI 3.14159265358979323846
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)),x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m;m=m*m;
  vec3 x=2.*fract(p*C.www)-1.,h=abs(x)-.5,ox=floor(x+.5),a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);}
vec2 getImgUv(){
  vec2 uv=vUv-.5;
  if(u_ratio>u_img_ratio)uv.x*=u_ratio/u_img_ratio;
  else uv.y*=u_img_ratio/u_ratio;
  uv+=.5;uv.y=1.-uv.y;return uv;}
vec2 rot(vec2 uv,float th){return mat2(cos(th),sin(th),-sin(th),cos(th))*uv;}
float colorCh(float c1,float c2,float sp,vec3 w,float eb,float b){
  float ch=c2,blur=u_patternBlur+eb;
  ch=mix(ch,c1,smoothstep(.0,blur,sp));
  float brd=w[0];ch=mix(ch,c2,smoothstep(brd-blur,brd+blur,sp));
  b=smoothstep(.2,.8,b);brd=w[0]+.4*(1.-b)*w[1];ch=mix(ch,c1,smoothstep(brd-blur,brd+blur,sp));
  brd=w[0]+.5*(1.-b)*w[1];ch=mix(ch,c2,smoothstep(brd-blur,brd+blur,sp));
  brd=w[0]+w[1];ch=mix(ch,c1,smoothstep(brd-blur,brd+blur,sp));
  float gt=(sp-w[0]-w[1])/w[2],gr=mix(c1,c2,smoothstep(0.,1.,gt));
  ch=mix(ch,gr,smoothstep(brd-blur,brd+blur,sp));return ch;}
float frameAlpha(vec2 uv,float fw){
  float a=smoothstep(0.,fw,uv.x)*smoothstep(1.,1.-fw,uv.x);
  return a*smoothstep(0.,fw,uv.y)*smoothstep(1.,1.-fw,uv.y);}
void main(){
  vec2 uv=vUv;uv.y=1.-uv.y;uv.x*=u_ratio;
  float diag=uv.x-uv.y,t=.001*u_time;
  vec2 imgUv=getImgUv();
  vec4 img=texture(u_image_texture,imgUv);
  vec3 c1=vec3(.941,.471,.251),c2=vec3(.176,.165,.431+.05*smoothstep(.7,1.3,uv.x+uv.y));
  float edge=img.r;
  vec2 gu=uv-.5;
  float dist=length(gu+vec2(0.,.2*diag));
  gu=rot(gu,(.25-.2*diag)*PI);
  float bulge=pow(1.8*dist,1.2);bulge=1.-bulge;bulge*=pow(uv.y,.3);
  float cw=u_patternScale;
  float t1r=.12/cw*(1.-.4*bulge),t2r=.07/cw*(1.+.4*bulge);
  float t1w=cw*t1r,t2w=cw*t2r;
  float opacity=1.-smoothstep(.9-.5*u_edge,1.-.5*u_edge,edge);
  opacity*=frameAlpha(imgUv,.01);
  float noise=snoise(uv-t);
  edge+=(1.-edge)*u_liquid*noise;
  float refr=clamp(1.-bulge,0.,1.),dir=gu.x+diag;
  dir-=2.*noise*diag*(smoothstep(0.,1.,edge)*smoothstep(1.,0.,edge));
  bulge*=clamp(pow(uv.y,.1),.3,1.);
  dir*=(.1+(1.1-edge)*bulge);dir*=smoothstep(1.,.7,edge);
  dir+=.18*(smoothstep(.1,.2,uv.y)*smoothstep(.4,.2,uv.y));
  dir+=.03*(smoothstep(.1,.2,1.-uv.y)*smoothstep(.4,.2,1.-uv.y));
  dir*=(.5+.5*pow(uv.y,2.))*cw;dir-=t;
  float rr=refr+.03*bulge*noise,rb=1.3*refr;
  rr+=5.*(smoothstep(-.1,.2,uv.y)*smoothstep(.5,.1,uv.y))*(smoothstep(.4,.6,bulge)*smoothstep(1.,.4,bulge));
  rr-=diag;rb+=(smoothstep(0.,.4,uv.y)*smoothstep(.8,.1,uv.y))*(smoothstep(.4,.6,bulge)*smoothstep(.8,.4,bulge));
  rb-=.2*edge;rr*=u_refraction;rb*=u_refraction;
  vec3 w=vec3(t1w,t2w,1.-t1r-t2r);
  w[1]-=.02*smoothstep(.0,1.,edge+bulge);
  float sr=mod(dir+rr,1.),sg=mod(dir,1.),sb=mod(dir-rb,1.);
  vec3 col=vec3(colorCh(c1.r,c2.r,sr,w,.02+.03*u_refraction*bulge,bulge),
                colorCh(c1.g,c2.g,sg,w,.01/(1.-diag),bulge),
                colorCh(c1.b,c2.b,sb,w,.01,bulge));
  col*=opacity;fragColor=vec4(col,opacity);}`;

const PARAMS = { patternScale: 1.8, refraction: 0.025, edge: 0.18, patternBlur: 0.004, liquid: 0.12, speed: 0.4 };

function parseLogo(src: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1000;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > MAX || h > MAX) {
        if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const sc = document.createElement('canvas');
      sc.width = w; sc.height = h;
      const ctx = sc.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      const px = ctx.getImageData(0, 0, w, h).data;

      const shape = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        shape[y * w + x] = (px[i] > 210 && px[i + 1] > 210 && px[i + 2] > 210) || px[i + 3] < 30 ? 0 : 1;
      }

      let x0 = w, y0 = h, x1 = 0, y1 = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (!shape[y * w + x]) continue;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      const pad = Math.round(Math.max(w, h) * 0.04);
      x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
      x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
      const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

      const cc = document.createElement('canvas');
      cc.width = cw; cc.height = ch;
      cc.getContext('2d')!.drawImage(sc, x0, y0, cw, ch, 0, 0, cw, ch);
      const cpx = cc.getContext('2d')!.getImageData(0, 0, cw, ch).data;
      const cs = new Uint8Array(cw * ch);
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const i = (y * cw + x) * 4;
        cs[y * cw + x] = (cpx[i] > 210 && cpx[i + 1] > 210 && cpx[i + 2] > 210) || cpx[i + 3] < 30 ? 0 : 1;
      }

      const ins = (x: number, y: number) => x >= 0 && x < cw && y >= 0 && y < ch && cs[y * cw + x] === 1;
      const bnd = new Uint8Array(cw * ch);
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const idx = y * cw + x; if (!cs[idx]) continue;
        outer: for (let ny = y - 1; ny <= y + 1; ny++) for (let nx = x - 1; nx <= x + 1; nx++)
          if (!ins(nx, ny)) { bnd[idx] = 1; break outer; }
      }

      let u = new Float32Array(cw * ch), nu = new Float32Array(cw * ch);
      const C = 0.01, TOTAL = 300, BATCH = 15;
      const getU = (x: number, y: number) => (x < 0 || x >= cw || y < 0 || y >= ch || !cs[y * cw + x]) ? 0 : u[y * cw + x];

      function step(done: number) {
        if (done >= TOTAL) {
          let mx = 0;
          for (let i = 0; i < u.length; i++) if (u[i] > mx) mx = u[i];
          const out = new Uint8ClampedArray(cw * ch * 4);
          for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
            const idx = y * cw + x, p = idx * 4;
            if (!cs[idx]) { out[p] = out[p + 1] = out[p + 2] = out[p + 3] = 255; }
            else {
              const g = Math.round(255 * (1 - Math.pow(mx > 0 ? u[idx] / mx : 0, 2)));
              out[p] = out[p + 1] = out[p + 2] = g; out[p + 3] = 255;
            }
          }
          resolve(new ImageData(out, cw, ch));
          return;
        }
        for (let b = 0; b < BATCH; b++) {
          for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
            const idx = y * cw + x;
            nu[idx] = (!cs[idx] || bnd[idx]) ? 0 : (C + getU(x + 1, y) + getU(x - 1, y) + getU(x, y + 1) + getU(x, y - 1)) / 4;
          }
          [u, nu] = [nu, u];
        }
        setTimeout(() => step(done + BATCH), 0);
      }
      step(0);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function LiquidLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !loader || !wrap) return;

    let animId: number;
    let cancelled = false;

    parseLogo(SHADER_SRC).then((imageData) => {
      if (cancelled) return;

      const gl = canvas.getContext('webgl2', { antialias: true, alpha: true });
      if (!gl) return;

      const mkShader = (src: string, type: number) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
        return s;
      };

      const prog = gl.createProgram()!;
      gl.attachShader(prog, mkShader(VERT, gl.VERTEX_SHADER)!);
      gl.attachShader(prog, mkShader(FRAG, gl.FRAGMENT_SHADER)!);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }

      const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
      gl.useProgram(prog);
      const pos = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const uni: Record<string, WebGLUniformLocation | null> = {};
      const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(prog, i)!.name; uni[nm] = gl.getUniformLocation(prog, nm); }

      const imgRatio = imageData.width / imageData.height;
      const baseSize = Math.round(1000 * devicePixelRatio);
      canvas.width = baseSize;
      canvas.height = Math.round(baseSize / imgRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      wrap.style.aspectRatio = `${imageData.width} / ${imageData.height}`;

      gl.uniform1f(uni.u_ratio, imgRatio);
      gl.uniform1f(uni.u_img_ratio, imgRatio);
      gl.uniform1f(uni.u_patternScale, PARAMS.patternScale);
      gl.uniform1f(uni.u_refraction, PARAMS.refraction);
      gl.uniform1f(uni.u_edge, PARAMS.edge);
      gl.uniform1f(uni.u_patternBlur, PARAMS.patternBlur);
      gl.uniform1f(uni.u_liquid, PARAMS.liquid);

      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imageData.width, imageData.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData.data);
      gl.uniform1i(uni.u_image_texture, 0);

      let totalTime = 0, last = performance.now();
      const render = (now: number) => {
        if (cancelled) return;
        const dt = now - last; last = now;
        totalTime += dt * PARAMS.speed;
        gl.uniform1f(uni.u_time, totalTime);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animId = requestAnimationFrame(render);
      };
      animId = requestAnimationFrame(render);

      canvas.classList.add('ready');
      loader.classList.add('hidden');
    }).catch(e => console.error('Liquid logo:', e));

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="liquid-logo-wrap" ref={wrapRef}>
      <canvas ref={canvasRef} id="liquid-logo-canvas" />
      <div className="liquid-loader" ref={loaderRef} id="liquid-loader">
        <div className="liquid-loader-inner">
          <img src={LOGO} alt="Levated Enterprises" />
        </div>
      </div>
    </div>
  );
}
