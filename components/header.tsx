import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack } from "@chakra-ui/react"
import { HamburgerIcon, AddIcon, ViewIcon, InfoIcon } from '@chakra-ui/icons'
import { useEffect } from 'react'

export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const bgColor = "rgba(0, 0, 0, 0.8)"
  const textColor = "white"
  const hoverBgColor = "rgba(255, 255, 255, 0.1)"

  useEffect(() => {
    if (session?.accessToken) {
      // You can use the accessToken to make authenticated requests to your FastAPI backend
      console.log("Access token:", session.accessToken)
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
      <NavItem href="/" icon={<InfoIcon />}>Home</NavItem>
      <NavItem href="/feed" icon={<ViewIcon />}>Feed</NavItem>
      <NavItem href="/me" icon={<InfoIcon />}>Profile</NavItem>
      <NavItem href="/publish" icon={<AddIcon />}>Publish</NavItem>
    </>
  )

  return (
    <Box as="header" bg={bgColor} py={2} position="fixed" top={0} left={0} right={0} zIndex={1000} backdropFilter="blur(5px)">
      <Flex maxW="container.xl" mx="auto" px={4} justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          {!session && !loading && (
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => signIn("worldcoin")}
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
              <MenuList bg={bgColor} borderColor="gray.600">
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
          <DrawerHeader>Navigation</DrawerHeader>
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
