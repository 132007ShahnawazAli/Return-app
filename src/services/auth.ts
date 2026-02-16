import * as SecureStore from 'expo-secure-store';

// ─── Types ───────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthSession {
    user: User;
    token: string;
}

// ─── Storage Keys ────────────────────────────────────────────────────
const SESSION_KEY = 'auth_session';

// SecureStore keys only allow alphanumeric, '.', '-', '_'
function sanitizeKey(email: string): string {
    return `user_${email.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
}

// ─── Auth Service ────────────────────────────────────────────────────
// Encapsulates all authentication logic. Currently uses local secure
// storage. To integrate a remote backend (Supabase, Firebase, etc.),
// swap ONLY the function implementations below — the interface stays.

/**
 * Sign in with email and password.
 * Currently: validates against locally stored credentials.
 * Future: call your API endpoint here.
 */
export async function signIn(
    email: string,
    password: string
): Promise<AuthSession> {
    // For now, check against locally stored user
    const key = sanitizeKey(email.toLowerCase());
    const stored = await SecureStore.getItemAsync(key);

    if (!stored) {
        throw new Error('No account found with this email');
    }

    const userData = JSON.parse(stored) as User & { password: string };

    if (userData.password !== password) {
        throw new Error('Invalid password');
    }

    const session: AuthSession = {
        user: { id: userData.id, name: userData.name, email: userData.email },
        token: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };

    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
    return session;
}

/**
 * Create a new account.
 * Currently: stores credentials in SecureStore.
 * Future: call your API registration endpoint.
 */
export async function signUp(
    name: string,
    email: string,
    password: string
): Promise<AuthSession> {
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const key = sanitizeKey(normalizedEmail);
    const existing = await SecureStore.getItemAsync(key);
    if (existing) {
        throw new Error('An account with this email already exists');
    }

    const user: User & { password: string } = {
        id: `user_${Date.now()}`,
        name,
        email: normalizedEmail,
        password,
    };

    // Store user credentials
    await SecureStore.setItemAsync(key, JSON.stringify(user));

    // Create session
    const session: AuthSession = {
        user: { id: user.id, name: user.name, email: user.email },
        token: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };

    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
    return session;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
}

/**
 * Get the current session from secure storage.
 * Returns null if no active session.
 */
export async function getSession(): Promise<AuthSession | null> {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthSession;
    } catch {
        await SecureStore.deleteItemAsync(SESSION_KEY);
        return null;
    }
}

/**
 * Send a password reset email.
 * Currently: no-op (local auth doesn't support this).
 * Future: call your API reset endpoint.
 */
export async function resetPassword(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    const key = sanitizeKey(normalizedEmail);
    const existing = await SecureStore.getItemAsync(key);

    if (!existing) {
        throw new Error('No account found with this email');
    }

    // In a real app, this would trigger an email.
    // For local auth, we just simulate success.
    return;
}
