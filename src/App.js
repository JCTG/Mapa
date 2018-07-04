import React, { Component } from 'react';
import './App.css';
import ol from 'openlayers';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import Globe from '@boundlessgeo/sdk/components/Globe';
import HomeButton from '@boundlessgeo/sdk/components/HomeButton';
import Geolocation from '@boundlessgeo/sdk/components/Geolocation';
import Header from '@boundlessgeo/sdk/components/Header';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Rotate from '@boundlessgeo/sdk/components/Rotate';
import AddLayerModal from '@boundlessgeo/sdk/components/AddLayerModal';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import Measure from '@boundlessgeo/sdk/components/Measure';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
///// my Components
import MapaAppBar from './components/MapaAppBar';
import MapaAddLayersModal from './components/MapaAddLayersModal';
import MapaLayersControl from './components/MapaLayersControl';
///// my Components
import injectTapEventPlugin from 'react-tap-event-plugin';
import { injectIntl, intlShape } from 'react-intl';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var map = new ol.Map({
  layers: [
    new ol.layer.Group({
      type: 'base-group',
      title: 'Base Maps',
      layers: [
        new ol.layer.Tile({
          type: 'base',
          title: 'OSM Streets',
          source: new ol.source.OSM()
        })
      ]
    })
  ],
  controls: [new ol.control.Attribution({ collapsible: false }), new ol.control.ScaleLine()],
  view: new ol.View({
    projection: "EPSG:4326",
    center: [-101.9563, 23.6257],
    zoom: 6
  })
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layerModalOpen: false
    };
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme(CustomTheme)
    };
  }

  openAddLayerModal(value){
    this.setState({
      layerModalOpen: true
    });
}
  closeAddLayerModal(value) {
    this.setState({
      layerModalOpen: false
    });
  }

  render() {
    return (
      <div>
        <MapaAddLayersModal mapa={map} isOpen={this.state.layerModalOpen} closeModal={this.closeAddLayerModal.bind(this)}/>
        {/* <AddLayerModal map={map} allowCreate={false} allowUpload={false} open={this.state.layerModalOpen} onRequestClose={this.closeAddLayerModal.bind(this)} sources={[{ url: 'https://geo.datos.gob.mx/geoserver/wms', type: 'WMS', title: 'Datos MX QA' }]} /> */}
        <div>
          {/* <MapaAppBar mapa={map}/> */}
          <div className="App">
            <MapPanel map={map} />
            <LoadingPanel map={map} />
            <div id='left-control-buttons'>
              <div id='control-button'><FloatingActionButton mini={true} onClick={this.openAddLayerModal.bind(this)}><ContentAdd /></FloatingActionButton></div>
              <div id='control-button'><LayerList minWidth={500} showZoomTo={true} allowRemove={true} allowEditing={true} allowFiltering={true} showOpacity={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div>
            </div>
            <div id='layers-control'><MapaLayersControl mapa={map}/></div>
            <div id='right-control-buttons'>
              {/* <div id='control-button'><Globe map={map} /></div> */}
              <div id='control-button'><Geolocation map={map} /></div>
              <div id='control-button'><HomeButton map={map} /></div>
              <div id='control-button'><Zoom map={map} /></div>
              <div id='control-button'><Rotate map={map} /></div>
              <div id='control-button'> <FloatingActionButton mini={true}><Navigation style={{ 'left': -4, 'top': -2}} toggleGroup='navigation' secondary={true} /></FloatingActionButton></div>
              <div id='control-button'><FloatingActionButton mini={true}><Measure style={{ 'left': -4, 'top': -2 }} toggleGroup='navigation' map={map} /></FloatingActionButton></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  /**
   * i18n message strings. Provided through the application through context.
   */
  intl: intlShape.isRequired
};

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

App = injectIntl(App);

export default App;
