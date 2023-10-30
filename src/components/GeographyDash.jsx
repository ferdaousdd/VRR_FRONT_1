
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Alert,
  TextField,
  useTheme,
  Unstable_Grid2 as Grid
} from '@mui/material';
import React, { useEffect , useState , useCallback,useRef} from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { get } from 'ol/proj.js';
import 'ol/ol.css';
import { fromLonLat} from 'ol/proj'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { tokens } from "../theme";
import { GiTeePipe } from 'react-icons/gi';
import { Toast } from 'primereact/toast';
import LineString  from 'ol/geom/LineString';
import {  Style , Icon , Stroke} from 'ol/style';
import { MdMemory } from 'react-icons/md';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Dropdown } from 'primereact/dropdown';
// import { useLinestringMutation } from '../services/userAuthApi';
import { SpeedDial } from 'primereact/speeddial';
function GeographyDash() {

  // const [longitude1, setLongitude1] = useState('');
  // const [latitude1, setLatitude1] = useState('');
  // const [longitude2, setLongitude2] = useState('');
  // const [latitude2, setLatitude2] = useState('');


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [points, setPoints] = useState([]);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [PipeDialog, setPipetDialog] = useState(false);
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [clickedCoordinate, setClickedCoordinate] = useState('');
  const AddPipe = (product) => {
        setPipetDialog(true);
      };

  const [lines, setLines] = useState([]);
  const toast = useRef(null);
  const items = [
      {
          label: 'Add',
          icon: 'pi pi-pencil',
          command: () => {
            AddPipe();
          }
      },
      {
          label: 'Update',
          icon: 'pi pi-plus',
          command: () => {
            AddPipe();
          }
      },
      {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => {
            AddPipe();
              // toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
          }
      },
  
  ];

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



  




  // const [Linestring, { isLoading }] = useLinestringMutation()
  // const [server_error, setServerError] = useState({})


  useEffect(() => {
    const tunisiaCoord = fromLonLat([10.755864432602777, 34.83940902683895]);
    const raster = new TileLayer({
      source: new OSM(),
    });
    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33', // when you delete this safra titna7a
      },
    });
    
    // Add features to the vector source based on the points array
    points.forEach(point => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.longitude, point.latitude]))
      });
      feature.setStyle(new Style({
        image: new Icon({
          src: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          imgSize: [46, 46]
        })
      }));
      source.addFeature(feature);
    });
    
    lines.forEach(line => {
      const lineCoords = JSON.parse(line.path);
      const feature = new Feature({
        geometry: new LineString(lineCoords.map(coord => fromLonLat(coord))),
        style: new Style({
          stroke: new Stroke({
            color: 'red',
            width: 2
          })
        })
      });
      source.addFeature(feature);
    });
        // Limit multi-world panning to one wo rld east and west of the real world.
    // Geometry coordinates have to be within that range.
    const extent = get('EPSG:3857').getExtent().slice();
    extent[0] += extent[0];
    extent[2] += extent[2];
    const map = new Map({
      layers: [raster, vector],
      target: 'map',
      view: new View({
        center: tunisiaCoord,
        zoom: 16,
        extent,
      }),
    });
    
    // const modify = new Modify({ source: source });
    // map.addInteraction(modify);
    
    let draw, snap; // global so we can remove them later
    const typeSelect = document.getElementById('type');
    
    function addInteractions() {
      draw = new Draw({
        source: source,
        type: typeSelect.value,
      });
      
      
      draw.on('drawend', event => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        geometry.transform('EPSG:3857', 'EPSG:4326');
        const coords = geometry.getCoordinates();
        setLatitude(coords[1]);
        setLongitude(coords[0]);
        setClickedCoordinate(coords);
      });
    
      map.addInteraction(draw);
      snap = new Snap({ source: source });
      map.addInteraction(snap);
    }
    
    /**
     * Handle change event.
     */
  
    
    // Clean up on unmount
    return () => {
      map.setTarget(null);
      map.dispose();
    };
    
}, [points, lines]); // Only run once, on mount

  




//   function linestring() {
//     const actualData = {
//       name: 'daw',
//       path: formattedCoordinates,
//     };
//     console.log(actualData);

//     const res = Linestring({ actualData });

//     if (res.error) {
//       setServerError(res.error.data.errors);
// console.log('aaaaa ')
//     }
//     if (res.data) {
//        console.log(res)
//       console.log('success');

//     }
//   }


    return (
      <>

      <div className="map">
    
    
      
      <div id="map" style={{ width: '100%', height: '400px' }} ></div>

  

    </div>

    </>
  );
}

 export default GeographyDash;


