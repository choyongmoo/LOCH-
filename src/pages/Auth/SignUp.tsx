import { uploadAvatar } from "@/services/users";
import { Box, Button, Container, FilledInput, TextField, Typography } from "@mui/material";
import { isAuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../../services/auth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // TODO: combine with uploadAvatar
      const { user } = await signUp(email, password, displayName);

      // FIXME: image upload
      if (avatar && user) {
        await uploadAvatar(avatar, user.id);
      }

      navigate("/");
    } catch (err: unknown) {
      if (isAuthError(err)) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <label htmlFor="avatar">Avatar</label>
        {avatar && (
          <Box sx={{ my: 2 }}>
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar preview"
              width={80}
              height={80}
              style={{ borderRadius: "50%" }}
            />
          </Box>
        )}
        <FilledInput
          type="file"
          fullWidth
          inputProps={{ accept: "image/*" }}
          onChange={(e) => setAvatar((e.target as HTMLInputElement).files?.[0] ?? null)}
          id="avatar"
        />
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
}
