import React, { useRef, useEffect } from "react";
import { PHASE_MAP } from "./phasemap";

const PDEBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let nx: number, ny: number;
    let u: Float32Array, u_new: Float32Array;

    // Dynamical Phi^4_2 (stochastic quantization):
    //   du = ( lap(u) - g * (u^3 - 3*C*u) ) dt + xi
    // on a periodic lattice of spacing 1, where xi is space-time white
    // noise. C is the Wick constant that renormalizes the cubic term.
    const dt = 0.15;        // must stay below 0.5: explicit diffusion, dx = 1
    const coupling: number = 0.1;   // g
    const extraMass: number = 0;  // added on top of the Wick counterterm; 0 = exact Phi^4_2
    const halfDt = dt / 2;
    const noiseScale = Math.sqrt(halfDt); // white noise over a cell of volume dt*dx^2

    let wick = 0;   // C, recomputed whenever the lattice changes
    let drift = 0;  // 3*g*C + extraMass, the linear coefficient of the reaction step
    let colorScale = 1; // field value mapped to the end of the colormap

    // Box - Muller transform
    function randn_bm(mean = 0, std = 1) {
      let u = 0, v = 0;
      while (u === 0) u = Math.random(); // avoid 0
      while (v === 0) v = Math.random();
      const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return num * std + mean;
    }

    // Initialize field with random values
    function initField() {
      for (let i = 0; i < u.length; i++) {
        u[i] = randn_bm(0, 0.5);
      }
    }

    // Wick constant: the stationary variance of the linear equation on this
    // lattice, i.e. the sum of 1/(2*lambda_k) over the nonzero eigenvalues of
    // the discrete Laplacian. Grows like log(N)/(4*pi) in the linear lattice
    // size N (the 1/(4*pi) rather than 1/(2*pi) because the invariant measure
    // here has covariance (-2*lap)^-1), which is exactly the log divergence
    // that Phi^4_2 renormalizes away.
    function wickConstant() {
      let sum = 0;
      for (let ky = 0; ky < ny; ky++) {
        const sy = Math.sin((Math.PI * ky) / ny);
        for (let kx = 0; kx < nx; kx++) {
          if (kx === 0 && ky === 0) continue; // zero mode: confined by the nonlinearity
          const sx = Math.sin((Math.PI * kx) / nx);
          sum += 1 / (8 * (sx * sx + sy * sy));
        }
      }
      return sum / (nx * ny);
    }

    // Resize canvas and recompute grid
    function resizeCanvas() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const cssWidth = rect.width;
      const cssHeight = rect.height;

      // Fill parent visually
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      // Internal buffer for HiDPI
      canvas.width = cssWidth * window.devicePixelRatio;
      canvas.height = cssHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      // Grid resolution: maintain aspect ratio
      ny = 250; // fixed vertical cells
      nx = Math.floor((ny * cssWidth) / cssHeight);

      u = new Float32Array(nx * ny);
      u_new = new Float32Array(nx * ny);

      wick = wickConstant();
      drift = 3 * coupling * wick + extraMass;

      // Colors are pinned to absolute field values, not to the current frame's
      // range: the wells sit at +-sqrt(drift/g), so a little past them covers
      // the fluctuations too. Without the nonlinearity, fall back to 3 sigma of
      // the linear equation.
      colorScale =
        coupling > 0 ? 1.6 * Math.sqrt(drift / coupling) : 3 * Math.sqrt(wick);

      initField();
    }

    resizeCanvas();

    function lap(x: number, y: number) {
      const idx = x + y * nx;
      const u0 = u[idx];

      const ux1 = u[(x + 1 < nx ? x + 1 : 0) + y * nx];
      const ux2 = u[(x - 1 >= 0 ? x - 1 : nx - 1) + y * nx];
      const uy1 = u[x + (y + 1 < ny ? y + 1 : 0) * nx];
      const uy2 = u[x + (y - 1 >= 0 ? y - 1 : ny - 1) * nx];

      return ux1 + ux2 + uy1 + uy2 - 4 * u0;
    }

    // Linear half step: diffusion plus noise, explicit Euler.
    function linearHalfStep() {
      for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
          const idx = x + y * nx;
          u_new[idx] = u[idx] + halfDt * lap(x, y) + noiseScale * randn_bm();
        }
      }
      u.set(u_new);
    }

    // Reaction step, solved exactly. du/dt = a*u - g*u^3 is a Bernoulli
    // equation: y = u^2 satisfies a linear ODE in 1/y, giving
    //   u(dt) = sign(u0) * [ (1/u0^2 - g/a) * exp(-2*a*dt) + g/a ]^(-1/2).
    // Being exact, this step is unconditionally stable, so the cubic never
    // blows up and dt is limited only by the diffusion above.
    function reactionStep() {
      if (coupling === 0) return;

      const decay = Math.exp(-2 * drift * dt);
      const ratio = coupling / drift;

      for (let i = 0; i < u.length; i++) {
        const u0 = u[i];
        const sq = u0 * u0;

        // Near zero the cubic is negligible and 1/u0^2 overflows; the
        // solution there is just the linearized one.
        if (sq < 1e-20) {
          u[i] = u0 * Math.exp(drift * dt);
          continue;
        }

        const z = (1 / sq - ratio) * decay + ratio;
        u[i] = (u0 < 0 ? -1 : 1) / Math.sqrt(z);
      }
    }

    // Strang splitting, second order in dt. The two half steps each carry
    // variance dt/2, so the noise accumulated over a full step is correct.
    function step() {
      linearHalfStep();
      reactionStep();
      linearHalfStep();
    }

    function draw() {
      const width = canvas.width;   // full internal buffer
      const height = canvas.height; // full internal buffer

      const image = ctx.createImageData(width, height);

      const last = PHASE_MAP.length - 1;

      for (let j = 0; j < height; j++) {
        const y = Math.floor((j / height) * ny);
        for (let i = 0; i < width; i++) {
          const x = Math.floor((i / width) * nx);
          const v = u[x + y * nx];

          // Fixed symmetric scale, so a given color always means the same field
          // value and u = 0 always lands on the dark midpoint. Renormalizing per
          // frame instead made the colors drift and forced the brightest stop on
          // screen at all times.
          let val = 0.5 + v / (2 * colorScale);
          val = Math.min(1, Math.max(0, val));

          let ci = Math.floor(val * last);
          ci = Math.max(0, Math.min(last, ci));
          const color = PHASE_MAP[ci];

          const idx = 4 * (i + j * width);
          image.data[idx] = color[0];
          image.data[idx + 1] = color[1];
          image.data[idx + 2] = color[2];
          image.data[idx + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);
    }

    // Simulation steps per rendered frame. Lower = slower evolution.
    // Fractional values spread one step across several frames.
    const stepsPerFrame = 0.5;
    let pendingSteps = 0;

    function loop() {
      pendingSteps += stepsPerFrame;
      let stepped = false;
      while (pendingSteps >= 1) {
        step();
        pendingSteps -= 1;
        stepped = true;
      }
      if (stepped) draw();
      requestAnimationFrame(loop);
    }
    draw();
    loop();

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default PDEBackground;

