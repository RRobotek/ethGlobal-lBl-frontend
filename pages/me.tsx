import { useSession } from "next-auth/react"
import { useState } from "react"
import { Box, Flex, VStack, Heading, Text, Button, useToast, SimpleGrid, useMediaQuery } from "@chakra-ui/react"
import Layout from "../components/layout"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [claimingProfits, setClaimingProfits] = useState(false)
  const toast = useToast()
  const [isMobile] = useMediaQuery("(max-width: 48em)")

  // Mock data - replace with actual data fetching logic
  const userStats = {
    totalEarnings: 1000,
    availableProfits: 250,
    completedTasks: 15,
    totalViews: 10000
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
      <Box p={6} maxW="container.md" mx="auto" mt={isMobile ? "60px" : "80px"} bg="black" color="white">
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

          <Box borderWidth="1px" borderColor="gray.800" p={6} borderRadius="md">
            <Flex direction="column" align="center" gap={4}>
              <Text fontSize="lg" fontWeight="medium" color="gray.400">
                Claimable Profits
              </Text>
              <Heading fontSize="3xl" fontWeight="bold">
                ${userStats.availableProfits.toFixed(2)}
              </Heading>
              <Button
                size="lg"
                bg="white"
                color="black"
                _hover={{ bg: "gray.200" }}
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
  <Box borderWidth="1px" borderColor="gray.800" p={5} borderRadius="md" textAlign="center">
    <Text fontSize="sm" fontWeight="medium" color="gray.400" mb={2}>
      {label}
    </Text>
    <Text fontSize="2xl" fontWeight="bold">
      {value}
    </Text>
  </Box>
)
