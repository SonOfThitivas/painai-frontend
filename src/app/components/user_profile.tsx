"use client";

import React, { useState, useEffect,useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Grid,
  Chip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import { alpha } from "@mui/material/styles";
import theme from "./theme";
import {ThemeProvider } from "@mui/system";
import SideBarNavigator from "./SideBarNavigator";
import { useRouter } from "next/navigation";

// Interfaces
interface User {
  ID: string;
  Email: string;
  PasswordHash: string;
  DisplayName: string;
  AvatarURL: string;
  AvatarData: string; // Base64 encoded image data
  Bio: string;
  CreatedAt: string;
  UpdatedAt: string;
  Sex: string;
  Age: number;
}

interface AuthResponse {
  user: {
    email: string;
    name: string;
  };
}

interface Activity {
  ID: string;
  Title: string;
  Description: string;
  CreatedAt: string;
  Location: string;
  MaxParticipants: number| null;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const router = useRouter()

  // Activities state
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    sex: "",
    age: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch email from auth API
      const authResponse = await fetch(
        "https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/auth/auth/callback",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!authResponse.ok) {
        throw new Error(`Auth API error: ${authResponse.status}`);
      }

      const authData: AuthResponse = await authResponse.json();
      const userEmail = authData.user?.email;

      if (!userEmail) {
        throw new Error("No email found in auth response");
      }

      // Step 2: Fetch user details using the email
      const userResponse = await fetch(
        `https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/user/email/${encodeURIComponent(
          userEmail
        )}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error(`User API error: ${userResponse.status}`);
      }

      const userData: User = await userResponse.json();
      setUser(userData);

      // Initialize form data
      setFormData({
        displayName: userData.DisplayName || "",
        bio: userData.Bio || "",
        sex: userData.Sex || "",
        age: userData.Age?.toString() || "",
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        displayName: user.DisplayName || "",
        bio: user.Bio || "",
        sex: user.Sex || "",
        age: user.Age?.toString() || "",
      });
    }
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        email: user.Email,
        display_name: formData.displayName || null,
        bio: formData.bio || null,
        sex: formData.sex || null,
        age: formData.age ? parseInt(formData.age) : null,
      };

      const response = await fetch("https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/user/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();

      if (responseData.user) {
        setUser(responseData.user);
      } else if (responseData.ID || responseData.id) {
        setUser(responseData);
      } else {
        await fetchUserProfile();
      }

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatSex = (sex: string): string => {
    if (!sex) return "Not specified";
    return sex.charAt(0).toUpperCase() + sex.slice(1);
  };

  const formatBio = (bio: string): string => {
    if (!bio || bio === "Text your bio here.") {
      return "No bio yet. Share something about yourself!";
    }
    return bio;
  };

  // Fetch activities
  const fetchActivities = async () => {
    if (!user) return;
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      const response = await fetch(
        `https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/activity/by-user?user_id=${user.ID}`
        // `https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/activity/by-user?user_id=${"6ba208b0-f0a9-4ee8-8e3a-594085aaf31c"}`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: Activity[] = await response.json();
      setActivities(data);
    } catch (err) {
      setActivitiesError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleActivitiesOpen = () => {
    setActivitiesOpen(true);
    setExpandedActivity(null); // Reset expanded state when opening dialog
    fetchActivities();
  };

  const handleActivitiesClose = () => {
    setActivitiesOpen(false);
    setExpandedActivity(null);
  };

  const handleActivityClick = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLocation = (location: string): string => {
    if (!location || location.trim() === "") {
      return "Location not specified";
    }
    return location;
  };

  const formatMaxParticipants = (maxParticipants: number | null): string => {
  if (maxParticipants === null || maxParticipants === undefined) {
    return "Not specified";
  }
  return `${maxParticipants} participants`;
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      console.log("Uploading image for email:", user.Email);
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Use FormData with both image file and email
      const formData = new FormData();
      formData.append('image', file); // File field
      formData.append('email', user.Email); // Email field

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} =`, value);
      }

      const response = await fetch('https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/user/UpdateAvartarData', {
        method: 'PUT',
        credentials: 'include',
        body: formData, // Don't set Content-Type header, let browser set it with boundary
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Upload response:", responseData);
      
      // Update local state with the new avatar data
      if (responseData.avatar_data || responseData.AvatarData) {
        const newAvatarData = responseData.avatar_data || responseData.AvatarData;
        setUser(prev => prev ? { ...prev, AvatarData: newAvatarData } : prev);
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else if (responseData.user) {
        // If response has full user object
        setUser(responseData.user);
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        // If API doesn't return the data, refetch the user profile
        await fetchUserProfile();
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getImageSrc = (avatarData: string): string => {
    if (avatarData && avatarData.trim() !== '') {
      // Check if it already has data URL prefix
      if (avatarData.startsWith('data:image/')) {
        return avatarData;
      }
      // Assume it's base64 data and add the prefix
      return `data:image/jpeg;base64,${avatarData}`;
    }
    return '/BALDING.png';
  };


  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress />
        <Typography mt={2}>Loading profile...</Typography>
      </Box>
    );

  if (error && !user)
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ textAlign: "center", mt: 8 }}>
                <Typography >{error}</Typography>
                <Typography >Something went wrong.</Typography>
                <Typography >Please, sign in or try again.</Typography>
                <Button onClick={fetchUserProfile} variant="contained" sx={{ m: 2 }}>
                    Retry
                </Button>
                <Button onClick={()=>router.push("/login")} variant="contained" sx={{ m: 2 }}>
                    Login
                </Button>
            </Box>
        </ThemeProvider>
    );

  if (!user) return <Typography>No profile found.</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <SideBarNavigator/>
      <Box
        sx={{
          position: "flex",
          width: "100%",
          maxWidth: 450,
          mx: "auto",
          mt: 4,
          mb: 4,
          p: 3,
          borderRadius: 6,
          background: `linear-gradient(180deg, ${theme.palette.primary.main}  , ${theme.palette.secondary.main})`,
          color: theme.palette.background.default,
          boxShadow: 4,
          [theme.breakpoints.down('sm')]: { 
            maxWidth: '100%',           
            mx: 0,                     
            mt: 0,                    
            mb: 0,                      
            borderRadius: 0,            
            p: 2,                       
            minHeight: '100vh',         
          }
          }}
        >
        {/* Avatar */}
        <Box sx={{ textAlign: "center", mt: 3, mb: 5, position: "relative" }}>
          <Box 
            sx={{ 
              position: "relative", 
              display: "inline-block",
              cursor: isEditing ? "pointer" : "default",
              "&:hover": isEditing ? {
                "& .MuiAvatar-root": {
                  borderColor: "rgba(255,255,255,0.8)",
                  transform: "scale(1.05)",
                },
                "& .edit-overlay": {
                  opacity: 1,
                }
              } : {},
            }}
            onClick={handleImageClick}
          >
            <Avatar
              src={getImageSrc(user.AvatarURL)}
              alt={`${user.DisplayName}'s profile`}
              className="profile-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/BALDING.png";
              }}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                border: "4px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
              }}
            />
            
            {isEditing && (
              <Box
                className="edit-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0, 
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <EditRoundedIcon 
                  sx={{ 
                    color: "white", 
                    fontSize: 32,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                  }} 
                />
              </Box>
            )}
          </Box>
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {/* Editing Form */}
        {isEditing ? (

          <Box
            sx={{
              display: "flex",
              color: theme.palette.background.default,
              bgcolor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: "20px",
              p: 2,
              transition: "all 0.3s ease",
              mb: 2,
              gap: 2,
            }}
          >
        
            <Grid container direction={"row"} justifyContent={"center"} spacing={2.5} padding={2}>
              <Grid size={12}>
                <Typography mb={1}>
                  Display Name
                </Typography>
                <TextField
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: alpha(theme.palette.background.default, 0.15),
                    "& .MuiInputBase-input": {
                      color: theme.palette.background.default, 
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.4)",
                        borderRadius: "10px",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.background.default,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid  size={12}>
                <Typography mb={1}>
                  Bio
                </Typography>
                <TextField
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  minRows={4}
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: alpha(theme.palette.background.default, 0.15),
                    "& .MuiInputBase-input": {
                      color: theme.palette.background.default, 
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.4)",
                        borderRadius: "10px",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.background.default,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid  size={12}>
                <Typography mb={1}>
                  Sex
                </Typography>
                <TextField
                  select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: alpha(theme.palette.background.default, 0.15),
                    "& .MuiInputBase-input": {
                      color: theme.palette.background.default, 
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.4)",
                        borderRadius: "10px",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.background.default,
                      },
                    },
                  }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid  size={12}>
                <Typography>
                  Age
                </Typography>
                <TextField
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: alpha(theme.palette.background.default, 0.15),
                    "& .MuiInputBase-input": {
                      color: theme.palette.background.default, 
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.4)",
                        borderRadius: "10px",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.background.default,
                      },
                    },
                  }}
                />
              </Grid>

              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  color="success"
                  disabled={saving}
                  startIcon={<SaveIcon />}
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: "1.1rem",
                    borderRadius: "12px",
                  }}
                >
                  {saving ? <CircularProgress size={24} sx={{ color: "lightgrey" }} /> : "Save"}
                </Button>
                
                <Button 
                  variant="contained" 
                  onClick={handleCancel} 
                  disabled={saving} 
                  color="error" 
                  startIcon={<CancelIcon />}
                  fullWidth
                  sx={{
                    py: 2,        
                    fontSize: "1.1rem",
                    borderRadius: "12px",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Box>
        ) : (
          <>
            {successMessage && (
              <Box
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: "20px",
                  p: 2,
                  transition: "all 0.3s ease",
                  mb: 2,
                  justifyItems: "center",
                  alignContent: "center",
                }}
              >
                <Typography align="center" color="background.default" padding={1.5}>
                  {successMessage}
                </Typography>
              </Box>
            )}

            {/* User Info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" align="center">
                {user.DisplayName}
              </Typography>
            </Box>
            <Box>
              <Typography align="center" sx={{ opacity: 0.8, mb: 4 }}>
                {formatBio(user.Bio)}
              </Typography>
            </Box>

            {/* Profile detail */}
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: "20px",
                p: 2,
                transition: "all 0.3s ease",
                mb: 2,
              }}
            >
              <Grid container spacing={2} direction="column">
                {/* Gender */}
                <Grid container alignItems="center" justifyContent="space-between"
                  sx={{
                    p: 1,
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    mb: 1,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      backgroundColor: alpha(theme.palette.background.default, 0.15),
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Typography padding={1}>Gender</Typography>
                  <Chip
                    label={formatSex(user.Sex)}
                    sx={{
                      color: theme.palette.background.paper, 
                      bgcolor: alpha(theme.palette.primary.main, 0.5),   
                      textTransform: "capitalize",
                    }}
                  />
                </Grid>

                {/* Age */}
                <Grid container alignItems="center" justifyContent="space-between"
                  sx={{
                    p: 1,
                    color: "background.default",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    mb: 1,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      backgroundColor: alpha(theme.palette.background.default, 0.15),
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Typography padding={1}>Age</Typography>
                  <Chip
                    label={`${user.Age} years old`} 
                    sx={{
                      color: theme.palette.background.paper, 
                      bgcolor: alpha(theme.palette.primary.main, 0.5),   
                      textTransform: "capitalize",
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Buttons */}
            <Button
              variant="contained"
              onClick={handleActivitiesOpen}
              fullWidth
              sx={{
                background: alpha(theme.palette.primary.main, 0.9),
                color: theme.palette.background.default,
                mt: 2,
                padding: 3,
                borderRadius: "16px",
                "&:hover": {
                  transform: "translateY(-2px)",
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              My Activities
            </Button>
            <Button
              variant="contained"
              onClick={handleEdit}
              startIcon={<EditRoundedIcon />}
              sx={{
                background: alpha(theme.palette.primary.main, 0.9),
                mt: 2,
                padding: 3,
                borderRadius: "16px",
                "&:hover": {
                  transform: "translateY(-2px)",
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
              fullWidth
            >
              Edit Profile
            </Button>

            {/* Activities Dialog */}
            <Dialog open={activitiesOpen} onClose={handleActivitiesClose} fullWidth maxWidth="sm">
              <DialogTitle sx={{ 
                bgcolor: theme.palette.primary.main,
                color: theme.palette.background.default
              }}>
                My Activities
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                {activitiesLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                )}
                {activitiesError && (
                  <Typography color="error" sx={{ p: 2 }}>
                    {activitiesError}
                  </Typography>
                )}
                {!activitiesLoading && !activitiesError && activities.length === 0 && (
                  <Typography sx={{ p: 2, textAlign: 'center' }}>
                    No activities found. Start creating one!
                  </Typography>
                )}
                {!activitiesLoading && activities.length > 0 && (
                  <List sx={{ width: '100%' }}>
                    {activities.map((activity) => (
                      <div key={activity.ID}>
                        <ListItemButton 
                          onClick={() => handleActivityClick(activity.ID)}
                          sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <ListItemText 
                            primary={activity.Title}
                            secondary={`Created: ${formatDate(activity.CreatedAt)}`}
                          />
                          <IconButton edge="end" size="small">
                            {expandedActivity === activity.ID ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </ListItemButton>
                        <Collapse in={expandedActivity === activity.ID} timeout="auto" unmountOnExit>
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: 'background.default',
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}>
                            {/* Description */}
                            <Typography gutterBottom>
                              Description:
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {activity.Description || "No description provided."}
                            </Typography>

                            {/* Location */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                                Location:
                              </Typography>
                              <Typography variant="body2">
                                {formatLocation(activity.Location)}
                              </Typography>
                            </Box>

                            {/* Max Participation */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <PeopleIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                                Max Participants:
                              </Typography>
                              <Typography variant="body2">
                                {formatMaxParticipants(activity.MaxParticipants)}
                              </Typography>
                            </Box>

                            {/* Activity ID */}
                            <Typography variant="caption" color="text.secondary">
                              Activity ID: {activity.ID}
                            </Typography>
                          </Box>
                        </Collapse>
                      </div>
                    ))}
                  </List>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default UserProfile;