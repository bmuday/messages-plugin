/**
 * Authentication service
 * Handles user authentication with Appwrite
 */

import { account, databases, databaseId } from './appwrite.js'
import { COLLECTIONS } from '@/config/appwrite-config.js'
import { setSession as setStorageSession, setUser, removeSession, removeUser } from './storage-service.js'
import { ID } from 'appwrite'

/**
 * Register a new user
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Promise<Object>} User object
 */
export async function register(email, password, username) {
  try {
    // Create account with Appwrite
    const accountResponse = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    // Create user document in database
    const userDoc = await databases.createDocument(
      databaseId,
      COLLECTIONS.USERS,
      ID.unique(),
      {
        userId: accountResponse.$id,
        username,
        email,
        communities: [],
        createdAt: new Date().toISOString()
      }
    )

    // Auto-login after registration
    const session = await login(email, password)

    return {
      account: accountResponse,
      user: userDoc,
      session
    }
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Session object
 */
export async function login(email, password) {
  try {
    // Create session with Appwrite
    const session = await account.createEmailPasswordSession(email, password)

    // Get user account details
    const accountDetails = await account.get()

    // Get user document from database
    const userDocs = await databases.listDocuments(
      databaseId,
      COLLECTIONS.USERS,
      [`userId:${accountDetails.$id}`]
    )

    const userDoc = userDocs.documents[0]

    // Store session and user in Chrome storage
    await setStorageSession(session)
    await setUser({
      id: accountDetails.$id,
      email: accountDetails.email,
      username: userDoc?.username || accountDetails.name,
      avatarUrl: userDoc?.avatarUrl || null,
      communities: userDoc?.communities || []
    })

    return {
      session,
      user: userDoc
    }
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    // Delete current session with Appwrite
    await account.deleteSession('current')

    // Clear Chrome storage
    await removeSession()
    await removeUser()
  } catch (error) {
    console.error('Logout failed:', error)
    // Clear storage even if API call fails
    await removeSession()
    await removeUser()
  }
}

/**
 * Get current session
 * @returns {Promise<Object|null>} Session object or null
 */
export async function getSession() {
  try {
    const session = await account.getSession('current')
    return session
  } catch (error) {
    // No active session
    return null
  }
}

/**
 * Get current user
 * @returns {Promise<Object|null>} User object or null
 */
export async function getCurrentUser() {
  try {
    const accountDetails = await account.get()

    // Get user document from database
    const userDocs = await databases.listDocuments(
      databaseId,
      COLLECTIONS.USERS,
      [`userId:${accountDetails.$id}`]
    )

    const userDoc = userDocs.documents[0]

    const user = {
      id: accountDetails.$id,
      email: accountDetails.email,
      username: userDoc?.username || accountDetails.name,
      avatarUrl: userDoc?.avatarUrl || null,
      communities: userDoc?.communities || []
    }

    // Update storage
    await setUser(user)

    return user
  } catch (error) {
    console.error('Get current user failed:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  try {
    const session = await getSession()
    return session !== null
  } catch (error) {
    return false
  }
}

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated user object
 */
export async function updateProfile(updates) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new Error('No user logged in')
    }

    // Find user document
    const userDocs = await databases.listDocuments(
      databaseId,
      COLLECTIONS.USERS,
      [`userId:${currentUser.id}`]
    )

    if (userDocs.documents.length === 0) {
      throw new Error('User document not found')
    }

    const userDocId = userDocs.documents[0].$id

    // Update user document
    const updatedDoc = await databases.updateDocument(
      databaseId,
      COLLECTIONS.USERS,
      userDocId,
      updates
    )

    // Update storage
    await setUser({
      ...currentUser,
      ...updates
    })

    return updatedDoc
  } catch (error) {
    console.error('Update profile failed:', error)
    throw error
  }
}

export default {
  register,
  login,
  logout,
  getSession,
  getCurrentUser,
  isAuthenticated,
  updateProfile
}
