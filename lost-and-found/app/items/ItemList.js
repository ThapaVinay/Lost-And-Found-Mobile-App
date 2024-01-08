import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { ArrowLeftIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { useNavigation, useRoute } from "@react-navigation/native";

import no_image from "./no-image.png";

import { useGlobalSearchParams, useRouter } from "expo-router";

const host = "https://lost-and-found.cyclic.app";

var { width, height } = Dimensions.get("window");

export default function ItemList() {
  const params = useGlobalSearchParams();
  const category = params.category;
  const navigation = useNavigation();
  const router = useRouter();
  const [items, setItems] = useState([]);

  const url = `${host}/getAllItems`;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        setItems(json);
        console.log(json);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [url]);

  const filteredItems = category
    ? items.filter((item) => item.subcategory === category)
    : items;

  const handleClick = (id) => {
    console.log(id);
    router.push(`/item-details/ItemDetails?id=${id}`);
  };

  const renderItem = ({ item }) => (
    <View style={{ paddingHorizontal: 20 }}>
      <ItemCard
        handleClick={handleClick}
        id={item?._id}
        itemImage={item?.itemImage}
      />
    </View>
  );

  return (
    <View
      style={{
        marginTop: 20,
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          left: 10,
          top: 40,
          position: "absolute",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <ChevronLeftIcon size="20" strokeWidth={3} color="black" />
          <Text>Back</Text>
        </View>
      </TouchableOpacity>

      <View
        style={{
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "DMMedium", fontSize: 20 }}>{category}</Text>
      </View>

      <View style={{ marginTop: 80 }}>
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item?._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const ItemCard = ({ id, itemImage, handleClick }) => {
  return (
    <TouchableOpacity onPress={() => handleClick(id)}>
      <Image
        source={
          itemImage ? { uri: `${host}/foundItemImages/${itemImage}` } : no_image
        }
        style={{
          width: width * 0.7,
          height: height * 0.4,
          borderRadius: 20,
        }}
      />
    </TouchableOpacity>
  );
};
