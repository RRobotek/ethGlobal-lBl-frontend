import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack } from "@chakra-ui/react"
import { HamburgerIcon, AddIcon, ViewIcon, InfoIcon } from '@chakra-ui/icons'
import { useEffect } from 'react'

export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const bgColor = "#f5f1e8"
  const textColor = "black"
  const accentColor = "#ffd598"
  const hoverBgColor = "#ffd598"

  const API_BASE_URL = 'https://goldfish-app-jyk4z.ondigitalocean.app/ethglobal-lbl-backend2';


    useEffect(() => {
  if (session?.user?.name) {
    // You can use the accessToken to make authenticated requests to your FastAPI backend
    console.log("Access token:", session?.user?.name)
    console.log(API_BASE_URL)
    
    // Fetch to check if the user is in the database
    fetch(`${API_BASE_URL}/logic/checkUser/${session?.user?.name}`, {
      method: 'GET',

    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to check user');
      }
      return response.json();
    })
    .then(data => {
      console.log("User check result:", data);
      // You can handle the response here, e.g., set some state or show a notification
    })
    .catch(error => {
      console.error('Error checking user:', error);
    });
  }
}, [session])

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
  )

  const NavContent = () => (
    <>
      <NavItem href="/feed" icon={<ViewIcon />}>Feed</NavItem>
      <NavItem href="/profile" icon={<InfoIcon />}>Profile</NavItem>
      <NavItem href="/publish" icon={<AddIcon />}>Publish</NavItem>
      <NavItem href="/overview" icon={<ViewIcon />}>Overview</NavItem>
    </>
  )

  return (
    <Box as="header" bg={bgColor} py={2} position="fixed" top={0} left={0} right={0} zIndex={1000} boxShadow="0 2px 4px rgba(0,0,0,0.1)">
      <Flex maxW="container.xl" mx="auto" px={4} justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          {!session && !loading && (
            <Button
              bg={accentColor}
              color={textColor}
              size="sm"
              onClick={() => signIn("worldcoin")}
              _hover={{ bg: hoverBgColor }}
            >
              Sign in
            </Button>
          )}
          {session?.user && (
            <Flex alignItems="center">
              <Avatar size="sm" name={session.user.name} src={session.user.image} />
              <Button 
                ml={2} 
                size="sm" 
                variant="ghost" 
                onClick={() => signOut()} 
                color={textColor}
                _hover={{ bg: hoverBgColor }}
              >
                Sign out
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
  )
}