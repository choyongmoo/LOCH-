refine protected route, session provider logic

implement edge function auth logic

<!-- demo room: for unauthorized users with limited access
generate token without creating room record (generate room_id on client-side)

personal room: for authorized users, 1 room per user

group room: for user groups, n room per group with n members -->

uninstall livekit server sdk

ts, eslint configuration

supabase storage upload fix
update UI to use passcode logic
room ui opensource?
build agent server, tts, stt, llm api keys

MUI MCP, react etc MCP?

---

refine dashboard UI / logic
refine logics / supabase policies
improve overall code quality
refine room UI and fix errors

fetch room data when dashboard init
if room data changed, create room button -> update room()
else -> join room()

---

update room (shareCode, passcode)
find room row by userid
if passcode; hash passcode
compare shareCode, passcode
if modified; update row

join room (shareCode, passcode)
find room row by shareCode
if room owner is user; create token with admin grant
if passcode; hash passcode
find row
compare passcode
if successful; create token with guest grant

http://localhost:5173/room/580305008?pwd=akghki2asd324
