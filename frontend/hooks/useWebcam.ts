"use client";

import { useCallback, useRef } from "react";

export default function useWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    if (streamRef.current) {
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      return;
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const capture = useCallback(
    async (): Promise<File | null> => {
      const video = videoRef.current;

      if (!video) {
        return null;
      }

      if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        return null;
      }

      const canvas =
        document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context =
        canvas.getContext("2d");

      if (!context) {
        return null;
      }

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }

            resolve(
              new File(
                [blob],
                "capture.png",
                {
                  type: "image/png",
                },
              ),
            );
          },
          "image/png",
        );
      });
    },
    [],
  );

  return {
    videoRef,
    startCamera,
    stopCamera,
    capture,
  };
}