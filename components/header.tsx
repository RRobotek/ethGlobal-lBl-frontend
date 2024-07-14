'use client';
import { useEffect } from "react";
import Link from "next/link";
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack, Text } from "@chakra-ui/react";
import { HamburgerIcon, AddIcon, ViewIcon, InfoIcon } from '@chakra-ui/icons';

import { useWeb3AuthContext } from "../contexts/Web3AuthContext";

const bgColor = "#f5f1e8";
const textColor = "black";
const accentColor = "#ffd598";
const hoverBgColor = "#ffd598";

export default function Header() {
  const { web3, address, isConnected, login, logout, isWeb3AuthReady } = useWeb3AuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    console.log("Web3Auth ready:", isWeb3AuthReady);
    console.log("Connected:", isConnected);
    console.log("Address:", address);
  }, [isWeb3AuthReady, isConnected, address]);

  const NavItem = ({ href, icon, children }) => (
    <Button 
      as={Link} 
      href={href} 
      variant="ghost" 
      justifyContent="flex-start" 
      width="100%" 
      leftIcon={icon}
      color={textColor}
      _hover={{ bg: hoverBgColor }}
    >
      {children}
    </Button>
  );

  const NavContent = () => (
    <>
      <NavItem href="/feed" icon={<ViewIcon />}>Feed</NavItem>
      <NavItem href="/profile" icon={<InfoIcon />}>Profile</NavItem>
      <NavItem href="/publish" icon={<AddIcon />}>Publish</NavItem>
      <NavItem href="/overview" icon={<ViewIcon />}>Overview</NavItem>
    </>
  );

  return (
    <Box as="header" bg={bgColor} py={2} position="fixed" top={0} left={0} right={0} zIndex={1000} boxShadow="0 2px 4px rgba(0,0,0,0.1)">
      <Flex maxW="container.xl" mx="auto" px={4} justifyContent="space-between" alignItems="center">
        <Text color={textColor} fontWeight="bold">
          {isConnected && address ? 
            `Address: ${address.slice(0, 6)}...${address.slice(-4)}` : 
            "Not connected"
          }
        </Text>
        <Flex alignItems="center">
          {!isWeb3AuthReady ? (
            <Text>Initializing...</Text>
          ) : !isConnected ? (
            <Button
              bg={accentColor}
              color={textColor}
              size="sm"
              onClick={login}
              _hover={{ bg: hoverBgColor }}
            >
              Connect Wallet
            </Button>
          ) : (
            <Flex alignItems="center">
              <Avatar size="sm" name={address} />
              <Button 
                ml={2} 
                size="sm" 
                variant="ghost" 
                onClick={logout} 
                color={textColor}
                _hover={{ bg: hoverBgColor }}
              >
                Disconnect
              </Button>
            </Flex>
          )}
        </Flex>
        
        <Box as="nav">
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            onClick={onOpen}
            aria-label="Open Menu"
            display={{ base: "flex", md: "none" }}
            color={textColor}
            _hover={{ bg: hoverBgColor }}
          />
          <Box display={{ base: "none", md: "block" }}>
            <Menu>
              <MenuButton 
                as={Button} 
                variant="ghost" 
                rightIcon={<HamburgerIcon />} 
                color={textColor}
                _hover={{ bg: hoverBgColor }}
              >
                Menu
              </MenuButton>
              <MenuList bg={bgColor} borderColor={textColor}>
                <NavContent />
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bgColor} color={textColor}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={textColor}>Navigation</DrawerHeader>
          <DrawerBody>
            <VStack spacing={2} align="stretch">
              <NavContent />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}