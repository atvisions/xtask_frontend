// Mock API service - simulates backend API calls
// Data is stored in mock-data directory (temporary, can be deleted)

import tasksData from '../../mock-data/tasks.json'
import userData from '../../mock-data/user.json'
import myClaimedTasksData from '../../mock-data/my-claimed-tasks.json'
import myPublishedTasksData from '../../mock-data/my-published-tasks.json'
import withdrawHistoryData from '../../mock-data/withdraw-history.json'
import earningsHistoryData from '../../mock-data/earnings-history.json'

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API responses
export const mockApi = {
  // Auth APIs
  auth: {
    async twitterLogin() {
      await delay()
      return {
        success: true,
        data: {
          twitterId: '123456789',
          twitterUsername: '@JohnDoe',
        },
      }
    },

    async connectWallet(address: string) {
      await delay()
      return {
        success: true,
        data: {
          address,
          message: 'Please sign this message to verify your wallet ownership',
        },
      }
    },

    async verifySignature(address: string, signature: string) {
      await delay()
      return {
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: userData,
        },
      }
    },

    async payVerificationFee(txHash: string) {
      await delay(1000)
      return {
        success: true,
        data: {
          verified: true,
        },
      }
    },
  },

  // Task APIs
  tasks: {
    async getAll() {
      await delay()
      return {
        success: true,
        data: tasksData,
      }
    },

    async getById(id: string) {
      await delay()
      const task = tasksData.find(t => t.id === id)
      if (!task) {
        return {
          success: false,
          error: 'Task not found',
        }
      }
      return {
        success: true,
        data: task,
      }
    },

    async claim(taskId: string) {
      await delay()
      return {
        success: true,
        data: {
          claimedTaskId: 'claimed-' + Date.now(),
          message: 'Task claimed successfully',
        },
      }
    },

    async submit(claimedTaskId: string, proof: any) {
      await delay(1000)
      return {
        success: true,
        data: {
          message: 'Task submitted successfully',
        },
      }
    },

    async create(taskData: any) {
      await delay()
      return {
        success: true,
        data: {
          taskId: 'task-' + Date.now(),
          message: 'Task created successfully',
        },
      }
    },
  },

  // My Tasks APIs
  myTasks: {
    async getClaimed() {
      await delay()
      return {
        success: true,
        data: myClaimedTasksData,
      }
    },

    async getPublished() {
      await delay()
      return {
        success: true,
        data: myPublishedTasksData,
      }
    },
  },

  // User APIs
  user: {
    async getProfile() {
      await delay()
      return {
        success: true,
        data: userData,
      }
    },

    async getBalance() {
      await delay()
      return {
        success: true,
        data: {
          balance: userData.balance,
        },
      }
    },
  },

  // Profile APIs
  profile: {
    async getWithdrawHistory() {
      await delay()
      return {
        success: true,
        data: withdrawHistoryData,
      }
    },

    async getEarningsHistory() {
      await delay()
      return {
        success: true,
        data: earningsHistoryData,
      }
    },

    async withdraw(amount: number) {
      await delay(1000)
      return {
        success: true,
        data: {
          withdrawId: 'withdraw-' + Date.now(),
          txHash: '0x' + Math.random().toString(16).substring(2, 66),
          message: 'Withdrawal successful',
        },
      }
    },
  },

  // Withdraw APIs (deprecated - use profile.withdraw instead)
  withdraw: {
    async create(amount: number) {
      await delay(1000)
      return {
        success: true,
        data: {
          withdrawId: 'withdraw-' + Date.now(),
          txHash: '0x' + Math.random().toString(16).substring(2, 66),
          message: 'Withdrawal successful',
        },
      }
    },

    async getHistory() {
      await delay()
      return {
        success: true,
        data: withdrawHistoryData,
      }
    },
  },

  // Stats APIs (for homepage)
  stats: {
    async getAll() {
      await delay()
      return {
        success: true,
        data: {
          totalUsers: 10234,
          totalTasks: 125678,
          totalRewards: 52345.5,
        },
      }
    },
  },
}

export default mockApi

