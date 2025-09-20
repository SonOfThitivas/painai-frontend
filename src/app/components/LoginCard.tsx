import { TextField, Button, Box, Typography, Stack } from "@mui/material";

export default function FormPropsTextFields() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",      
        height: "100vh",           
        backgroundColor: "#e0e0e0", 
      }}
    >
      <Box
        sx={{
          width: "300px",
          padding: 4,
          backgroundColor: "#f0f0f0",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Stack spacing={2} direction="column">
          <Typography variant="h5" align="center">
            Login
          </Typography>

          <TextField
            id="outlined-required"
            label="User ID"
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
          />

          <Button variant="contained">
            Login
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
