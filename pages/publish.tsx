import { useState } from "react";
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
  IconButton
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

export default function PublishPage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [labelOptions, setLabelOptions] = useState<string[]>(['', '']);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const toast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
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
        description: "You must be logged in to publish posts.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one file to upload.",
        status: "error",
        duration: 3000,
        isClosable: true,
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
      });
      return;
    }

    // Placeholder for actual implementation
    console.log('Files to upload:', files);
    console.log('Label options:', labelOptions);

    toast({
      title: "Success",
      description: "Your post has been published.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setFiles([]);
    setPreviewUrls([]);
    setLabelOptions(['', '']);
  };

  return (
    <Layout>
      <Box minHeight="100vh" bg="gray.900" color="white" p={4}>
        <VStack spacing={6} align="stretch" maxWidth="600px" margin="auto">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">Publish New Post</Text>
          
          <Box>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button 
                as="span" 
                width="full"
                bg="blue.600"
                _hover={{ bg: "blue.700" }}
              >
                Select Files
              </Button>
            </label>
          </Box>

          {previewUrls.length > 0 && (
            <Flex wrap="wrap" justify="center" gap={2}>
              {previewUrls.map((url, index) => (
                <Image 
                  key={index}
                  src={url}
                  alt={`Preview ${index}`}
                  boxSize="100px"
                  objectFit="cover"
                />
              ))}
            </Flex>
          )}

          <VStack spacing={2}>
            {labelOptions.map((option, index) => (
              <Flex key={index} width="full">
                <Input
                  placeholder={`Label option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleLabelOptionChange(index, e.target.value)}
                  mr={2}
                  bg="gray.700"
                  border="none"
                  _focus={{ bg: "gray.600" }}
                />
                {index >= 2 && (
                  <IconButton
                    aria-label="Remove label option"
                    icon={<CloseIcon />}
                    onClick={() => removeLabelOption(index)}
                    size="sm"
                    bg="red.600"
                    _hover={{ bg: "red.700" }}
                  />
                )}
              </Flex>
            ))}
            <Button 
              leftIcon={<AddIcon />} 
              onClick={addLabelOption} 
              size="sm"
              bg="gray.700"
              _hover={{ bg: "gray.600" }}
            >
              Add Label Option
            </Button>
          </VStack>

          <Button 
            onClick={handleSubmit}
            bg="green.600"
            _hover={{ bg: "green.700" }}
          >
            Publish
          </Button>
        </VStack>
      </Box>
    </Layout>
  );
}