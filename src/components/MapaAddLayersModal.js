import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import './MapaAddLayersModal.css';
import ol from 'openlayers';
import LinearProgress from 'material-ui/LinearProgress';
import {GridList, GridTile} from 'material-ui/GridList';
import MapaSearchBar from './MapaSearchBar';
import MapaResourceItem from './MapaResourceItem';

class MapaAddLayersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadedLayers: false,
      errorSearch: null,
      layers: [],
      layersSelected: [],
      searchText: ''
    };
  }

  componentWillMount() {
    this.getBestLayers();
  }

  getBestLayers() {
    fetch(process.env.REACT_APP_API_URL + '/ckan-geoserver?organization.title!=INEGI')
    .then(res => res.json())
    .then((response) => {
      this.setState({isLoadedLayers: true, layers: response.results});
      this.props.thereIs();
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
      this.setState({isLoadedLayers: true});
      this.props.thereNo();
      this.props.thereError(error);
    });
  }

  setStyle(layer){
    let initialColor = '#00CC99';
    let initialStyle = new ol.style.Style();
    switch (layer.type) {
      case 'point':
        let initialPoint = new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({ color: initialColor }),
          stroke: new ol.style.Stroke({ color: '#000000', width: 1 })
        })
        initialStyle.setImage(initialPoint)
        break;
      case 'line':
        initialStyle.setStroke(new ol.style.Stroke({ color: initialColor, width: 1 }))
        break;
      default:
        initialStyle.setFill(new ol.style.Fill({ color: initialColor }))
        initialStyle.setStroke(new ol.style.Stroke({ color: '#000000', width: 1 }))
    }
    return initialStyle;
  }

  createLayer(layer) {
    let urlLayer = `${process.env.REACT_APP_GEOSERVER_URL}/ckan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ckan:${layer.geoserver}&outputFormat=application/json`;
    let newLayer = new ol.layer.Vector({
      title: layer.name_resource
        ? layer.name_resource
        : layer.geoserver,
      source: new ol.source.Vector({
        url: urlLayer,
        format: new ol.format.GeoJSON()
      }),
      layerType: layer.type,
      style: this.setStyle(layer),
    });
    return newLayer;
  }

  selectedLayer(layer) {
    let newLayer = this.createLayer(layer);
    this.props.mapa.addLayer(newLayer);
    this.props.closeModal();
    this.getBestLayers();
    this.props.layersOnMap();
  }

  changeText(event) {
    this.setState({searchText: event.target.value});
  }

  searchLayers() {
    this.getLayersSearch(this.state.searchText);
  }

  getLayersSearch(text) {
    fetch(process.env.REACT_APP_API_URL + '/ckan-geoserver?name_resource=/(' + text + ')/i').then(res => res.json()).then((response) => {
      this.setState({isLoadedLayers: true, layers: response.results, searchText: ''});
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
      this.setState({isLoadedLayers: true, errorSearch: error, searchText: ''});
    });
  }

  addLayers() {}

  render() {
    const { isLoadedLayers, layers} = this.state;
    if (!isLoadedLayers) {
      return < LinearProgress mode = "indeterminate" />;
    } else {
      return (<div>
        <Dialog title={<MapaSearchBar typing = {
            this.changeText.bind(this)
          }
          search = {
            this.searchLayers.bind(this)
          } />} open={this.props.isOpen} onRequestClose={this.props.closeModal} autoScrollBodyContent={true} contentStyle={{
            width: '80%',
            maxWidth: 'none'
          }}>
          <GridList cellHeight='auto' title='Capas Destacadas'>
            {
              layers.map(layer => (<GridTile key={layer._id}>
                <MapaResourceItem capa={layer} selected={this.selectedLayer.bind(this, layer)}></MapaResourceItem>
              </GridTile>))
            }
          </GridList>
        </Dialog>
      </div>);
    }
  }
}

export default MapaAddLayersModal;
