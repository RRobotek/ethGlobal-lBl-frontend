import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { Box, Flex, VStack, Heading, Text, Button, useToast, SimpleGrid, useMediaQuery, Container } from "@chakra-ui/react"
import Layout from "../components/layout"
import { useWeb3AuthContext } from "../contexts/Web3AuthContext"
import Web3 from "web3"

const CONTRACT_ADDRESS = "0x6Efe62FE16CcAAb7e68923C42002308fc0011BC5";
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "balances",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function DashboardPage() {
  const { web3, address, isConnected, isWeb3AuthReady } = useWeb3AuthContext()
  const [claimingProfits, setClaimingProfits] = useState(false)
  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    completedTasks: 0,
    balance: '0'
  })
  const toast = useToast()
  const [isMobile] = useMediaQuery("(max-width: 48em)")
  const router = useRouter()
  const API_BASE_URL = 'https://goldfish-app-jyk4z.ondigitalocean.app/ethglobal-lbl-backend2';


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
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      
      const balance = await web3.eth.getBalance(address);
      const balanceInEth = Web3.utils.fromWei(balance, 'ether');

      const response = await fetch(`${API_BASE_URL}/logic/amountofvotesforuser/${address}`);
      const data = await response.json();
      const completedTasks = data.votes || 0;

      setUserStats({
        totalEarnings: 32.9,
        completedTasks: completedTasks,
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
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      await contract.methods.claim().send({ from: address });
      
      toast({
        title: "Profits claimed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      await fetchUserStats();
    } catch (error) {
      console.error("Error claiming profits:", error);
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
    return null;
  }

  return (
    <Layout>
      <Container maxW="container.md" px={4} bg="#f5f1e8" height="100vh">
        <VStack spacing={6} align="stretch" mt={isMobile ? 4 : 8}>
          <Heading fontSize={["xl", "2xl"]} fontWeight="medium" color="black">
            Welcome back, {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User'}
          </Heading>
          
          <SimpleGrid columns={[2, 2, 3]} spacing={4}>
            <StatBox label="Wallet Balance" value={`${userStats.balance} USDC`} />
            <StatBox label="Total Earnings" value={`$${userStats.totalEarnings.toFixed(2)}`} />
          </SimpleGrid>
                    <StatBox label="Completed Tasks" value={userStats.completedTasks} />

          <Box borderWidth="1px" borderColor="black" p={6} borderRadius="md" bg="white">
            <Flex direction="column" align="center" gap={4}>
              <Text fontSize="lg" fontWeight="medium" color="gray.600">
                Claimable Profits
              </Text>
              <Heading fontSize="3xl" fontWeight="bold" color="#ffd598">
                ${userStats.totalEarnings.toFixed(2)}
              </Heading>
              <Button
                size="lg"
                bg="#ffd598"
                color="black"
                _hover={{ bg: "#f5f1e8" }}
                onClick={handleClaimProfits}
                isLoading={claimingProfits}
                loadingText="Claiming..."
                disabled={userStats.totalEarnings <= 0}
                width="full"
              >
                Claim Profits
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Layout>
  )
}

const StatBox = ({ label, value }) => (
  <Box borderWidth="1px" borderColor="black" p={3} borderRadius="md" textAlign="center" bg="white">
    <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="bold" color="#ffd598">
      {value}
    </Text>
  </Box>
)