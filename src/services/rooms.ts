export interface Room {
  id: string;
  owner_id: string;
  invite_code: string;
  passcode_hash: string;
  is_active: boolean;
}
