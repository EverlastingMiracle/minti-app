import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { InputLabel, Input, IconButton, Button } from '@material-ui/core';
import calculatePath from '../helpers/calculatePath';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
        marginRight: '1rem'
    },
}));



const filterVertices = (vertices) => vertices.filter(vertex => vertex && vertex.weight && vertex.finish && vertex.start)

export default () => {
    const classes = useStyles();
    const emptyVertex = {
        start: null,
        finish: null,
        weight: null,
    }
    const [startVertex, setStartVertex] = useState(null);
    const [finishVertex, setFinishVertex] = useState(null);
    const [vertices, setVertices] = useState([emptyVertex]);
    const [distance, setDistance] = useState(null);
    const [path, setPath] = useState([]);
    



    const resetResult = () => {
        setDistance(null);
        setPath([]);
    }

    const addNewVertex = () => {
        resetResult();
        setVertices([
            ...vertices,
            emptyVertex
        ])
    }

    const getVertexName = (name) => {
        if (startVertex === name) {
            return 'start';
        }
        if (finishVertex === name) {
            return 'finish';
        }
        return name;
    }

    const updateVertexStart = (index, event) => {
        resetResult();
        const newVertices = [...vertices];
        newVertices[index].start = event.target.value;
        setVertices(newVertices);

    }

    const updateVertexFinish = (index, event) => {
        resetResult();
        const newVertices = [...vertices];
        newVertices[index].finish = event.target.value;
        setVertices(newVertices);

    }

    const updateVertexWeight = (index, event) => {
        resetResult();
        const newVertices = [...vertices];
        newVertices[index].weight = event.target.value;
        setVertices(newVertices);

    }

    const removeVertex = (index) => {
        resetResult();
        const newVertices = vertices.map((vertex, key) => key !== index ? vertex : null);
        setVertices(newVertices);
    }

    const handleCalculateClick = () => {
        const filteredVertices = filterVertices(vertices);
        let result = {
            [getVertexName(startVertex)]: {},
            [getVertexName(finishVertex)]: {}
        };

        filteredVertices.forEach(vertex => {
            const name = getVertexName(vertex.start);
            const finishName = getVertexName(vertex.finish);
            if (!result[name]) {
                result[name] = {}
            }
            result[name][finishName] = +vertex.weight;
        })

        const calculatedPath = calculatePath(result);

        setDistance(calculatedPath.distance);
        setPath(calculatedPath.path);
    }

    const handleStartVertexChange = (event) => {
        resetResult();
        setPath([]);
        setStartVertex(event.target.value);
    }

    const handleFinishVertexChange = event => {
        resetResult();
        setPath([]);
        setFinishVertex(event.target.value);
    }
    const hasRequiredVertices = startVertex && finishVertex;
    const disableCalculationButton = !hasRequiredVertices || filterVertices(vertices).length < 1;
    const formattedPath = path.map(item => item === 'start' ? startVertex : item === 'finish' ? finishVertex : item)


    const resetAll = () => {
        resetResult();
        setPath([]);
        setStartVertex("")
        setFinishVertex("")     
        setVertices([
            emptyVertex
        ])
        document. getElementById("1").value = ""
        document. getElementById("2").value = ""
        document. getElementById("3").value = ""
    }


    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop:'3rem'}}>
            <div style={{ width: '60%', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="pointName">Початкова точка</InputLabel>
                        <Input aria-describedby="my-helper-text" value={startVertex} onChange={handleStartVertexChange} />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="pointName">Кінцева точка</InputLabel>
                        <Input aria-describedby="my-helper-text" value={finishVertex} onChange={handleFinishVertexChange}/>
                    </FormControl>
                </div>
                {vertices.map((vertex, index) => vertex && (
                    <div key={`${index}`} style={{ marginBottom: '1rem' }}>
                        <FormControl className={classes.formControl} >
                            <InputLabel>Вхідна вершина</InputLabel>
                            <Input id= "1" aria-describedby="my-helper-text"  onChange={event => updateVertexStart(index, event)} />
                        </FormControl>
                        <FormControl className={classes.formControl} >
                            <InputLabel>Вихідна вершина</InputLabel>
                            <Input  id= "2" aria-describedby="my-helper-text"  onChange={event => updateVertexFinish(index, event)} />
                        </FormControl>
                        <FormControl className={classes.formControl} >
                            <InputLabel>Обмеження</InputLabel>
                            <Input
                                type="number"
                                id = "3"
                                inputProps={{ min: 0 }}
                                onChange={event => updateVertexWeight(index, event)}
                            />
                        </FormControl>
                        {vertices.length - 1 === index ? (
                            <IconButton size="medium" onClick={addNewVertex} disabled={!vertex.start || !vertex.finish || !vertex.weight}>
                                <AddCircleIcon fontSize="inherit" />
                            </IconButton>
                        ) : (
                            <IconButton size="medium" onClick={() => removeVertex(index)}>
                                <RemoveCircleOutlineIcon fontSize="inherit" />
                            </IconButton>
                        )}
                    </div>
                ))}
                <div style ={{marginTop: '2rem', display:'flex', flexDirection:'row', gap: '2rem'}}>
                    <Button
                    variant="contained"
                    color='111111'
                    disabled={disableCalculationButton}
                    onClick={handleCalculateClick}
                >
                    Розрахувати
                </Button>
                <Button
                    variant="contained"
                    color='111111'
                    onClick={resetAll}
                >
                    Очистити
                </Button>
                </div>
               
                <div style={{ marginTop: '2rem' }}>
                    {path.length > 0 && (
                       <>
                           <InputLabel>Найкоротший шлях - {distance} ({formattedPath.join(' - ')})</InputLabel>
                       </>
                    )}
                </div>
            </div>
        </div>
    )
}
