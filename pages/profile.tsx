import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { Box, Flex, VStack, Heading, Text, Button, useToast, SimpleGrid, useMediaQuery } from "@chakra-ui/react"
import Layout from "../components/layout"
import { useWeb3AuthContext } from "../contexts/Web3AuthContext"
import Web3 from "web3"

export default function DashboardPage() {
  const { web3, address, isConnected, isWeb3AuthReady } = useWeb3AuthContext()
  const [claimingProfits, setClaimingProfits] = useState(false)
  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    availableProfits: 0,
    completedTasks: 0,
    totalViews: 0,
    balance: '0'
  })
  const toast = useToast()
  const [isMobile] = useMediaQuery("(max-width: 48em)")
  const router = useRouter()

  useEffect(() => {
    if (isWeb3AuthReady && !isConnected) {
      toast({
        title: "Error",
        description: "You need to connect your wallet to view your profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      router.push('/feed');
    } else if (isConnected && web3) {
      fetchUserStats();
    }
  }, [isWeb3AuthReady, isConnected, web3, router, toast]);

  const fetchUserStats = async () => {
    try {
      // Fetch balance
      const balance = await web3.eth.getBalance(address);
      const balanceInEth = Web3.utils.fromWei(balance, 'ether');

      // For now, we'll still use mock data for other stats
      setUserStats({
        totalEarnings: 1000,
        availableProfits: 250,
        completedTasks: 15,
        totalViews: 10000,
        balance: parseFloat(balanceInEth).toFixed(4)
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast({
        title: "Error fetching data",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleClaimProfits = async () => {
    setClaimingProfits(true)
    try {
      // Replace this with actual blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating transaction
      toast({
        title: "Profits claimed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      // Update user stats after claiming
      await fetchUserStats();
    } catch (error) {
      toast({
        title: "Failed to claim profits",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setClaimingProfits(false)
    }
  }

  if (!isWeb3AuthReady || !isConnected) {
    return null; // or a loading spinner
  }

  return (
    <Layout>
      <Box p={6} maxW="container.md" mx="auto" mt={isMobile ? "60px" : "80px"} bg="#f5f1e8" color="black">
        <VStack spacing={8} align="stretch">
          <Heading fontSize={["2xl", "3xl"]} fontWeight="medium">
            Welcome back, {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User'}
          </Heading>
          
          <SimpleGrid columns={[1, 2]} spacing={6}>
            <StatBox label="Wallet Balance" value={`${userStats.balance} ETH`} />
            <StatBox label="Total Earnings" value={`$${userStats.totalEarnings.toFixed(2)}`} />
            <StatBox label="Available Profits" value={`$${userStats.availableProfits.toFixed(2)}`} />
            <StatBox label="Completed Tasks" value={userStats.completedTasks} />
            <StatBox label="Total Views" value={userStats.totalViews.toLocaleString()} />
          </SimpleGrid>
          <Box borderWidth="1px" borderColor="black" p={6} borderRadius="md" bg="white">
            <Flex direction="column" align="center" gap={4}>
              <Text fontSize="lg" fontWeight="medium" color="gray.600">
                Claimable Profits
              </Text>
              <Heading fontSize="3xl" fontWeight="bold" color="#ffd598">
                ${userStats.availableProfits.toFixed(2)}
              </Heading>
              <Button
                size="lg"
                bg="#ffd598"
                color="black"
                _hover={{ bg: "#f5f1e8" }}
                onClick={handleClaimProfits}
                isLoading={claimingProfits}
                loadingText="Claiming..."
                disabled={userStats.availableProfits <= 0}
                width={["full", "auto"]}
              >
                Claim Profits
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Box>
    </Layout>
  )
}

const StatBox = ({ label, value }) => (
  <Box borderWidth="1px" borderColor="black" p={5} borderRadius="md" textAlign="center" bg="white">
    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
      {label}
    </Text>
    <Text fontSize="2xl" fontWeight="bold" color="#ffd598">
      {value}
    </Text>
  </Box>
)