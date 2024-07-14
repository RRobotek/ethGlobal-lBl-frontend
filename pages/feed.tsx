import React, { useState, useCallback, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { Box, Button, VStack, Text, Flex, useToast, Spinner, Icon } from "@chakra-ui/react";
import { FaTag } from "react-icons/fa";
import Layout from "../components/layout";
import { useWeb3AuthContext } from '../contexts/Web3AuthContext';

const BUFFER_SIZE = 5;
const API_BASE_URL = 'https://goldfish-app-jyk4z.ondigitalocean.app/ethglobal-lbl-backend2';

interface Post {
  data_id: string;
  url: string;
  label_options: string[];
}

export default function FeedPage() {
  const { web3, address, isConnected } = useWeb3AuthContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(0);
  const toast = useToast();

  const fetchPosts = useCallback(async () => {
    console.log("Fetching posts...");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/logic/get_feed/${BUFFER_SIZE}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newPosts: Post[] = await response.json();
      console.log("Fetched posts:", newPosts);
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching posts",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const goToNextPost = useCallback(() => {
    if (currentIndex < posts.length - 1) {
      setSwipeDirection(-1);
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setSwipeDirection(0);
      }, 300);
    }
  }, [currentIndex, posts.length]);

  const goToPreviousPost = useCallback(() => {
    if (currentIndex > 0) {
      setSwipeDirection(1);
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex - 1);
        setSwipeDirection(0);
      }, 300);
    }
  }, [currentIndex]);

  const handlers = useSwipeable({
    onSwipedUp: goToNextPost,
    onSwipedDown: goToPreviousPost,
    trackMouse: true
  });

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (currentIndex >= posts.length - 5 && !isLoading) {
      console.log("Buffer low, fetching more posts");   
      fetchPosts();
    }
  }, [currentIndex, posts.length, isLoading, fetchPosts]);

  const handleLabelClick = async (label: string) => {
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "You must be connected to label posts.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const currentPost = posts[currentIndex];
    const labelData = {
      data_id: currentPost.data_id,
      label: label,
      user_id: address // Use the wallet address as the user ID
    };

    try {
      console.log('Submitting label:', labelData);
      const response = await fetch(`${API_BASE_URL}/logic/label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(labelData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit label');
      }

      const result = await response.json();
      console.log('Label submitted successfully:', result);
      goToNextPost();
    } catch (error) {
      console.error('Error submitting label:', error);
      toast({
        title: "Error",
        description: "Failed to submit label. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderPost = (post: Post, index: number) => (
    <Box
      key={index}
      position="absolute"
      top={0}
      left={0}
      right={0}
      height="100%"
      transform={`translateY(${(index - currentIndex + swipeDirection) * 100}%)`}
      transition="transform 0.3s ease-out"
      overflow="hidden"
      bg="#f5f1e8"
    >
      {/* Blurred background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundImage={`data:image/png;base64,${post.url}`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="blur(20px)"
        transform="scale(1.1)"
        opacity={0.5}
      />
      {/* Main image */}
      <Flex 
        height="100%" 
        width="100%" 
        justifyContent="center" 
        alignItems="center" 
        position="relative"
      >
        <img 
          src={`data:image/png;base64,${post.url}`}
          alt={`Feed item ${index}`} 
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            border: '2px solid black',
            borderRadius: '8px',
          }}
        />
      </Flex>
      <Box 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0} 
        p={4} 
        bg="rgba(245, 241, 232, 0.8)"
      >
        <Flex wrap="wrap" justify="center">
          {post.label_options && post.label_options.length > 0 ? (
            post.label_options.map((label, labelIndex) => (
              <Button
                key={labelIndex}
                onClick={() => handleLabelClick(label)}
                m={1}
                size="lg"
                variant="outline"
                color="black"
                borderColor="black"
                bg="#ffd598"
                _hover={{ bg: "#f5f1e8" }}
              >
                {label}
              </Button>
            ))
          ) : (
            <Text>No labels available</Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
  return (
    <Layout>
      <Box height="100vh" overflow="hidden" position="relative" {...handlers} bg="#f5f1e8">
        {posts.length > 0 ? (
          <>
            {posts.map((post, index) => renderPost(post, index))}
          </>
        ) : (
          <Flex 
            justify="center" 
            align="center" 
            height="100%" 
            bg="#f5f1e8"
            color="black"
          >
            <VStack spacing={6}>
              <Icon as={FaTag} boxSize={12} color="#ffd598" />
              <Spinner size="xl" color="#ffd598" />
              <Text fontSize="2xl" fontWeight="bold">
                Loading Feed
              </Text>
              <Text fontSize="md" color="gray.600" textAlign="center">
                We're gathering the latest posts for you.
                <br />
                This won't take long!
              </Text>
            </VStack>
          </Flex>
        )}
      </Box>
    </Layout>
  );
}
