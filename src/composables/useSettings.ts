import { ref, reactive, readonly, watch } from "vue";

interface Profile {
  name: string;
  email: string;
  picture: string | File;
}

interface Theme {
  mode: "light" | "dark" | "system";
  primaryColor: string;
}

interface Notifications {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface Security {
  twoFactor: "enabled" | "disabled";
}

const API_URL = "http://localhost:5000";

export function useSettings() {
  // State
  const profile = reactive<Profile>({
    name: "",
    email: "",
    picture: "",
  });

  const theme = reactive<Theme>({
    mode: "light",
    primaryColor: "#4f46e5",
  });

  const notifications = reactive<Notifications>({
    email: true,
    push: true,
    sms: false,
  });

  const security = reactive<Security>({
    twoFactor: "disabled",
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const applyTheme = () => {
    if (theme.mode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme.mode === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Apply primary color
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor,
    );
  };

  watch(
    () => theme.mode,
    () => {
      applyTheme();
    },
  );

  watch(
    () => theme.primaryColor,
    () => {
      applyTheme();
    },
  );

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return token;
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      error.value = err.message;
    } else if (typeof err === "string") {
      error.value = err;
    } else {
      error.value = "An unexpected error occurred";
    }
    console.error("Settings error:", err);
  };

  const updateProfile = (newProfile: Partial<Profile>) => {
    Object.assign(profile, newProfile);

    localStorage.setItem("userProfile", JSON.stringify(profile));
  };

  const updateTheme = (newTheme: Partial<Theme>) => {
    Object.assign(theme, newTheme);
    applyTheme();

    localStorage.setItem("userTheme", JSON.stringify(theme));
  };

  const updateNotifications = (newNotifications: Partial<Notifications>) => {
    Object.assign(notifications, newNotifications);
    // Update notifications in localStorage
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
  };

  const updateSecurity = (newSecurity: Partial<Security>) => {
    Object.assign(security, newSecurity);

    localStorage.setItem("userSecurity", JSON.stringify(security));
  };

  const fetchSettings = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const token = getAuthToken();

      const response = await fetch(`${API_URL}/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      if (data.status === "SUCCESS") {
        const settings = data.data.settings;
        updateProfile(settings.profile);
        updateTheme(settings.theme);
        updateNotifications(settings.notifications);
        updateSecurity(settings.security);
      }
    } catch (err) {
      handleError(err);
    } finally {
      isLoading.value = false;
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("picture", file);

      const response = await fetch(`${API_URL}/upload/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload picture");
      }

      if (data.status === "success") {
        updateProfile({ picture: data.data.url });
        return data.data.url;
      }
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const saveSettings = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const token = getAuthToken();

      let pictureUrl = profile.picture;
      if (typeof profile.picture !== "string") {
        const uploadedUrl = await uploadProfilePicture(profile.picture);
        if (uploadedUrl) {
          pictureUrl = uploadedUrl;

          updateProfile({ picture: uploadedUrl });
        } else {
          pictureUrl = "";
        }
      }

      const settingsData = {
        profile: {
          ...profile,
          picture: pictureUrl,
        },
        theme,
        notifications,
        security,
      };

      // console.log(
      //   "Sending settings to server:",
      //   JSON.stringify(settingsData, null, 2),
      // );

      const response = await fetch(`${API_URL}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();
      // console.log("Server response:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.message || "Failed to save settings");
      }

      if (data.status === "success") {
        const settings = data.data.settings;
        // console.log(
        //   "Updating local state with:",
        //   JSON.stringify(settings, null, 2),
        // );

        updateProfile(settings.profile);
        updateTheme(settings.theme);
        updateNotifications(settings.notifications);
        updateSecurity(settings.security);

        localStorage.setItem(
          "settings",
          JSON.stringify({
            profile: settings.profile,
            theme: settings.theme,
            notifications: settings.notifications,
            security: settings.security,
          }),
        );
        console.log("Settings saved to localStorage");
      } else {
        throw new Error(data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      handleError(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetSettings = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      // Reset to default values
      const defaultProfile = {
        name: "",
        email: "",
        picture: "",
      };

      const defaultTheme = {
        mode: "light",
        primaryColor: "#4f46e5",
      };

      const defaultNotifications = {
        email: true,
        push: true,
        sms: false,
      };

      const defaultSecurity = {
        twoFactor: "disabled",
      };

      // Update local state with defaults
      Object.assign(profile, defaultProfile);
      Object.assign(theme, defaultTheme);
      Object.assign(notifications, defaultNotifications);
      Object.assign(security, defaultSecurity);

      // Save to localStorage
      localStorage.setItem(
        "settings",
        JSON.stringify({
          profile: defaultProfile,
          theme: defaultTheme,
          notifications: defaultNotifications,
          security: defaultSecurity,
        }),
      );

      console.log("Settings reset to defaults successfully");
    } catch (err) {
      handleError(err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      updateProfile(settings.profile);
      updateTheme(settings.theme);
      updateNotifications(settings.notifications);
      updateSecurity(settings.security);
    }
  };

  applyTheme();

  return {
    profile: readonly(profile),
    theme: readonly(theme),
    notifications: readonly(notifications),
    security: readonly(security),
    isLoading: readonly(isLoading),
    error: readonly(error),

    updateProfile,
    updateTheme,
    updateNotifications,
    updateSecurity,
    fetchSettings,
    saveSettings,
    resetSettings,
    loadSettings,
    uploadProfilePicture,
  };
}
