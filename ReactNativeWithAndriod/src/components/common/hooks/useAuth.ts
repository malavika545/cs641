import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';    

const auth = getAuth();

export const useAuth = () => {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setUser(null);
                return;
            }
            setUser(user);
        });
        return unsubscribe;
    }, []);

    return {user};

}