import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Layout from "../components/layout";
import { 
  Box, 
  Flex, 
  Text, 
  VStack, 
  Spinner, 
  Icon, 
  SimpleGrid, 
  Card, 
  CardBody, 
  CardFooter, 
  Button, 
  Heading, 
  Stack,
  Badge,
  useToast
} from "@chakra-ui/react";
import { FaDatabase, FaTag, FaUserAlt, FaCalendarAlt, FaStopCircle } from "react-icons/fa";

import { ViewIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

const API_BASE_URL = 'https://goldfish-app-jyk4z.ondigitalocean.app/ethglobal-lbl-backend2';

interface Dataset {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  label_options: string[];
  data_count: number;
  labeled_count: number;
}

export default function MyDatasetsPage() {
  const { data: session } = useSession();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (session?.user?.name) {
      fetchDatasets();
    }
    
  }, [session?.user.name]);

    const fetchDatasets = async () => {
      console.log("fetch datasets")
    try {
      const response = await fetch(`${API_BASE_URL}/logic/get_datasets_for_user/${session?.user?.name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch datasets');
      }

      const data = await response.json();
      console.log(data);
      setDatasets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your datasets. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleEndLabeling = (datasetId: string) => {
    console.log(`End labeling process for dataset: ${datasetId}`);
    // TODO: Implement the actual end labeling functionality
  };

  if (loading) {
    return (
      <Layout>
        <Flex 
          justify="center" 
          align="center" 
          height="100vh" 
          bg="gray.900"
          color="white"
        >
          <VStack spacing={6}>
            <Icon as={FaDatabase} boxSize={12} color="blue.400" />
            <Spinner size="xl" color="blue.400" />
            <Text fontSize="2xl" fontWeight="bold">
              Loading Your Datasets
            </Text>
            <Text fontSize="md" color="gray.400" textAlign="center">
              We're retrieving your uploaded datasets.
              <br />
              This won't take long!
            </Text>
          </VStack>
        </Flex>
      </Layout>
    );
  }

  return (
     <Layout>
      <Box minHeight="100vh" bg="gray.900" color="white" pt="70px" px={4}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            {/* <Icon as={} mr={2} /> */}
            My Datasets
          </Heading>

          {datasets.length === 0 ? (
            <Flex justify="center" align="center" height="50vh">
              <Text fontSize="xl" color="gray.400">
                You haven't uploaded any datasets yet.
              </Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {datasets.map((dataset) => (
                <Card key={dataset.dataset_id} bg="gray.800" borderRadius="lg">
                  <CardBody>
                    <Stack spacing={1}>
                      <img src={`data:image/png;base64, ${dataset.thumbnail}`} alt={`${dataset.name} thumbnail`} />
                      <Heading size="md" color="blue.400">{dataset.name}</Heading>
                      <Text color={"red"}>{dataset.description}</Text>
                      <Flex align="center">
                        {/* <Icon as={StarIcon} mr={2} /> */}
                        <Text fontSize="sm" color={"red"}>Label Options: {dataset.label_options.join(', ')}</Text>
                      </Flex>
                      
                      <Flex align="center">
                        <Icon as={CheckCircleIcon} mr={2} />
                        <Text color={"red"} fontSize="sm">Confidence: {Math.round(dataset.accuracy * 100)}% </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Labels Received: {dataset.labels_received}</Badge>
                      </Flex>
                    </Stack>
                  </CardBody>
                  <CardFooter>
                    <Button 
                      leftIcon={<FaStopCircle />} 
                      colorScheme="red" 
                      onClick={() => handleEndLabeling(dataset.dataset_id)}
                      width="100%"
                    >
                      End Labeling
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Box>
    </Layout>
  );
}