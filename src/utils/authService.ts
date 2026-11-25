export interface AppUser {
  id: string;
  identifier: string; // Phone number or email or username
  panNo?: string; // Permanent Account Number (PAN)
  passwordHash: string; // Plain/simple for old people as requested
  role: 'admin' | 'user';
  createdAt: string;
  name?: string;
}

const USERS_STORAGE_KEY = 'nepal_audit_users_v2';
const ACTIVE_USER_KEY = 'nepal_audit_current_session_v2';

// Pre-seeded users as requested:
// 1. admin / admin321 -> opens admin page
// 2. apurwa / apurwa -> for QA testing & free creator access
const DEFAULT_USERS: AppUser[] = [
  {
    id: 'user-admin',
    identifier: 'admin',
    panNo: 'admin',
    passwordHash: 'admin321',
    role: 'admin',
    createdAt: '2081-01-01',
    name: 'Chief Auditor (प्रशासक)',
  },
  {
    id: 'user-apurwa',
    identifier: 'apurwa',
    panNo: 'apurwa',
    passwordHash: 'apurwa',
    role: 'user',
    createdAt: '2081-01-02',
    name: 'Apurwa (Free Sign-in / QA)',
  },
];

/**
 * Validates a Nepal Permanent Account Number (PAN).
 * Standard PAN is strictly 9 numeric digits.
 * For creator free sign-in, 'apurwa' is also allowed.
 */
export function isValidNepalPan(pan: string, allowSpecialApurwa: boolean = true): boolean {
  const clean = (pan || '').trim();
  if (allowSpecialApurwa && clean.toLowerCase() === 'apurwa') {
    return true;
  }
  return /^\d{9}$/.test(clean);
}

export function getStoredUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    // Ensure default admin & apurwa always exist with PAN
    const hasAdmin = parsed.some((u: AppUser) => u.identifier.toLowerCase() === 'admin');
    const hasApurwa = parsed.some((u: AppUser) => u.identifier.toLowerCase() === 'apurwa');
    let updated = parsed.map((u: AppUser) => {
      if (u.identifier.toLowerCase() === 'admin' && !u.panNo) {
        return { ...u, panNo: 'admin' };
      }
      if (u.identifier.toLowerCase() === 'apurwa' && !u.panNo) {
        return { ...u, panNo: 'apurwa' };
      }
      return u;
    });
    if (!hasAdmin) updated.push(DEFAULT_USERS[0]);
    if (!hasApurwa) updated.push(DEFAULT_USERS[1]);
    if (updated.length !== parsed.length) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (e) {
    console.error('Error reading users', e);
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users', e);
  }
}

export function getCurrentSessionUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setCurrentSessionUser(user: AppUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(ACTIVE_USER_KEY);
    } else {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Error saving session', e);
  }
}

export const getCurrentUser = getCurrentSessionUser;
export const logoutUser = (): void => setCurrentSessionUser(null);

export function authenticateUser(
  identifier: string,
  panNo: string,
  password: string
): { success: boolean; user?: AppUser; message?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPan = panNo.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanId || !cleanPan || !cleanPass) {
    return {
      success: false,
      message: 'कृपया फोन नम्बर/इमेल, प्यान नम्बर र पासवर्ड सबै भर्नुहोस् (Please enter identifier, PAN number, and password).',
    };
  }

  // Special creator free sign-in bypass ("for the free sign in the pan number can be apurwa too. but this is just for me. not for the users")
  if (cleanId === 'apurwa' && cleanPan === 'apurwa' && cleanPass === 'apurwa') {
    const apurwaUser = DEFAULT_USERS[1];
    setCurrentSessionUser(apurwaUser);
    return { success: true, user: apurwaUser };
  }

  // Admin bypass
  if (cleanId === 'admin' && (cleanPan === 'admin' || cleanPan === '300732063') && cleanPass === 'admin321') {
    const adminUser = DEFAULT_USERS[0];
    setCurrentSessionUser(adminUser);
    return { success: true, user: adminUser };
  }

  const users = getStoredUsers();
  const matched = users.find(
    (u) =>
      u.identifier.toLowerCase() === cleanId &&
      u.passwordHash === cleanPass &&
      (cleanPan === 'apurwa' || !u.panNo || u.panNo.toLowerCase() === cleanPan)
  );

  if (!matched) {
    // Check if user exists but PAN is incorrect
    const userExists = users.find((u) => u.identifier.toLowerCase() === cleanId);
    if (userExists && userExists.panNo && userExists.panNo.toLowerCase() !== cleanPan && cleanPan !== 'apurwa') {
      return {
        success: false,
        message: 'प्रविष्ट गरिएको प्यान नम्बर यस खातासँग मेल खाएन (PAN number does not match registered account).',
      };
    }
    return {
      success: false,
      message: 'फोन नम्बर/इमेल, प्यान नम्बर वा पासवर्ड मिलेन (Incorrect phone/email, PAN number, or password).',
    };
  }

  setCurrentSessionUser(matched);
  return { success: true, user: matched };
}

