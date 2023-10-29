"use client"

import {
  Box,
  Button,
  Center,
  Grid,
  Text
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

  const [imageGet, setImageGet] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string[]>([]);

  useEffect(() => {
    searchImageView();
  }, []); // ページが読み込まれた時に実行

  const searchImageView = async () => {
    try {
      const response = await axios.post("http://localhost:5000/search_favorite_viewer");
      const closetImages = response.data.imageList;
      setImageGet(closetImages);
    } catch (error) {
      console.error("Error fetching favorite images", error);
    }
  };

  const deleteImage = async (filename: string) => {
    try {
      await axios.post("http://localhost:5000/delete_search_save", {
        image: filename,
      });

      setDeleting((prevFavorites) => [...prevFavorites, filename]);

      // 画像を削除した後にページをリロード
      location.reload();

    } catch (error) {
      console.error("Failed to save favorite", error);
    }
  };

  


  return (
    <Box p={4}>
      <Box>
      {imageGet && imageGet.length > 0 ? (
          <Box mt={4} p={6}>
            <Center>
              <Text fontSize="xl" p={2}>お気に入りに追加したコーデ</Text>
            </Center>
          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
            {imageGet.map((imageFileName, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" position="relative" height={420} border="1px solid gray">
                <img
                  src={`http://localhost:5000/static/search_favorite_image/${imageFileName}?timestamp=${new Date().getTime()}`}
                  alt={`${index}`}
                  width={250}
                />
                {deleting.includes(imageFileName) ? (
                  <Text mt={2} color="green.500">
                    登録しました!!
                  </Text>
                ) : (
                  <Center>
                    <Button
                      mt={2}
                      colorScheme="blue"
                        onClick={() => deleteImage(imageFileName)}
                        position="absolute" bottom={4} left="50%" transform="translateX(-50%)"
                    >
                      登録解除
                    </Button>
                  </Center>
                )}
              </Box>
            ))}
          </Grid>
      </Box>
      ) : (
        <Text mt={4}>No search results available.</Text>
        )}
      </Box>
    </Box>
  );
}