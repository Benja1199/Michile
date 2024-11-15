import React, { useState, useEffect } from 'react';
import { Platform, View, TextInput, Button, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración de íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LocationPicker() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation(); // Inicializar useNavigation

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso para acceder a la ubicación fue denegado');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const handleSearch = () => {
    // Lógica de búsqueda aquí si es necesario
    navigation.navigate('Ciudad'); // Navega a la pestaña "Ciudad"
  };

  return (
    <View style={styles.container}>
      {/* Sección de buscador y botón */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Escriba una Ciudad" style={styles.input} />
        <Button title="Buscar" onPress={handleSearch} />
      </View>

      {/* Sección del mapa */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          location ? (
            <MapContainer center={[location.coords.latitude, location.coords.longitude]} zoom={13} style={styles.map}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[location.coords.latitude, location.coords.longitude]}>
                <Popup>¡Estás aquí!</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <Text style={styles.loadingText}>{errorMsg || 'Cargando ubicación...'}</Text>
          )
        ) : (
          <Text>Funcionalidad para móviles no implementada en este ejemplo.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
