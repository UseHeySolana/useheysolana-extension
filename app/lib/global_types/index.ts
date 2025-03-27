import { storage } from "../helpers/storage"

export const NETWORK = storage.get("network") || process.env.NEXT_PUBLIC_NETWORK || ""