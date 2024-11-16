import { db } from '../../utils/firebase';
import React, { useEffect, useRef, useState } from 'react';
import {
    collection,
    addDoc,
    onSnapshot,
    getDocs,
    writeBatch,
    QueryDocumentSnapshot,
    DocumentData,
    deleteDoc,
    doc,
} from 'firebase/firestore';

type Point = {
    x: number;
    y: number;
    color: string;
    brushSize: number;
    isNewLine?: boolean; // Đánh dấu khi bắt đầu một nét vẽ mới
};

const Whiteboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState<string>('#000000');
    const [brushSize, setBrushSize] = useState<number>(5);

    const whiteboardCollection = collection(db, 'whiteboardData');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth - 50;
        canvas.height = window.innerHeight - 150;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctxRef.current = ctx;
        }
    }, []);

    // Đồng bộ hóa dữ liệu từ Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(whiteboardCollection, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const point = change.doc.data() as Point;
                    drawPoint(point);
                } else if (change.type === 'removed') {
                    clearCanvas();
                }
            });
        });

        return () => unsubscribe();
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        ctxRef.current?.beginPath();
        ctxRef.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);

        // Gửi điểm bắt đầu nét vẽ lên Firestore
        savePoint({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
            color,
            brushSize,
            isNewLine: true,
        });
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !ctxRef.current) return;

        const point: Point = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
            color,
            brushSize,
        };

        drawPoint(point);
        savePoint(point);
    };

    const stopDrawing = () => {
        ctxRef.current?.closePath();
        setIsDrawing(false);
    };

    const drawPoint = (point: Point) => {
        if (!ctxRef.current) return;

        if (point.isNewLine) {
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(point.x, point.y);
        } else {
            ctxRef.current.strokeStyle = point.color;
            ctxRef.current.lineWidth = point.brushSize;
            ctxRef.current.lineTo(point.x, point.y);
            ctxRef.current.stroke();
        }
    };

    const savePoint = async (point: Point) => {
        try {
            await addDoc(whiteboardCollection, point);
        } catch (error) {
            console.error('Error saving point:', error);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !ctxRef.current) return;

        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    };

    const clearFirestore = async () => {
        const snapshot = await getDocs(whiteboardCollection);
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
    };

    const handleClearCanvas = async () => {
        clearCanvas(); // Xóa canvas hiện tại
        await clearFirestore(); // Xóa dữ liệu trên Firestore
    };

    return (
        <div className="whiteboard-container">
            <div className="toolbar">
                <button onClick={handleClearCanvas}>Clear</button>
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
