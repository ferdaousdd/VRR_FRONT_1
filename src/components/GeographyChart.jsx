import React, { useEffect , useState , useCallback , useRef } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Draw, Modify,Select,Delete, Snap } from 'ol/interaction.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { get } from 'ol/proj.js';
import 'ol/ol.css';
import { InputNumber } from 'primereact/inputnumber';
import { fromLonLat , transform , toLonLat} from 'ol/proj'
import Feature from 'ol/Feature';
import { useTheme } from '@mui/material';
import { Toast } from "primereact/toast";
import InputGroup from 'react-bootstrap/InputGroup';
import { tokens } from '../theme';
import Point from 'ol/geom/Point';
import LineString  from 'ol/geom/LineString';
import {  Style  , Stroke} from 'ol/style';
import { Card } from 'react-bootstrap';
import { Form, Row, Col, ToggleButtonGroup,Button, ToggleButton, FormSelect,FormLabel  } from 'react-bootstrap';
import { MultiLineString } from 'ol/geom';
import { InputText } from 'primereact/inputtext';
import Overlay from 'ol/Overlay.js';
import { toStringXY } from 'ol/coordinate.js';
import {toStringHDMS} from 'ol/coordinate.js';


function GeographyChart() {

const popupRef = useRef(null);
const closerRef = useRef(null);

  const [selectedPoint, setSelectedPoint] = useState();
  const [popupOverlay, setPopupOverlay] = useState(null);

  const handlePointChange = (event) => {
    setSelectedPoint(event.target.value);
    console.log(event.target.value)

  };
  const [value, setValue] = useState('');

  const handleValueChange = (event) => {
    console.log(event.target.value);
    setValue(event.target.value);
  };
  const [valuess, setValuess] = useState('');

  const handleLineChange = (event) => {
    console.log(event.target.value);
    setValuess(event.target.value);
  };

  const [segments, setSegments] = useState([]);
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const toast = useRef(null);
  const [points, setPoints] = useState([]);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [clickedCoordinate, setClickedCoordinate] = useState();
  const [lines, setLines] = useState([]);
  const [selectedGeometry, setSelectedGeometry] = useState("Point");
  const [selectedInteraction, setSelectedInteraction] = useState("draw");
  const [zone, setzone] = useState(0);

  const handlezoneChange = (e) => {
    console.log(e.target.value);
    setzone(e.target.value);
  };

  const handleGeometryChange = (event) => {
    setSelectedGeometry(event.target.value);
  };
  const handleInteractionChange = (value) => {
    setSelectedInteraction(value);
  };


  useEffect(() => {
    setSelectedInteraction("draw");
  }, [selectedGeometry]);  


useEffect(() => {
   const container = popupRef.current;
   const content = container.querySelector('#popup-content');
   const closer = closerRef.current;
     const overlay = new Overlay({
       element: container,
       autoPan: {
         animation: {
           duration: 250,
         },
       },
     });
     closer.addEventListener('click', function () {
       overlay.setPosition(undefined);
       closer.blur();
       return false;
     });


    function  updateFeatureCoordinates  (id,newCoords,value) {
    console.log(value)
    console.log('long:', newCoords[0]);
    console.log('latit:', newCoords[1]);
    // Make an API call to update the feature on the server
    fetch(`http://127.0.0.1:8000/api/user/points/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name : value,
        longitude: newCoords[0],
        latitude:newCoords[1],
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update feature with ID ${id}`);
      }
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Noeuds updated",
        life: 2000,
      });
      console.log(`Updated feature with ID ${id}`);
    })
    .catch(error => console.error(error));
    }
    
    function deleteSelectedSegment(id) {
      fetch(`http://127.0.0.1:8000/api/user/segments/${id}/`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete segment with ID ${id}`);
        }
        console.log(`Deleted segment with ID ${id}`);
        const selectedFeature = Exampledelete.select.getFeatures().getArray()[0];
        const source = vector.getSource();
        source.removeFeature(selectedFeature); // remove the feature from the source
        source.changed();

        const deletedSegment = segments.find(segment => segment.id === id);

        setSegments(segments.filter(segment => segment.id !== id));
        // setLines(lines.filter(line => line.id !== segments.linestring));
        segments.forEach((segment) => {
          setLines(lines.filter(line => line.id !==segment.linestring));
          setSegments(segments.filter(segment => segment.linestring !== deletedSegment.linestring));

        });

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Segment deleted",
          life: 2000,
        });
      })
      .catch(error => console.error(error));
    }
   
    function deleteSelectedPoint(id) {
      fetch(`http://127.0.0.1:8000/api/user/points/${id}/`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete feature with ID ${id}`);
        }
        console.log(`Deleted feature with ID ${id}`);
        const selectedFeature = Exampledelete.select.getFeatures().getArray()[0];
        const source = vector.getSource();
        source.removeFeature(selectedFeature); // remove the feature from the source
        source.changed();
        setPoints(points.filter(point => point.id !== id))
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Noeuds Deleted",
          life: 2000,
        });
        // notify the map that the source has changed
      })
      .catch(error => console.error(error));
    }
    function deleteSelectedLine(id) {
      fetch(`http://127.0.0.1:8000/api/user/line_delete/${id}/`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete feature with ID ${id}`);
        }
        console.log(`Deleted feature with ID ${id}`);
        const selectedFeature = Exampledelete.select.getFeatures().getArray()[0];
        const source = vector.getSource();
        source.removeFeature(selectedFeature); // remove the feature from the source
        source.changed();
        setLines(lines.filter(lines => lines.id !== id));
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "pipes Deleted",
          life: 2000,
        });
        // notify the map that the source has changed
      })
      .catch(error => console.error(error));
    }

    const tunisiaCoord = fromLonLat([10.755864432602777, 34.83940902683895]);
    const raster = new TileLayer({
      source: new OSM(),
    });
    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33', // when you delete this safra titna7a
      },
    });

    // Add features to the vector source based on the points array
    console.log(points)
    points.forEach(point => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.longitude, point.latitude])),
        id: point.id // set the id of the feature
      });
      // feature.setStyle(new Style({
      //   image: new Icon({
      //     src: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      //     anchor: [0.5, 46],
      //     anchorXUnits: 'fraction',
      //     anchorYUnits: 'pixels',
      //     imgSize: [46, 46]
      //   })
      // }));
      source.addFeature(feature);
    });
    
    lines.forEach(line => {
      let lineCoords;
      try {
        lineCoords = JSON.parse(line.path);
      } catch (error) {
        lineCoords = null;
      }
      if (lineCoords) {
        const feature = new Feature({
          geometry: new LineString(lineCoords.map(coord => fromLonLat(coord))),
          id: line.id // set the id of the feature
        });
        feature.setStyle(new Style({
          stroke: new Stroke({
            color: 'black',
            width: 5,
          })
        }));
        source.addFeature(feature);
      }
    });
    // Add the segments to the vector source
    
function getMiddlePoint(coordinates) {
  const start = coordinates[0];
  const end = coordinates[1];
  const middlePointLon = (start[0] + end[0]) / 2;
  const middlePointLat = (start[1] + end[1]) / 2;
  return fromLonLat([middlePointLon, middlePointLat]);
}
// Add the segments to the vector source
// segments.forEach((segment) => {
//   const coordinates = [
//     fromLonLat([segment.start_longitude, segment.start_latitude]),
//     fromLonLat([segment.end_longitude, segment.end_latitude]),
//   ];
//   const feature = new Feature({
//     geometry: new LineString(coordinates),
//     id: segment.id // set the id of the feature
//   });

//   const temperature = segment.temperature;
// console.log(temperature)
//   // Create a popup with the temperature

  
//   const segmentName = segment.name;

//   if (segmentName === 'zone2') {
//     feature.setStyle(
//       new Style({
//         stroke: new Stroke({
//           color: 'red', // Change the color here as desired
//           width: 5,

//         }),
//       })
//     );

    
//   }
//   source.addFeature(feature);
// });
// segments.forEach((segment) => {
//   const start = fromLonLat([segment.start_longitude, segment.start_latitude]);
//   const end = fromLonLat([segment.end_longitude, segment.end_latitude]);
//   // Calculate the perpendicular line at the start point
//   const startPerpendicular = calculatePerpendicular(start, end, 10);
//   const startCoordinates = [
//     startPerpendicular[0],
//     start,
//     startPerpendicular[1],
//   ];
//   const startLineString = new LineString(startCoordinates);
//   const startFeature = new Feature(startLineString);
//   source.addFeature(startFeature);
//   // Calculate the perpendicular line at the end point
//   const endPerpendicular = calculatePerpendicular(end, start, 10);
//   const endCoordinates = [
//     endPerpendicular[0],
//     end,
//     endPerpendicular[1],
//   ];
//   const endLineString = new LineString(endCoordinates);
//   const endFeature = new Feature(endLineString);
//   source.addFeature(endFeature);
//   // Check if the segment has specific coordinates and name to change its color


  
// });
segments.forEach((segment) => {
  const coordinates = [
    fromLonLat([segment.start_longitude, segment.start_latitude]),
    fromLonLat([segment.end_longitude, segment.end_latitude]),
  ];
  const feature = new Feature({
    geometry: new LineString(coordinates),
    id: segment.id // set the id of the feature
  });
    const temperature = segment.temperature;
console.log(temperature)
  if (segment.fuite) {
    feature.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'red', // Set color to red if fuite is true
          width: 5,
        }),
      })
    );
  } 
  source.addFeature(feature);
   });
   segments.forEach((segment) => {
  const start = fromLonLat([segment.start_longitude, segment.start_latitude]);
  const end = fromLonLat([segment.end_longitude, segment.end_latitude]);
  // Calculate the perpendicular line at the start point
  const startPerpendicular = calculatePerpendicular(start, end, 10);
  const startCoordinates = [
    startPerpendicular[0],
    start,
    startPerpendicular[1],
  ];
  const startLineString = new LineString(startCoordinates);
  const startFeature = new Feature(startLineString);
  source.addFeature(startFeature);
  // Calculate the perpendicular line at the end point
  const endPerpendicular = calculatePerpendicular(end, start, 10);
  const endCoordinates = [
    endPerpendicular[0],
    end,
    endPerpendicular[1],
  ];
  const endLineString = new LineString(endCoordinates);
  const endFeature = new Feature(endLineString);
  source.addFeature(endFeature);
  // Check if the segment has specific coordinates and name to change its color


  
   });




    const extent = get('EPSG:3857').getExtent().slice();
    extent[0] += extent[0];
    extent[2] += extent[2];
    const map = new Map({
      layers: [raster, vector],
      target: 'map',
      overlays: [overlay],
      view: new View({
        center: tunisiaCoord,
        zoom: 16.5,
        extent,
      }),
    });
    const Exampledelete = {
      init: function () {
        this.select = new Select();
        map.addInteraction(this.select);
        this.setEvents();
      },
      setEvents: function () {
        const selectedFeatures = this.select.getFeatures();
        this.select.on('select', function (event) {
          const selectedFeature = event.selected[0];
          const geometry = selectedFeature.getGeometry();
          const id = selectedFeature.getId() || selectedFeature.get('id'); // try to get the id from the id property
          if (id !== undefined) {
            console.log('Selected feature ID:', id);
          }
          const type = optionsForm.elements['draw-type'].value;
          console.log(type)
          if (type === 'Point' && geometry.getType() === 'Point') {
            const coords = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
            deleteSelectedPoint(id)
            console.log('Selected point coordinates:', coords);
          } else if (type === 'LineString' && geometry.getType() === 'LineString') {
            const coords = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
            console.log('Selected line string coordinates:', coords);
            deleteSelectedLine(id)
            deleteSelectedSegment(id)

          }
        });
        this.select.on('change:active', function () {
          selectedFeatures.clear();
        });
      },

        setActive: function (active) {
        this.select.setActive(active);


      },
    };  
    Exampledelete.init();




    const ExampleModify = {
      init: function () {
        this.select = new Select();
        map.addInteraction(this.select);
    
        this.modify = new Modify({
          features: this.select.getFeatures(),
        });
    
        // Add a callback to the modifyend event
        this.modify.on('modifyend', (event) => {
          const features = event.features;
          features.forEach((feature) => {
            const geometry = feature.getGeometry();
            const id = feature.getId() || feature.get('id'); // try to get the id from the id property
            if (id !== undefined) {
              console.log('Modified feature ID:', id);
            }

            if (geometry.getType() === 'Point') {
              const coords = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
              updateFeatureCoordinates(id,coords,value);              console.log('Modified point coordinates:', coords);
            } else if (geometry.getType() === 'LineString') {
              const coords = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
              // updateLineStringCoordinates(id,coords)
              console.log('Modified line string coordinates:', coords);
            }
          });
        });
        map.addInteraction(this.modify);
        this.setEvents();
      },
      setEvents: function () {
        const selectedFeatures = this.select.getFeatures();
    
        this.select.on('select', function (event) {
          const selectedFeature = event.selected[0];
          const geometry = selectedFeature.getGeometry();
          const id = selectedFeature.getId() || selectedFeature.get('id'); // try to get the id from the id property
          if (id !== undefined) {
            console.log('Selected feature ID:', id);
          }

          if (geometry.getType() === 'Point') {
            const selectedpoint = points.find(point => point.id === id);
            setValue(selectedpoint.name)

            const coords = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
            setLatitude(coords[1]);
            setLongitude(coords[0]);
            console.log('Selected point coordinates:', coords);
          } else if (geometry.getType() === 'LineString') {
            const coords = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
            console.log('Selected line string coordinates:', coords);
          }
        });
    
        this.select.on('change:active', function () {
          selectedFeatures.clear();
        });
      },
        setActive: function (active) {
        this.select.setActive(active);
        this.modify.setActive(active);
      },
    };  
    ExampleModify.init();
    
    const optionsForm = document.getElementById('options-form');
    const ExampleDraw = {
      init: function () {
        map.addInteraction(this.Point);
        this.Point.setActive(false);
        this.Point.on('drawend', this.handleDrawEnd);
        map.addInteraction(this.LineString);
        this.LineString.setActive(false);
        this.LineString.on('drawend', this.handleDrawEnd);
      },
      Point: new Draw({
        source: vector.getSource(),
        type: 'Point',
      }),
      LineString: new Draw({
        source: vector.getSource(),
        type: 'LineString',
      }),
    
      activeDraw: null,
      setActive: function (active) {
        if (this.activeDraw) {
          this.activeDraw.setActive(false);
          this.activeDraw = null;
        }
        if (active) {
          const type = optionsForm.elements['draw-type'].value;
          this.activeDraw = this[type];
          this.activeDraw.setActive(true);
        }
      },
    
      handleDrawEnd: function (event) {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        if (geometry.getType() === 'Point') {
          const coords = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
          setLatitude(coords[1]);
          setLongitude(coords[0]);
          console.log('Point coordinates:', coords);
          map.removeInteraction(ExampleDraw.Point); 

        } else if (geometry.getType() === 'LineString') {
          const coords = geometry.getCoordinates().map(coord => transform(coord, 'EPSG:3857', 'EPSG:4326'));
          setClickedCoordinate(coords);
          console.log('LineString coordinates:', coords);
          map.removeInteraction(ExampleDraw.LineString); 

        }
      },

    };  

    ExampleDraw.init();

    optionsForm.onchange = function (e) {
      const type = e.target.getAttribute('name');
      if (type == 'draw-type') {
        ExampleModify.setActive(false);
        Exampledelete.setActive(false);
        ExampleDraw.setActive(true);


        optionsForm.elements['interaction'].value = 'draw';
      } else if (type == 'interaction') {
        const interactionType = e.target.value;
        if (interactionType == 'modify') {
          ExampleDraw.setActive(false);
          ExampleModify.setActive(true);
          Exampledelete.setActive(false);

        } else if (interactionType == 'draw') {
          ExampleDraw.setActive(true);
          ExampleModify.setActive(false);
          Exampledelete.setActive(false);

        } else if (interactionType == 'delete') {
          ExampleDraw.setActive(false);
          ExampleModify.setActive(false);
          Exampledelete.setActive(true);
        }
      }
    }; 
    ExampleDraw.setActive(false);
    ExampleModify.setActive(false);
    Exampledelete.setActive(false);

    const snap = new Snap({
      source: vector.getSource(),
    });
    map.addInteraction(snap);
    const select = new Select();
    map.addInteraction(select);
    setSelectedInteraction(null);



     map.on('singleclick', function (evt) {
       const coordinate = evt.coordinate;
       console.log(coordinate)
       const coords = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
       const hdms = toStringHDMS(toLonLat(coordinate));
       content.innerHTML = '<p style={{ color: "black" }} >You clicked here:</p><code>' + coords + '</code>';
       overlay.setPosition(coordinate);
     });



    return () => {
      map.setTarget(null);
      map.dispose();
    };
}, [points,lines,segments]); 



useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/linestrings/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setLines(data);

    } catch (error) {
      console.log(error);
    }

  }
  fetchUserData();
  console.log(lines)
}, []);

function calculatePerpendicular(pointA, pointB, length) {
  const dx = pointB[0] - pointA[0];
  const dy = pointB[1] - pointA[1];
  const perpendicular = [-dy, dx];
  const magnitude = Math.sqrt(perpendicular[0] * perpendicular[0] + perpendicular[1] * perpendicular[1]);
  const normalized = [perpendicular[0] / magnitude, perpendicular[1] / magnitude];
  const startPerpendicular = [pointA[0] + normalized[0] * length, pointA[1] + normalized[1] * length];
  const endPerpendicular = [pointA[0] - normalized[0] * length, pointA[1] - normalized[1] * length];
  return [startPerpendicular, endPerpendicular];
}


const handleSubmit1 = useCallback(async ( clickedCoordinate ,zone,selectedPoint ,valuess, event ) => {
  event.preventDefault();


  const formattedCoordinates = JSON.stringify(clickedCoordinate );
  const actualData = {
    name:valuess,
    zone:zone,
    path: formattedCoordinates,
    points: selectedPoint,
  };
console.log(actualData)
  try {
    const response = await fetch('http://127.0.0.1:8000/api/user/linestrings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( actualData )
    });
    const data = await response.json();

    setLines(prevLines => {
      const newLines = [...prevLines, data];
 
      setClickedCoordinate()
      if(response.ok){
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Pipes created",
          life: 2000,
        });
      }
      fetch('http://127.0.0.1:8000/api/user/segment/')
    .then((response) => response.json())
    .then((data) => setSegments(data))
    .catch((error) => console.error(error));

      return newLines;
      
  
    
    }); 
   } 
  
   
   catch (error) {
    console.error(error); 
  }
}, [lines , segments]);



useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/points/');
      const data = await response.json();
      setPoints(data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();

}, []);




const handleSubmit = useCallback(async ( name , event ) => {
  event.preventDefault();
  try {
    const response = await fetch('http://127.0.0.1:8000/api/user/points/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ longitude, latitude , name  })
    });

    console.log(response)
    const data = await response.json();
    setPoints([...points, data]);
    console.log(points)
    setLongitude('');
    setLatitude('');
    setValue('')
    if(response.ok){
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Noeuds created",
        life: 2000,
      });


    }

  } catch (error) {
    console.error(error);
  }

}, [longitude, latitude, points]);



useEffect(() => {
  // Fetch the segment data from the backend API
  fetch('http://127.0.0.1:8000/api/user/segment/')
    .then((response) => response.json())
    .then((data) => setSegments(data))
    .catch((error) => console.error(error));
}, []);



    return (
<>

  <Row className="align-items-center">
  <Col xs={12} sm={12} md={10} lg={10}>

  <Form id="options-form" autoComplete="off">
  <Row className="align-items-center">
    <Col xs={12} sm={12} md={6} lg={6}>

      <FormLabel style={{ color: colors.greenAccent[400] }} value={selectedGeometry} onChange={handleGeometryChange} >Geometry:</FormLabel>
      <FormSelect value={selectedGeometry} onChange={handleGeometryChange} name="draw-type" style={{width:'250px'}} id="draw-type">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
      </FormSelect>
    </Col>

    <Col xs={12} sm={12} md={6} lg={6}>
      <FormLabel style={{ color: colors.greenAccent[400] }}>Action:</FormLabel>
      <br/>
      <ToggleButtonGroup type="radio" onChange={handleInteractionChange} value={selectedInteraction} name="interaction" defaultValue="draw">
        <ToggleButton id="draw" value="draw">Draw</ToggleButton>
        <ToggleButton id="modify" value="modify">Modify</ToggleButton>
        <ToggleButton id="delete" value="delete">Delete</ToggleButton>
      </ToggleButtonGroup>
    </Col>
    
  </Row>
  </Form>
  </Col>


  

    <Col xs={6}  md={2} lg={2}>
        {selectedGeometry == "Point" && selectedInteraction === "draw" && (

      <>
                    <FormLabel style={{ color: colors.greenAccent[400] }}>Add Noeuds:</FormLabel>
        
            <form onSubmit={(event) => handleSubmit(value,event)}>              <Button variant="primary" type="submit">
              Save
              </Button>
            </form>


      </>
        )}

        
        {selectedGeometry == "LineString" && selectedInteraction === "draw" && (

      <>
            <FormLabel style={{ color: colors.greenAccent[400] }}>Add Pipes:</FormLabel>
            
            <form onSubmit={(event) => handleSubmit1( clickedCoordinate ,zone,selectedPoint ,valuess, event)}>
              <Button variant="primary" style={{width:'140px' }}  type="submit">
              Save
              </Button>
            </form>
      </>
        )}
      </Col>
      </Row>
    
  <Row className="align-items-center">
  <Col xs={12} sm={12} md={10} lg={10}>
  <Row className="align-items-center">

      
    
      {selectedGeometry == "LineString" && selectedInteraction === "draw" && (
    
<>

      <>
      <Col xs={6}  md={2} lg={3}>
  
  {/* <FormLabel style={{ color: colors.greenAccent[400] }}>Line Name:</FormLabel> */}

{/* <InputText
id="numberInput"
defaultValue={valuess} // Pass the value as the defaultValue prop
onChange={handleLineChange}
/>  */}
<FormLabel style={{ color: colors.greenAccent[400] }}>Line Name:</FormLabel>
      <Form.Group>
          <Form.Control
          defaultValue={valuess}
            required
            id="numberInput"
            onChange={handleLineChange}
            type="text"
          
          />
        </Form.Group>
</Col>
      </>

        <>
        <Col xs={6}  md={2} lg={3}>
  
  <FormLabel style={{ color: colors.greenAccent[400] }}>Nombre de zone:</FormLabel>
  {/* <InputNumber
id="numberInput"
maxLength={2}
defaultValue={zone} // Pass the value as the defaultValue prop
onChange={handlezoneChange}
/> */}

<Form.Group>
<Form.Control
  id="numberInput"
  maxLength={2}
  defaultValue={zone} // Pass the value as the defaultValue prop
  onChange={handlezoneChange}
/>
        </Form.Group>

</Col>
    </> 

    <>
    <Col xs={6}  md={2} lg={3}>
    <Form.Group>
      <FormLabel style={{ color: colors.greenAccent[400] }}>Select Point:</FormLabel>
        <Form.Select value={selectedPoint} onChange={handlePointChange}>
          <option value="">Select a point</option>
          {points.map((point) => (
            <option key={point.id} value={point.id}>
              {point.name}
            </option>
          ))}
        </Form.Select>
  
    </Form.Group>
    </Col>
    </> 

</>

      )}


{selectedGeometry == "Point" && selectedInteraction === "draw" && (
    
    <>
    
          <>
    <Col xs={6}  md={2} lg={3}>
      <FormLabel style={{ color: colors.greenAccent[400] }}>Point Name:</FormLabel>
      <Form.Group>
          <Form.Control
            required
            id="numberInput"
            defaultValue={value}
            onChange={handleValueChange}
            type="text"
          />
        </Form.Group>

    {/* <InputText
    id="numberInput"
    defaultValue={value}
     // Pass the value as the defaultValue prop
    onChange={handleValueChange}
    />  */}
    </Col>
          </>
    
    </>
    
          )}
  
    </Row>

    </Col>

  </Row>




      <div>
    

         <div id="map" style={{ width: '100%', height: '400px' }} ></div>

      </div>
             <div id="popup" className="ol-popup" ref={popupRef}>
         <a href="#" id="popup-closer" className="ol-popup-closer" ref={closerRef}></a>

         <div id="popup-content"></div>
       </div>
      <Toast ref={toast} />
</>
      

  
    
  );
}

export default GeographyChart;