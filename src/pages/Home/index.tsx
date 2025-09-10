import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SessionContext } from "../../contexts/SessionContext";
import { signOut } from "../../services/auth";
import { getUserProfile, type UserProfile } from "../../services/users";

export default function Home() {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      getUserProfile(session.user.id)
        .then((profile) => {
          setUserProfile(profile);
        })
        .catch((error) => {
          console.error("Failed to fetch user profile:", error);
        });
    }
  }, [session?.user?.id]);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {!session ? (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome Guest
          </Typography>
          <Button variant="contained" sx={{ mr: 2 }} onClick={() => navigate("/signin")}>
            Sign In
          </Button>
          <Button variant="outlined" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={userProfile?.avatar_url || undefined}
              sx={{ width: 64, height: 64, mr: 2 }}
            >
              {userProfile?.display_name?.charAt(0)?.toUpperCase() ||
                session.user.email?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                Welcome {userProfile?.display_name || session.user.email}
              </Typography>
              {userProfile?.display_name && (
                <Typography variant="body2" color="text.secondary">
                  {session.user.email}
                </Typography>
              )}
            </Box>
          </Box>
          <Button variant="contained" sx={{ mr: 2 }} onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="contained" color="error" onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      )}
    </Container>
  );
}
