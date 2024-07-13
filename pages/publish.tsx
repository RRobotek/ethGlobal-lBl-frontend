import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/layout";
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
  Divider
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, AttachmentIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { FaFolderOpen, FaUpload, FaTags, FaEthereum, FaDatabase, FaImage, FaPlus } from 'react-icons/fa';

export default function PublishDatasetPage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [labelOptions, setLabelOptions] = useState<string[]>(['', '']);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [price, setPrice] = useState<string>('0.00');
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
    if (!session || !session.user) {
      toast({
        title: "Error",
        description: "You must be logged in to publish datasets.",
        status: "error",
        duration: 3000,
        isClosable: true,
        icon: <WarningIcon />
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one file for your dataset.",
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

    // Simulating upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('Files to upload:', files);
    console.log('Label options:', labelOptions);
    console.log('Price:', price);

    toast({
      title: "Success",
      description: "Your dataset has been published.",
      status: "success",
      duration: 3000,
      isClosable: true,
      icon: <CheckIcon />
    });

    setFiles([]);
    setPreviewUrls([]);
    setLabelOptions(['', '']);
    setUploadProgress(0);
    setPrice('0.00');
  };

  return (
    <Layout>
      <Box minHeight="100vh" bg="black" color="gray.300" pt="70px">
        <Box maxWidth="500px" margin="auto" width="100%" p={4}>
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="xl" textAlign="center" color="white">
              <FaDatabase /> Publish Dataset
            </Heading>
            
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
                  >
                    Select Directory
                  </Button>
                </Tooltip>
              </Flex>
            </Box>

            {files.length > 0 && (
              <Flex align="center" justify="center">
                <Text fontSize="sm">
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
                  borderColor="gray.700"
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
                <FaTags />
                <Text ml={2} fontWeight="bold">Label Options</Text>
              </Flex>
              {labelOptions.map((option, index) => (
                <Flex key={index} width="full">
                  <Input
                    placeholder={`Label option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleLabelOptionChange(index, e.target.value)}
                    mr={2}
                    variant="filled"
                    bg="gray.800"
                    _hover={{ bg: "gray.700" }}
                    _focus={{ bg: "gray.700", borderColor: "gray.600" }}
                  />
                  {index >= 2 && (
                    <IconButton
                      aria-label="Remove label option"
                      icon={<CloseIcon />}
                      onClick={() => removeLabelOption(index)}
                      size="sm"
                      variant="ghost"
                    />
                  )}
                </Flex>
              ))}
              <Button 
                leftIcon={<FaPlus />} 
                onClick={addLabelOption} 
                size="sm"
                variant="ghost"
              >
                Add Label Option
              </Button>
            </VStack>

            <Divider borderColor="gray.700" />

            <Flex align="center" width="full">
              <FaEthereum />
              <Text ml={2} fontWeight="bold">Set Price (ETH)</Text>
            </Flex>
            <NumberInput 
              value={price} 
              onChange={(valueString) => setPrice(valueString)}
              min={0} 
              precision={2} 
              step={0.01}
            >
              <NumberInputField bg="gray.800" border="none" _focus={{ borderColor: "gray.600" }} />
              <NumberInputStepper>
                <NumberIncrementStepper borderColor="gray.700" color="white" />
                <NumberDecrementStepper borderColor="gray.700" color="white" />
              </NumberInputStepper>
            </NumberInput>

            <Button 
              onClick={handleSubmit}
              variant="outline"
              isLoading={uploadProgress > 0 && uploadProgress < 100}
              loadingText="Uploading..."
              leftIcon={<FaUpload />}
              size="lg"
            >
              Publish Dataset
            </Button>

            {uploadProgress > 0 && (
              <Progress 
                value={uploadProgress} 
                size="sm" 
                colorScheme="blue" 
                borderRadius="full"
                bg="gray.800"
              />
            )}
          </VStack>
        </Box>
      </Box>
    </Layout>
  );
}