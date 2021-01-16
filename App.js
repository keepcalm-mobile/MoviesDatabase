import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Text, Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-snap-carousel";
import Modal from "react-native-modal";
import MenuDrawer from "react-native-side-drawer";

export default function App() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [movie, setMovie] = useState({});
  const [main, setMain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const items = [
    { name: "In Cinemas", id: "now_playing" },
    { name: "Popular Movies", id: "popular" },
    { name: "Top Rated", id: "top_rated" },
    { name: "Upcoming", id: "upcoming" },
  ];

  const ref = useRef(null);

  const getData = (id) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=1db0e9aed7a2340cc05fcc5af6843322&language=uk-UA&page=1&region=UA`
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json.results);
      });
  };

  useEffect(() => {
    setWidth(Math.round(Dimensions.get("window").width));
    setHeight(Math.round(Dimensions.get("window").height));
  }, []);

  const handlePress = (item) => {
    setMovie(item);
    setModal(!modal);
  };

  const handleDetails = (id) => {
    getData(id);
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
      setMain(!main);
    }, 1000);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.9}>
        <Image
          style={{
            alignSelf: "center",
            height: "95%",
            width: "90%",
            borderRadius: 8,
            marginTop: 10,
          }}
          source={{
            uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: height * 0.09,
          backgroundColor: "coral",
          flexDirection: "row",
        }}
      >
        <Icon
          type="material"
          name="menu"
          color="white"
          size={40}
          containerStyle={{ alignSelf: "center", margin: 5 }}
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "white",
            alignSelf: "center",
            marginLeft: 35,
          }}
        >
          Movies Database
        </Text>
      </View>
      <StatusBar backgroundColor="tomato" />
      <Modal animationIn="fadeIn" animationOut="fadeOut" isVisible={loading}>
        <ActivityIndicator size="large" color="coral" />
      </Modal>
      <Modal
        animationIn="zoomIn"
        animationOut="zoomOut"
        isVisible={modal}
        hasBackdrop={false}
        style={{ margin: 0 }}
        onBackButtonPress={() => setModal(!modal)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: 5,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <Image
              style={{
                height: height * 0.5,
                width: width - 10,
                borderRadius: 10,
              }}
              source={{
                uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
              }}
            />
            <Text h2>{movie.title}</Text>
            <Text h4>{movie.overview}</Text>
          </ScrollView>
        </View>
      </Modal>
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={main}
        hasBackdrop={false}
        style={{ margin: 0, marginTop: height * 0.09 }}
        onBackButtonPress={() => setMain(!main)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Carousel
              layout="default"
              data={data}
              ref={ref}
              renderItem={renderItem}
              sliderWidth={width}
              itemWidth={width}
            />
          </View>
        </View>
      </Modal>
      <FlatList
        data={items}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => handleDetails(item.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#ff512f", "#dd2476"]}
                style={{
                  height: height * 0.3,
                  width: width - 20,
                  borderRadius: 15,
                  margin: 10,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 25,
                  }}
                >
                  {item.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
