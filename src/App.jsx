
import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import "./App.css";



function calculateAngle(hip, knee, ankle) {
  const radians =
    Math.atan2(ankle.y - knee.y, ankle.x - knee.x) -
    Math.atan2(hip.y - knee.y, hip.x - knee.x);

  let angle = Math.abs((radians * 180) / Math.PI);

  if (angle > 180) {
    angle = 360 - angle;
  }

  return Math.round(angle);
}

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Initializing AI...");
  const [running, setRunning] = useState(false);
  const [kneeAngle, setKneeAngle] = useState("--");
  const [reps, setReps] = useState(0);
  const [phase, setPhase] = useState("Standing");
  const squatPhase = useRef("standing");
  const [feedback, setFeedback] = useState("Ready to start");
  

  useEffect(() => {
    let landmarker;
    let stream;
    let frameId;
    let active = true;
    let lastVideoTime = -1;

    async function start() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "/node_modules/@mediapipe/tasks-vision/wasm"
        );

        landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });

        if (!active) {
          landmarker.close();
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          landmarker.close();
          return;
        }

        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();

        if (!active) return;

        setStatus("AI trainer is ready");
        setRunning(true);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const drawing = new DrawingUtils(ctx);

        function detect() {
          if (!active || !video.videoWidth) return;

          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const result = landmarker.detectForVideo(
              video,
              performance.now()
            );

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (result.landmarks?.length) {
              for (const landmarks of result.landmarks) {
                drawing.drawConnectors(
                  landmarks,
                  PoseLandmarker.POSE_CONNECTIONS,
                  { color: "#00E5A8", lineWidth: 4 }
                );

                drawing.drawLandmarks(landmarks, {
                  color: "#FFFFFF",
                  fillColor: "#00E5A8",
                  radius: 3,
                });

                
                const hip = landmarks[23];
                const knee = landmarks[25];
                const ankle = landmarks[27];

                // Check landmark visibility before calculating angle
                const visibilityThreshold = 0.6;

                if (
                  (hip.visibility ?? 0) < visibilityThreshold ||
                  (knee.visibility ?? 0) < visibilityThreshold ||
                  (ankle.visibility ?? 0) < visibilityThreshold
                ) {
                  setPhase("Body not clearly visible");
                  setFeedback("Move your legs into clear camera view.");
                } else {
                  const angle = calculateAngle(hip, knee, ankle);
                  setKneeAngle(angle);

                  if (angle > 150) {
                    if (squatPhase.current === "bottom") {
                      setReps((prev) => prev + 1);
                      setFeedback("Squat completed!");
                    } else {
                      setFeedback("Stand upright to begin.");
                    }

                    squatPhase.current = "standing";
                    setPhase("Standing");
                  } else if (angle < 130) {
                    squatPhase.current = "bottom";
                    setPhase("Squatting");
                    setFeedback("Bottom position detected.");
                  } else {
                    setPhase("Moving");
                    setFeedback("Move with control.");
                  }
                }
              }

              setStatus("Body detected");
            } else {
              setStatus("Move into camera view");
            }
          }

          frameId = requestAnimationFrame(detect);
        }

        detect();
      } catch (error) {
        console.error(error);
        setStatus(
          "Could not start. Check camera permissions and connection."
        );
      }
    }

    start();

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
    };
  }, []);

  return (
    <main className="app">
      <header>
        <h1>FitForm <span>AI</span></h1>
        <p>Your personal AI gym trainer</p>
      </header>

      <section className="workout">
        <div className="camera">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
          <canvas ref={canvasRef} />
          <div className="status">{status}</div>
        </div>

        <aside>
          <h2>Live Analysis</h2>
          <p>AI Status: {running ? "Active" : "Starting..."}</p>
          <p>Exercise: Not selected</p>
          <p>Repetitions: {reps}</p>
          <p>Movement Phase: {phase}</p>
          <p>Form feedback: {feedback}</p>
          <p>Knee Angle: {kneeAngle}°</p>
          <small>
            Initial prototype: pose detection only.
            Exercise analysis comes next.
          </small>
        </aside>
      </section>
    </main>
  );
}