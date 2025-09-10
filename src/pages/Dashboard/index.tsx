import { useSession } from "@/contexts/SessionContext";
import { updateLivekitRoom } from "@/utils/livekit";
import { supabase } from "@/utils/supabase";
import { Add, ContentCopy, Login, Refresh } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [shareCode, setShareCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const session = useSession();

  useEffect(() => {
    const fetchMyRoom = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("rooms")
        .select("share_code, passcode_hash")
        .eq("owner_id", session.session?.user.id)
        .single();

      console.log(session.session?.user.id);

      if (error) console.log(error.message);

      if (!error && data) {
        setShareCode(data.share_code);

        if (data.passcode_hash) {
          setShowPasscode(true);
          setPasscode(new TextDecoder().decode(data.passcode_hash));
        }
      }
    };

    fetchMyRoom();
  }, [session]);

  const handleCopyShareCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      showNotification("Share code copied to clipboard!", "success");
    } catch {
      showNotification("Failed to copy share code", "error");
    }
  };

  const handleCopyShareUrl = async () => {
    const shareUrl = `${window.location.origin}/room/${shareCode}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showNotification("Share URL copied to clipboard!", "success");
    } catch {
      showNotification("Failed to copy share URL", "error");
    }
  };

  const handleRefreshShareCode = async () => {
    // Generate new share code logic here
    showNotification("Share code refreshed!", "success");
  };

  const handleCreateRoom = async () => {
    if (!session) {
      showNotification("Please sign in to create a room", "error");
      return;
    }

    try {
      updateLivekitRoom(shareCode, passcode);
      navigate(`/room/${shareCode}`);
      showNotification("Room created successfully!", "success");
    } catch {
      showNotification("Failed to create room", "error");
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      navigate(`/room/${inviteCode}`);
    } else {
      showNotification("Please enter an invite code", "error");
    }
  };

  const showNotification = (message: string, severity: "success" | "error") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {/* Share Code Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Your Share Code
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontFamily: "monospace",
              fontWeight: "bold",
              color: "primary.main",
              flex: 1,
            }}
          >
            {shareCode || "Loading..."}
          </Typography>

          <IconButton
            onClick={handleCopyShareCode}
            color="primary"
            size="large"
            sx={{ border: "1px solid", borderColor: "primary.main" }}
          >
            <ContentCopy />
          </IconButton>

          <IconButton
            onClick={handleRefreshShareCode}
            color="primary"
            size="large"
            sx={{ border: "1px solid", borderColor: "primary.main" }}
          >
            <Refresh />
          </IconButton>
        </Box>

        {/* Share URL */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            {shareCode
              ? `${window.location.origin}/room/${shareCode}`
              : "Share URL will appear here"}
          </Typography>
          <IconButton onClick={handleCopyShareUrl} size="small" color="primary">
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      {/* Passcode Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showPasscode}
              onChange={(e) => setShowPasscode(e.target.checked)}
              color="primary"
            />
          }
          label="Set Room Passcode"
        />

        {showPasscode && (
          <TextField
            fullWidth
            label="Room Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter room passcode"
            sx={{ mt: 2 }}
            size="medium"
          />
        )}
      </Paper>

      {/* Create Room Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<Add />}
          onClick={handleCreateRoom}
          sx={{ py: 1.5 }}
        >
          Create New Room
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      {/* Join Room Section */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Join Existing Room
        </Typography>

        <Box component="form" onSubmit={handleJoinRoom}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter invite code"
              size="medium"
            />
            <Button type="submit" variant="outlined" startIcon={<Login />} sx={{ px: 3 }}>
              Join Room
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
