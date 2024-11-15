import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

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
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
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
        {location ? (
          <MapView
            style={styles.map}
            region={location}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="¡Estás aquí!"
              description="Tu ubicación actual"
            />
          </MapView>
        ) : (
          <Text style={styles.loadingText}>{errorMsg || 'Cargando ubicación...'}</Text>
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