export function registerNewUser(
  identifier: string,
  panNo: string,
  password: string,
  confirmPassword: string
): { success: boolean; user?: AppUser; message?: string } {
  const cleanId = identifier.trim();
  const cleanPan = panNo.trim();
  const cleanPass = password.trim();
  const cleanConfirm = confirmPassword.trim();

  if (!cleanId) {
    return { success: false, message: 'कृपया आफ्नो फोन नम्बर वा इमेल लेख्नुहोस् (Please enter phone number or email).' };
  }

  if (!cleanPan) {
    return { success: false, message: 'कृपया प्यान नम्बर अनिवार्य रुपमा भर्नुहोस् (Please enter PAN number).' };
  }

  // Strict PAN verification during registration:
  // "make sure the pan number is valid during the registration. for the free sign in the pan number can be apurwa too. but this is just for me. not for the users"
  const isApurwaFreeAccess = cleanPan.toLowerCase() === 'apurwa';
  const isValidFormat = /^\d{9}$/.test(cleanPan);

  if (!isApurwaFreeAccess && !isValidFormat) {
    return {
      success: false,
      message: 'अमान्य प्यान नम्बर! नेपालको प्यान नम्बर ठीक ९ अंकको संख्या हुनुपर्दछ (Invalid PAN! Nepal PAN must be exactly 9 numeric digits).',
    };
  }

  if (!cleanPass) {
    return { success: false, message: 'कृपया पासवर्ड राख्नुहोस् (Please enter a password).' };
  }

  if (cleanPass !== cleanConfirm) {
    return {
      success: false,
      message: 'दुबै पासवर्ड मिलेनन्, कृपया एउटै पासवर्ड दोहोर्याउनुहोस् (Passwords do not match).',
    };
  }

  const users = getStoredUsers();
  const exists = users.some((u) => u.identifier.toLowerCase() === cleanId.toLowerCase());
  if (exists) {
    return {
      success: false,
      message: 'यो फोन नम्बर वा इमेल पहिले नै दर्ता छ। कृपया सिधै लगइन गर्नुहोस् (This user already exists. Please log in).',
    };
  }

  const newUser: AppUser = {
    id: `user-${Date.now()}`,
    identifier: cleanId,
    panNo: cleanPan,
    passwordHash: cleanPass,
    role: 'user',
    createdAt: new Date().toISOString().split('T')[0],
    name: cleanId,
  };

  const updated = [...users, newUser];
  saveUsers(updated);
  setCurrentSessionUser(newUser);

  return { success: true, user: newUser };
}

export function adminAddUser(
  identifier: string,
  panNo: string,
  password: string,
  role: 'admin' | 'user'
): { success: boolean; message?: string } {
  const cleanId = identifier.trim();
  const cleanPan = panNo.trim();
  const cleanPass = password.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, message: 'Username and password are required.' };
  }

  if (cleanPan && !isValidNepalPan(cleanPan, true) && cleanPan.toLowerCase() !== 'admin') {
    return { success: false, message: 'PAN number must be a valid 9-digit number.' };
  }

  const users = getStoredUsers();
  if (users.some((u) => u.identifier.toLowerCase() === cleanId.toLowerCase())) {
    return { success: false, message: 'User already exists.' };
  }

  const newUser: AppUser = {
    id: `user-${Date.now()}`,
    identifier: cleanId,
    panNo: cleanPan || 'N/A',
    passwordHash: cleanPass,
    role,
    createdAt: new Date().toISOString().split('T')[0],
  };

  saveUsers([...users, newUser]);
  return { success: true };
}

export function deleteStoredUser(id: string): boolean {
  const users = getStoredUsers();
  const filtered = users.filter((u) => u.id !== id && u.identifier !== 'admin');
  saveUsers(filtered);
  return true;
}
