import { useState, useRef } from "react";
import Layout from "../components/layout";
import { useWeb3AuthContext } from "../contexts/Web3AuthContext";
import { 
  Box, 
  Button, 
  VStack, 
  Text, 
  Flex, 
  Input, 
  useToast, 
  Image,
  IconButton,
  Progress,
  AspectRatio,
  Tooltip,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Textarea
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, AttachmentIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { FaFolderOpen, FaUpload, FaTags, FaEthereum, FaDatabase, FaImage, FaPlus } from 'react-icons/fa';


import { CONTRACT_ABI, CONTRACT_ADDRESS, USDC_ABI, USDC_CONTRACT_ADDRESS } from "../constants"

const API_BASE_URL = 'https://lablr-htbqdxhmdyc3cafz.westeurope-01.azurewebsites.net/';

export default function PublishDatasetPage() {
  const { web3, address, isConnected, isWeb3AuthReady } = useWeb3AuthContext();
  const [files, setFiles] = useState<File[]>([]);
  const [labelOptions, setLabelOptions] = useState<string[]>(['', '']);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [price, setPrice] = useState<string>('10.00');
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const handleDirectorySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("webkitdirectory", "");
      fileInputRef.current.click();
    }
  };

  const handleLabelOptionChange = (index: number, value: string) => {
    const newLabelOptions = [...labelOptions];
    newLabelOptions[index] = value;
    setLabelOptions(newLabelOptions);
  };

  const addLabelOption = () => {
    setLabelOptions([...labelOptions, '']);
  };

  const removeLabelOption = (index: number) => {
    if (labelOptions.length > 2) {
      const newLabelOptions = labelOptions.filter((_, i) => i !== index);
      setLabelOptions(newLabelOptions);
    }
  };

  const handleSubmit = async () => {

    // DEMO
    toast({
      title: "Error",
      description: "This is a demo. Publishing datasets is disabled.",
      status: "error",
      duration: 3000,
      isClosable: true,
      icon: <WarningIcon />
    });
    return;

    /*
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "You must be connected to publish datasets.",
        status: "error",
        duration: 3000,
        isClosable: true,
        icon: <WarningIcon />
      });
      return;
    }
    if (files.length === 0 || !datasetName || !datasetDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select at least one file for your dataset.",
        status: "error",
        duration: 3000,
        isClosable: true,
        icon: <WarningIcon />
      });
      return;
    }
    if (labelOptions.some(option => option.trim() === '')) {
      toast({
        title: "Error",
        description: "Please fill in all label options.",
        status: "error",
        duration: 3000,
        isClosable: true,
        icon: <WarningIcon />
      });
      return;
    }
    try {
      const bodypay = JSON.stringify({
        label_options: labelOptions,
        owner_id: address,
        name: datasetName,
        description: datasetDescription
      });
      // Step 1: Add dataset
      const datasetResponse = await fetch(`${API_BASE_URL}/logic/add_dataset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodypay,
      });

      if (!datasetResponse.ok) {
        throw new Error('Failed to create dataset');
      }
      const datasetData = await datasetResponse.json();
      console.log(datasetData);
      const datasetId = datasetData.dataset_id;
      // Step 1.5: Contract interaction
      // Step 1.5.1: Approve USDC transfer
      if (web3) {
        const usdcContract = new web3.eth.Contract(USDC_ABI, USDC_CONTRACT_ADDRESS);
        const priceInWei = BigInt(Number(price) * 1e6).toString();
        const approveResponse = await usdcContract.methods.approve(CONTRACT_ADDRESS, priceInWei).send({ from: address });

        if (!approveResponse.status) {
          throw new Error('Failed to approve USDC transfer');
        }

        // Step 1.5.2: Create dataset bounty
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        const bountyResponse = await contract.methods.createDatasetBounty(datasetId, priceInWei).send({ from: address });

        if (!bountyResponse.status) {
          throw new Error('Failed to create dataset bounty');
        }


      } else {
        throw new Error('Web3 not initialized');
      }

      // Step 2: Upload data
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(`${API_BASE_URL}/logic/upload_data?dataset_id=${datasetId}`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload file ${i + 1}`);
        }

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      toast({
        title: "Success",
        description: "Your dataset has been published.",
        status: "success",
        duration: 3000,
        isClosable: true,
        icon: <CheckIcon />
      });

      // Reset form
      setFiles([]);
      setPreviewUrls([]);
      setLabelOptions(['', '']);
      setUploadProgress(0);
      setPrice('0.00');
      setDatasetName('');
      setDatasetDescription('');

    } catch (error) {
      console.error('Error publishing dataset:', error);
      toast({
        title: "Error",
        description: "Failed to publish dataset. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        icon: <WarningIcon />
      });
    }
    */
  };

  if (!isWeb3AuthReady || !isConnected) {
    return (
      <Layout>
        <Box minHeight="100vh" bg="#f5f1e8" color="black" pt="70px">
          <Text>Please connect your wallet to publish datasets.</Text>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box minHeight="100vh" bg="#f5f1e8" color="black" pt="70px">
        <Box maxWidth="500px" margin="auto" width="100%" p={4}>
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="xl" textAlign="center" color="black">
              <FaDatabase /> Publish Dataset
            </Heading>
            
            <Input
              placeholder="Dataset Name"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              variant="filled"
              bg="white"
              _hover={{ bg: "#ffd598" }}
              _focus={{ bg: "#ffd598", borderColor: "black" }}
            />

            <Textarea
              placeholder="Dataset Description"
              value={datasetDescription}
              onChange={(e) => setDatasetDescription(e.target.value)}
              variant="filled"
              bg="white"
              _hover={{ bg: "#ffd598" }}
              _focus={{ bg: "#ffd598", borderColor: "black" }}
            />

            <Box>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-input"
                ref={fileInputRef}
              />
              <Flex>
                <Tooltip label="Select individual files" placement="top">
                  <Button 
                    as="label"
                    htmlFor="file-input"
                    flex={1}
                    variant="outline"
                    leftIcon={<AttachmentIcon />}
                    borderColor="black"
                    color="black"
                    _hover={{ bg: "#ffd598" }}
                  >
                    Select Files
                  </Button>
                </Tooltip>
                <Tooltip label="Select an entire directory" placement="top">
                  <Button 
                    onClick={handleDirectorySelect}
                    ml={2}
                    variant="outline"
                    leftIcon={<FaFolderOpen />}
                    borderColor="black"
                    color="black"
                    _hover={{ bg: "#ffd598" }}
                  >
                    Select Directory
                  </Button>
                </Tooltip>
              </Flex>
            </Box>

            {files.length > 0 && (
              <Flex align="center" justify="center">
                <Text fontSize="sm" color="black">
                  <FaImage /> {files.length} file{files.length > 1 ? 's' : ''} selected
                </Text>
              </Flex>
            )}

            {previewUrls.length > 0 && (
              <AspectRatio ratio={16/9} width="100%" maxHeight="60vh">
                <Box 
                  borderRadius="md"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="black"
                >
                  {previewUrls.map((url, index) => (
                    <Image 
                      key={index}
                      src={url}
                      alt={`Preview ${index}`}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                      position="absolute"
                      top={0}
                      left={0}
                      opacity={index === 0 ? 1 : 0}
                      transition="opacity 0.3s ease-in-out"
                    />
                  ))}
                </Box>
              </AspectRatio>
            )}

            <VStack spacing={4}>
              <Flex align="center" width="full">
                <FaTags color="black" />
                <Text ml={2} fontWeight="bold" color="black">Label Options</Text>
              </Flex>
              {labelOptions.map((option, index) => (
                <Flex key={index} width="full">
                  <Input
                    placeholder={`Label option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleLabelOptionChange(index, e.target.value)}
                    mr={2}
                    variant="filled"
                    bg="white"
                    color="black"
                    _hover={{ bg: "#ffd598" }}
                    _focus={{ bg: "#ffd598", borderColor: "black" }}
                  />
                  {index >= 2 && (
                    <IconButton
                      aria-label="Remove label option"
                      icon={<CloseIcon />}
                      onClick={() => removeLabelOption(index)}
                      size="sm"
                      variant="ghost"
                      color="black"
                      _hover={{ bg: "#ffd598" }}
                    />
                  )}
                </Flex>
              ))}
              <Button 
                leftIcon={<FaPlus />} 
                onClick={addLabelOption} 
                size="sm"
                variant="ghost"
                color="black"
                _hover={{ bg: "#ffd598" }}
              >
                Add Label Option
              </Button>
            </VStack>

            <Divider borderColor="black" />

            <Flex align="center" width="full">
              <FaEthereum color="black" />
              <Text ml={2} fontWeight="bold" color="black">Set Bounty (USDC)</Text>
            </Flex>
            <NumberInput 
              value={price} 
              onChange={(valueString) => setPrice(valueString)}
              min={10} 
              precision={2} 
              step={0.01}
            >
              <NumberInputField bg="white" border="1px solid black" color="black" _focus={{ borderColor: "black" }} />
              <NumberInputStepper>
                <NumberIncrementStepper borderColor="black" color="black" />
                <NumberDecrementStepper borderColor="black" color="black" />
              </NumberInputStepper>
            </NumberInput>

            <Button 
              onClick={handleSubmit}
              variant="outline"
              isLoading={uploadProgress > 0 && uploadProgress < 100}
              loadingText="Uploading..."
              leftIcon={<FaUpload />}
              size="lg"
              borderColor="black"
              color="black"
              bg="#ffd598"
              _hover={{ bg: "#f5f1e8" }}
            >
              Publish Dataset
            </Button>

            {uploadProgress > 0 && (
              <Progress 
                value={uploadProgress} 
                size="sm" 
                colorScheme="orange" 
                borderRadius="full"
                bg="white"
              />
            )}
          </VStack>
        </Box>
      </Box>
    </Layout>
  );
}
