import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from 'next/router'
import { Box, Flex, VStack, Heading, Text, Button, useToast, SimpleGrid, useMediaQuery } from "@chakra-ui/react"
import Layout from "../components/layout"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [claimingProfits, setClaimingProfits] = useState(false)
  const toast = useToast()
  const [isMobile] = useMediaQuery("(max-width: 48em)")
  const router = useRouter()

  // Mock data - replace with actual data fetching logic
  const userStats = {
    totalEarnings: 1000,
    availableProfits: 250,
    completedTasks: 15,
    totalViews: 10000
  }

  if (!session || !session.user) { 
      toast({
        title: "Error",
        description: "You need to be signed in to view your profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      router.push('/feed');
    }

  const handleClaimProfits = async () => {
    setClaimingProfits(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating API call
      toast({
        title: "Profits claimed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
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

   return (
    <Layout>
      <Box p={6} maxW="container.md" mx="auto" mt={isMobile ? "60px" : "80px"} bg="#f5f1e8" color="black">
        <VStack spacing={8} align="stretch">
          <Heading fontSize={["2xl", "3xl"]} fontWeight="medium">
            Welcome back, {session?.user?.name}
          </Heading>
          
          <SimpleGrid columns={[1, 2]} spacing={6}>
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