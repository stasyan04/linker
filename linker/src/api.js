const BASE_URL = "http://localhost:8000";

export const api = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("grant_type", "password");

    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    return response.json();
  },

  register: async (username, password, fullName) => {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        full_name: fullName || null,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${BASE_URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  },

  getUserUrls: async (token, page = 1) => {
    const response = await fetch(`${BASE_URL}/api/me/urls?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch URLs");
    }

    return response.json();
  },

  createShortUrl: async (token, url) => {
    const response = await fetch(`${BASE_URL}/api/me/urls`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create short URL");
    }

    return response.json();
  },

  getUrlStats: async (token, shortUrl) => {
    const response = await fetch(`${BASE_URL}/api/me/links/${shortUrl}/redirects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch URL statistics");
    }

    return response.json();
  },
};