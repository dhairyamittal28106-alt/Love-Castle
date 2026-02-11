
import { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    romanticUsername: string | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const ROMANTIC_ADJECTIVES = ['Secret', 'Hidden', 'Mysterious', 'Lovely', 'Charming', 'Sweet', 'Passionate', 'Dreamy', 'Moonlit', 'Eternal'];
const ROMANTIC_NOUNS = ['Admirer', 'Poet', 'Dreamer', 'Romeo', 'Juliet', 'Cupid', 'Soulmate', 'Heart', 'Rose', 'Star'];

const generateUsername = () => {
    const adj = ROMANTIC_ADJECTIVES[Math.floor(Math.random() * ROMANTIC_ADJECTIVES.length)];
    const noun = ROMANTIC_NOUNS[Math.floor(Math.random() * ROMANTIC_NOUNS.length)];
    return `${adj} ${noun}`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [romanticUsername, setRomanticUsername] = useState<string | null>(null);

    useEffect(() => {
        if (!auth || !db) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth!, async (user) => {
            setUser(user);
            if (user) {
                try {
                    // Check if user exists in DB, if not create with random username
                    const userRef = doc(db!, 'users', user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        if (data.romanticUsername) {
                            setRomanticUsername(data.romanticUsername);
                        } else {
                            // HEAL: User exists but no username? Generate one!
                            const newUsername = generateUsername();
                            await setDoc(userRef, { romanticUsername: newUsername }, { merge: true });
                            setRomanticUsername(newUsername);
                        }
                    } else {
                        const newUsername = generateUsername();
                        await setDoc(userRef, {
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            romanticUsername: newUsername,
                            createdAt: serverTimestamp()
                        });
                        setRomanticUsername(newUsername);
                    }
                } catch (error) {
                    console.error("Error fetching/creating user profile:", error);
                    setRomanticUsername(null);
                }
            } else {
                setRomanticUsername(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signInWithGoogle = async () => {
        if (!auth) {
            alert("Firebase configuration is missing. Please check your .env file.");
            return;
        }
        try {
            await signInWithPopup(auth!, googleProvider!);
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const logout = async () => {
        if (auth) {
            await signOut(auth!);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, romanticUsername, signInWithGoogle, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
