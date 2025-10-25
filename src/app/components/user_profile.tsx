"use client";

import React, { useState, useEffect } from "react";
import {Box,Button,TextField,Typography,Paper,Avatar,CircularProgress,Grid,Chip,MenuItem} from "@mui/material";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { alpha } from '@mui/material/styles';
import theme from "./theme"
import { keyframes, ThemeProvider } from "@mui/system";

// Interfaces
interface User {
  ID: string;
  Email: string;
  DisplayName: string;
  AvatarURL: string;
  Bio: string;
  Sex: string;
  Age: number;
}

interface AuthResponse {
  user: {
    email: string;
    name: string;
  };
}

// Float animation for avatar
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    sex: '',
    age: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch email from auth API
      const authResponse = await fetch('http://localhost:8000/api/v1/auth/auth/callback', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!authResponse.ok) {
        throw new Error(`Auth API error: ${authResponse.status}`);
      }

      const authData: AuthResponse = await authResponse.json();
      const userEmail = authData.user?.email;

      if (!userEmail) {
        throw new Error('No email found in auth response');
      }

      // Step 2: Fetch user details using the email
      const userResponse = await fetch(`http://localhost:8000/api/v1/user/email/${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error(`User API error: ${userResponse.status}`);
      }

      const userData: User = await userResponse.json();
      setUser(userData);
      
      // Initialize form data
      setFormData({
        displayName: userData.DisplayName || '',
        bio: userData.Bio || '',
        sex: userData.Sex || '',
        age: userData.Age?.toString() || ''
      });

    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
    // Reset form data to current user data
    if (user) {
      setFormData({
        displayName: user.DisplayName || '',
        bio: user.Bio || '',
        sex: user.Sex || '',
        age: user.Age?.toString() || ''
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
        age: formData.age ? parseInt(formData.age) : null
      };
      
      console.log("Sending update data:", updateData);

      const response = await fetch('http://localhost:8000/api/v1/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Full API response:", responseData);
      
      // Check what structure we're getting back
      if (responseData.user) {
        // If response has nested user object
        setUser(responseData.user);
      } else if (responseData.ID || responseData.id) {
        // If response is the user object directly
        setUser(responseData);
      } else {
        console.warn("Unexpected response structure:", responseData);
        // If API doesn't return user data, refetch it
        await fetchUserProfile();
      }
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const getImageSrc = (avatarURL: string): string => {
      return avatarURL && avatarURL.trim() !== '' ? avatarURL : '/BALDING.png';
    };
  
    const formatSex = (sex: string): string => {
      if (!sex) return 'Not specified';
      return sex.charAt(0).toUpperCase() + sex.slice(1);
    };
  
    const formatBio = (bio: string): string => {
      if (!bio || bio === 'Text your bio here.') {
        return 'No bio yet. Share something about yourself!';
      }
      return bio;
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
        <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography color="error">{error}</Typography>
            <Button onClick={fetchUserProfile} variant="contained" sx={{ mt: 2 }}>
            Retry
            </Button>
        </Box>
        );

    if (!user) return <Typography>No profile found.</Typography>;

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                position: "relative",
                maxWidth: 450,
                mx: "auto",
                mt: 4,
                p: 3,
                borderRadius: 6,
                background: `linear-gradient(180deg, ${theme.palette.primary.main}  , ${theme.palette.secondary.main})`,
                color: theme.palette.background.default,
                boxShadow: 4,
                }}
            >
                
                {/* Avatar */}
                <Box sx={{ textAlign: "center", mt:3,mb: 5}}>
                    <Avatar
                        src={getImageSrc(user.AvatarURL)}
                        alt={`${user.DisplayName}'s profile`}
                        className="profile-image"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/BALDING.png';
                        }}
                    sx={{
                        width: 120,
                        height: 120,
                        mx: "auto",
                        border: "4px solid rgba(255,255,255,0.3)",
                        animation: `${float} 6s ease-in-out infinite`,
                        }}
                        />
                </Box>

                

                {/* Editing Form */}
                {isEditing ? (

                    <Box
                        sx={{
                            display: "flex",
                            color:theme.palette.background.default,
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            borderRadius: "20px",
                            p: 2,
                            transition: "all 0.3s ease",
                            mb: 2,
                            gap: 2,
                        }}
                    >
                        <Grid container direction={"row"} justifyContent={"center"} spacing={2.5} padding={2}>

                            <Grid size={12} >
                                <Typography mb={1}>
                                    Display Name
                                </Typography>
                                <TextField
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{
                                    borderRadius:"10px",
                                    backgroundColor: alpha(theme.palette.background.default, 0.15),
                                    "& .MuiInputBase-input": {
                                    color: theme.palette.background.default, 
                                    },
                                    "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "rgba(255,255,255,0.4)", // สีกรอบปกติ
                                        borderRadius:"10px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white", // สีกรอบตอน hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: theme.palette.background.default, // สีกรอบตอน focus
                                    },
                                    },
                                    }}
                                    />
                            </Grid>

                            <Grid size={12}>
                                
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
                                    borderRadius:"10px",
                                    backgroundColor: alpha(theme.palette.background.default, 0.15),
                                    "& .MuiInputBase-input": {
                                    color: theme.palette.background.default, 
                                    },
                                    "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "rgba(255,255,255,0.4)", // สีกรอบปกติ
                                        borderRadius:"10px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white", // สีกรอบตอน hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: theme.palette.background.default, // สีกรอบตอน focus
                                    },
                                    },
                                    }}
                                    />
                            </Grid>

                            <Grid size={12}>
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
                                        borderRadius:"10px",
                                        backgroundColor: alpha(theme.palette.background.default, 0.15),
                                        "& .MuiInputBase-input": {
                                        color: theme.palette.background.default, 
                                        },
                                        "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "rgba(255,255,255,0.4)",
                                            borderRadius:"10px",
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

                            <Grid size={12}>
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
                                    borderRadius:"10px",
                                    backgroundColor: alpha(theme.palette.background.default, 0.15),
                                    "& .MuiInputBase-input": {
                                    color: theme.palette.background.default, 
                                    },
                                    "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "rgba(255,255,255,0.4)", // สีกรอบปกติ
                                        borderRadius:"10px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white", // สีกรอบตอน hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: theme.palette.background.default, // สีกรอบตอน focus
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
                                            py: 3,
                                            fontSize: "1.1rem",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        {saving ? < CircularProgress size={24} sx={{ color: "lightgrey" }} /> : "Save"}
                                    </Button>
                                
                                    <Button variant="contained" 
                                        onClick={handleCancel} 
                                        disabled={saving} 
                                        color="error" 
                                        startIcon={<CancelIcon />}
                                        fullWidth
                                        sx={{
                                            py: 1.5,        
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
                                    alignContent:"center"
                                }}
                                >
                                    <Typography align="center" color="background.default" padding={1.5}>
                                        {successMessage}
                                    </Typography>
                                </Box>
                            )}

                            {/* User Info*/}
                            <Box sx={{mb: 2}}>
                                <Typography variant="h5" align="center" >
                                    {user.DisplayName}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography align="center" sx={{ opacity: 0.8, mb: 4}}>
                                    {formatBio(user.Bio)}
                                </Typography>
                            </Box>

                            <Grid container spacing={2} direction={"row"} mb={2} >
                                <Grid size ={6}>
                                    <Box sx={{ 
                                        display: "flex", 
                                        justifyContent: "center", 
                                        bgcolor: alpha(theme.palette.primary.main, 0.3),
                                        borderRadius: "20px",
                                        padding: "0.9rem 1rem",
                                        transition: "all 0.3s ease",
                                        mb: 2,
                                        '&:hover': {
                                            transform: "translateY(-2px)",
                                            backgroundColor: alpha(theme.palette.background.default, 0.15),
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        },
                                        }}
                                    >
                                        <Grid direction={"column"} justifyItems={"center"} padding={1}  >
                                            <Typography fontSize={20} >{user.Age}</Typography>
                                            <Typography>Age</Typography>
                                        </Grid>
                                    </Box>     
                                </Grid>

                                <Grid size ={6} >
                                    <Box sx={{ 
                                        display: "flex", 
                                        justifyContent: "center", 
                                        bgcolor: alpha(theme.palette.primary.main, 0.3),
                                        border: "1px solid alpha(theme.palette.primary.main, 0.5)",
                                        borderRadius: "20px",
                                        padding: "0.9rem 1rem",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            transform: "translateY(-2px)",
                                            backgroundColor: alpha(theme.palette.background.default, 0.15),
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            },
                                        }}
                                    >
                                        <Grid direction={"column"} justifyItems={"center"} padding={1}>
                                            <Typography fontSize={20} sx={{
                                                '&::first-letter': {
                                                    textTransform: 'uppercase',
                                                }}}
                                            >
                                                {formatBio(user.Sex)}
                                            </Typography>
                                            <Typography> Gender </Typography>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* profile detail */}
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
                                    {/* Display Name */}
                                    <Grid container alignItems="center" justifyContent="space-between"
                                        sx={{
                                            p: 1,
                                            borderRadius: "16px",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                            transform: "translateY(-2px)",
                                            backgroundColor: alpha(theme.palette.background.default, 0.15),
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            },
                                        }}
                                        >
                                        <Typography padding={1} >Display Name</Typography>
                                        <Typography>{user.DisplayName}</Typography>
                                    </Grid>

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
                                        <Typography padding={1} >Age</Typography>
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
                                <Button variant="contained" 
                                onClick={handleEdit} 
                                startIcon={<EditRoundedIcon/>}
                                sx={{ 
                                    background:alpha(theme.palette.primary.main, 0.9),
                                    mt: 2, 
                                    padding:3,
                                    borderRadius:"16px",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        backgroundColor: alpha(theme.palette.primary.main, 0.5),
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    },
                                }} fullWidth
                                >
                                     Edit Profile
                                </Button>
                                </>
                            )}
                
                        </Box>

                    
        </ThemeProvider>
  );
};

export default UserProfile;