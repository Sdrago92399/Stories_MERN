import axiosInstance from "@/api/axios";

/**
 * Submit a new story
 * @param {Object} payload - { title, body, tags, isAnonymous }
 */
export const submitStoryApi = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/stories",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error submitting story:", error);
    throw error;
  }
};

/**
 * Fetch stories by approval status (admin only)
 * @param {string} status
 */
export const fetchStoriesByStatusApi = async (status) => {
  try {
    const response = await axiosInstance.get(
      `/stories/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};