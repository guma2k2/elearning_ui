// Whiteboard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../utils/firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const Whiteboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState<string>('#000000');
    const [brushSize, setBrushSize] = useState<number>(5);

    const canvasId = 'whiteboard';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth - 50;
        canvas.height = window.innerHeight - 150;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;
            ctx.lineWidth = brushSize;
            ctxRef.current = ctx;
        }
    }, [color, brushSize]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        ctxRef.current?.beginPath();
        ctxRef.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !ctxRef.current) return;

        ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctxRef.current.stroke();
    };

    const stopDrawing = () => {
        ctxRef.current?.closePath();
        setIsDrawing(false);
    };

    const saveCanvas = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataURL = canvas.toDataURL();
        const ref = doc(collection(db, 'canvasData'), canvasId);

        try {
            await setDoc(ref, { data: dataURL });
            alert('Canvas saved successfully!');
        } catch (error) {
            console.error('Error saving canvas:', error);
        }
    };

    const loadCanvas = async () => {
        const ref = doc(collection(db, 'canvasData'), canvasId);

        try {
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.src = docSnap.data()?.data || '';
                    img.onload = () => {
                        ctx?.drawImage(img, 0, 0);
                    };
                }
            } else {
                alert('No saved canvas data found!');
            }
        } catch (error) {
            console.error('Error loading canvas:', error);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !ctxRef.current) return;

        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="whiteboard-container">
            <div className="toolbar">
                <button onClick={saveCanvas}>Save</button>
                <button onClick={loadCanvas}>Load</button>
                <button onClick={clearCanvas}>Clear</button>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                />
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                    border: '1px solid black',
                    marginTop: '20px',
                }}
            />
        </div>
    );
};

export default Whiteboard;
