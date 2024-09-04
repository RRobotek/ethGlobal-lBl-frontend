import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Layout from "../components/layout";
import { useWeb3AuthContext } from "../contexts/Web3AuthContext";
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
  useToast,
  Divider,
  Tooltip
} from "@chakra-ui/react";
import { FaDatabase, FaTag, FaUserAlt, FaCalendarAlt, FaStopCircle, FaImages, FaCheckCircle } from "react-icons/fa";
import { ViewIcon, CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';

import { CONTRACT_ADDRESS, CONTRACT_ABI, USDC_ABI, USDC_CONTRACT_ADDRESS } from '../constants';

const API_BASE_URL = 'https://lablr-htbqdxhmdyc3cafz.westeurope-01.azurewebsites.net/';

interface Dataset {
  dataset_id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  label_options: string[];
  data_count: number;
  labeled_count: number;
  thumbnail: string;
  accuracy: number;
  labels_received: number;
}

export default function MyDatasetsPage() {
  const { web3, address, isConnected, isWeb3AuthReady } = useWeb3AuthContext();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter()

  useEffect(() => {
    if (isWeb3AuthReady && isConnected && address) {
      fetchDatasets();
    } else if (isWeb3AuthReady && !isConnected) {
      toast({
        title: "Error",
        description: "You need to be connected to view your overview.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      router.push('/feed');
    }
  }, [isWeb3AuthReady, isConnected, address]);

  const fetchDatasets = async () => {
    console.log("fetch datasets")
    try {
      const response = await fetch(`${API_BASE_URL}/logic/get_datasets_for_user/${address}`, {
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

  const handleEndLabeling = async (datasetId: string) => {
    console.log(`End labeling process for dataset: ${datasetId}`);

    try {
      const response = await fetch(`${API_BASE_URL}/logic/endlabelling/${datasetId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error ending labeling:', error);
      toast({
        title: "Error",
        description: "Failed to end labeling process. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!isWeb3AuthReady || !isConnected) {
    return (
      <Layout>
        <Flex 
          justify="center" 
          align="center" 
          height="100vh" 
          bg="#f5f1e8"
          color="black"
        >
          <Text fontSize="xl">Please connect your wallet to view your datasets.</Text>
        </Flex>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Flex 
          justify="center" 
          align="center" 
          height="100vh" 
          bg="#f5f1e8"
          color="black"
        >
          <VStack spacing={6}>
            <Icon as={FaDatabase} boxSize={12} color="#ffd598" />
            <Spinner size="xl" color="#ffd598" />
            <Text fontSize="2xl" fontWeight="bold">
              Loading Your Datasets
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
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
      <Box minHeight="100vh" bg="#f5f1e8" color="black" pt="80px" px={6}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center" color="#333">
            <Icon as={FaDatabase} mr={3} color="#ffd598" />
            My Datasets
          </Heading>

          {datasets.length === 0 ? (
            <Flex justify="center" align="center" height="50vh" direction="column">
              <Icon as={FaImages} boxSize={16} color="#ffd598" mb={4} />
              <Text fontSize="xl" color="gray.600" textAlign="center">
                You haven't uploaded any datasets yet.
                <br />
                Start by adding your first dataset!
              </Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {datasets.map((dataset) => (
                <Card key={dataset.dataset_id} bg="white" borderRadius="lg" boxShadow="lg" overflow="hidden">
                  <CardBody>
                    <Stack spacing={4}>
                      <Box borderRadius="md" overflow="hidden" height="200px">
                        <img src={`data:image/png;base64, ${dataset.thumbnail}`} alt={`${dataset.name} thumbnail`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                      <Heading size="lg" color="#333" fontWeight="bold">{dataset.name}</Heading>
                      <Text color="gray.600" fontSize="md">{dataset.description}</Text>
                      <Divider />
                      <Flex align="center" justify="space-between">
                        <Flex align="center">
                          <Icon as={FaTag} mr={2} color="#ffd598" />
                          <Text fontSize="sm" fontWeight="medium">Label Options:</Text>
                        </Flex>
                        <Text fontSize="sm" color="gray.600">{dataset.label_options.join(', ')}</Text>
                      </Flex>
                      
                      <Flex align="center" justify="space-between">
                        <Flex align="center">
                          <Icon as={FaCheckCircle} mr={2} color="#4CAF50" />
                          <Text fontSize="sm" fontWeight="medium">Confidence:</Text>
                        </Flex>
                        <Text fontSize="sm" color="gray.600">{Math.round(dataset.accuracy * 100)}%</Text>
                      </Flex>
                      
                      <Flex align="center" justify="space-between">
                        <Flex align="center">
                          <Icon as={FaImages} mr={2} color="#2196F3" />
                          <Text fontSize="sm" fontWeight="medium">Labels Received:</Text>
                        </Flex>
                        <Badge colorScheme="green" fontSize="sm" px={2} py={1} borderRadius="full">
                          {dataset.labels_received}
                        </Badge>
                      </Flex>
                    </Stack>
                  </CardBody>
                  <CardFooter bg="gray.50" borderTop="1px" borderColor="gray.200">
                    <Tooltip label="End the labeling process for this dataset" hasArrow>
                      <Button 
                        leftIcon={<FaStopCircle />} 
                        colorScheme="red" 
                        onClick={() => handleEndLabeling(dataset.dataset_id)}
                        width="100%"
                        _hover={{ bg: "red.600" }}
                      >
                        End Labeling
                      </Button>
                    </Tooltip>
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
