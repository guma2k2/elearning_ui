import React, { useEffect, useState } from 'react';
import {
    paintbrush,
    eraser,
    dustbin,
    square,
    triangle,
    circle,
    selecthand,
    text,
    downloadIcon,
    github,
} from '../Icons';
import { getFirestore, collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from '../../utils/firebase';
import { Canvas, Rect, Triangle, Textbox, Circle } from 'fabric';

let canvas: Canvas;

const colors = {
    blue: '#5DADE2',
    red: '#E74C3C',
    yellow: '#F1C40F',
    green: '#239B56',
    lightBlack: '#17202A',
    black: '#000',
    white: '#FFF'
};
function Toolbar() {
    const [brushSize, setBrushSize] = useState<number>(5);
    const [brushColor, setBrushColor] = useState<string>(colors.blue);
    const [eraserSize, setEraserSize] = useState<number>(10);
    const [strokeColor, setStrokeColor] = useState<string>(colors.black);
    const [JSONData, setJSONData] = useState<string>('');

    const ref = doc(collection(db, 'canvasData'), 'JSONData');

    useEffect(() => {
        canvas = new Canvas('canvas');
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = brushColor;
            canvas.setHeight(window.innerHeight - 100);
            canvas.setWidth(window.innerWidth - 50);
            canvas.freeDrawingBrush.width = brushSize;
        }

        canvas.on('mouse:up', async () => {
            const data = JSON.stringify(canvas);
            setJSONData(data);
            await setDoc(ref, { data });

            onSnapshot(ref, (snap) => {
                const JSONFirebase = snap.data()?.data;
                if (JSONFirebase) {
                    canvas.loadFromJSON(JSONFirebase, canvas.renderAll.bind(canvas));
                }
            });
        });
    }, []);

    useEffect(() => {
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = brushSize;
        }

    }, [brushSize]);

    useEffect(() => {
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = brushColor;

        }
    }, [brushColor]);

    useEffect(() => {
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = eraserSize;
        }
    }, [eraserSize]);

    useEffect(() => {
        saveData();
    }, [JSONData]);

    const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrushSize(Number(e.target.value));
    };

    const generateShape = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const elementClassName = e.currentTarget.classList;
        canvas.isDrawingMode = false;
        const strokeWidth = 2;

        if (elementClassName.contains('squareShape')) {
            const rect = new Rect({
                left: 100,
                top: 100,
                fill: 'transparent',
                width: 60,
                height: 60,
                angle: 90,
                stroke: strokeColor,
                strokeWidth,
            });
            canvas.add(rect);
        } else if (elementClassName.contains('triangleShape')) {
            const rect = new Triangle({
                left: 200,
                top: 150,
                fill: 'transparent',
                width: 60,
                height: 60,
                stroke: strokeColor,
                strokeWidth,
            });
            canvas.add(rect);
        } else if (elementClassName.contains('circleShape')) {
            const rect = new Circle({
                left: 100,
                top: 100,
                radius: 50,
                stroke: strokeColor,
                strokeWidth,
                fill: 'transparent',
            });
            canvas.add(rect);
        }
    };

    const deleteObjects = () => {
        const activeObjects = canvas.getActiveObjects();

        if (activeObjects.length === 0) {
            canvas.clear();
        } else {
            activeObjects.forEach((object) => canvas.remove(object));
        }
    };

    const addTextInput = () => {
        const textInput = new Textbox('Enter Text', {
            left: 100,
            top: 100,
            fontFamily: 'ubuntu',
            width: 30,
            height: 40,
        });
        canvas.add(textInput);
        canvas.isDrawingMode = false;
    };

    const saveData = async () => {
        const data = JSON.stringify(canvas);
        setJSONData(data);
        await setDoc(ref, { data });
        console.log('JSONData saved to Firestore');
    };

    const loadData = () => {
        onSnapshot(ref, (snap) => {
            const JSONFirebase = snap.data()?.data;
            if (JSONFirebase) {
                canvas.loadFromJSON(JSONFirebase, canvas.renderAll.bind(canvas));
            }
        });
    };
    const clearSaved = () => {
        // ref.update({ data: firebase.firestore.FieldValue.delete() });
        canvas.clear();
    };

    const download = () => {
        // const dataURL = canvas.toDataURL({ format: 'jpeg', quality: 0.9 });
        // const imageLink = document.createElement('a');
        // if (typeof imageLink.download === 'string') {
        //     imageLink.href = dataURL;
        //     imageLink.download = 'canvas.jpg';
        //     document.body.appendChild(imageLink);
        //     imageLink.click();
        //     document.body.removeChild(imageLink);
        // } else {
        //     window.open(dataURL);
        // }
    };
    return <div className='toolSection'>
        <div className='toolField'>
            <div className='brushWidth'>
                <div className='icon'>
                    <img
                        src={paintbrush}
                        alt='paintbrush-icon'
                        className='paintBrushIcon'
                        onClick={() => {
                            setBrushColor(colors.blue);
                            canvas.isDrawingMode = true;
                        }}
                    />
                </div>
                <input
                    type='range'
                    min='1'
                    max='50'
                    step='5'
                    value={brushSize}
                    className='slider'
                    onChange={handleBrushSizeChange}
                ></input>
            </div>

            <div className='colorsets'>
                <div
                    className='blue'
                    style={{ background: colors.blue }}
                    onClick={() => {
                        setBrushColor(colors.blue);
                        setStrokeColor(colors.blue);
                    }}
                ></div>
                <div
                    className='red '
                    style={{ background: colors.red }}
                    onClick={() => {
                        setBrushColor(colors.red);
                        setStrokeColor(colors.red);
                    }}
                ></div>
                <div
                    className='yellow '
                    style={{ background: colors.yellow }}
                    onClick={() => {
                        setBrushColor(colors.yellow);
                        setStrokeColor(colors.yellow);
                    }}
                ></div>
                <div
                    className='green '
                    style={{ background: colors.green }}
                    onClick={() => {
                        setBrushColor(colors.yellow);
                        setStrokeColor(colors.yellow);
                    }}
                ></div>
                <div
                    className='black '
                    style={{ background: colors.black }}
                    onClick={() => {
                        setBrushColor(colors.black);
                        setStrokeColor(colors.black);
                    }}
                ></div>
            </div>

            <div className='eraser'>
                <div className='icon eraserDesc'>
                    <img
                        src={eraser}
                        alt='eraser-icon'
                        className='eraserIcon'
                        onClick={(e) => {
                            setBrushColor(colors.white);
                        }}
                    />
                </div>
                <input
                    type='range'
                    min='1'
                    max='100'
                    step='10'
                    value={eraserSize}
                    className='slider'
                    onChange={(e) => setEraserSize(parseInt(e.target.value))}
                ></input>
            </div>

            <div className='deleteField'>
                <div className='icon' onClick={deleteObjects}>
                    <img src={dustbin} alt='delete-icon' className='deleteBtn' />
                </div>
            </div>

            <div className='selectionHand'>
                <div className='icon' onClick={() => (canvas.isDrawingMode = false)}>
                    <img src={selecthand} alt='select-icon' className='selecthandBtn' />
                </div>
            </div>

            <div className='textInput'>
                <div className='icon'>
                    <img
                        src={text}
                        alt='textInput-icon'
                        className='textInputBtn'
                        onClick={addTextInput}
                    />
                </div>
            </div>

            <div className='download'>
                <div className='icon'>
                    <img
                        src={downloadIcon}
                        alt='download-icon'
                        className='downloadBtn'
                        onClick={download}
                    />
                </div>
            </div>

            <div className='load icon' onClick={loadData}>
                Load
            </div>

            <div className='clearSaved icon' onClick={clearSaved}>
                Clear Saved
            </div>

            <div className='shapesMenuField'>
                <div className='icon square'>
                    <img
                        src={square}
                        alt='square-icon'
                        className='squareShape'
                        onClick={(e) => generateShape(e)}
                    />
                </div>
                <div className='icon'>
                    <img
                        src={triangle}
                        alt='triangle-icon'
                        className='triangleShape'
                        onClick={(e) => generateShape(e)}
                    />
                </div>
                <div className='icon'>
                    <img
                        src={circle}
                        alt='circle-icon'
                        className='circleShape'
                        onClick={(e) => generateShape(e)}
                    />
                </div>
            </div>

            <div className='github'>
                <a
                    href='https://github.com/RidhikGovind/Freehand'
                    target='_blank'
                    rel='noreferrer'
                >
                    <img src={github} alt='github-icon' className='githubIcon' />
                </a>
            </div>
        </div>
    </div>
}

export default Toolbar;