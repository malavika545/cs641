// app/(home)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TodoService } from '../../services/toDoService';

export default function HomeScreen() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0
    });

    useEffect(() => {
        loadTodoStats();
    }, [user]);

    const loadTodoStats = async () => {
        if (!user) return;
        
        try {
            const todos = await TodoService.getTodos(user.id);
            const completed = todos.filter(todo => todo.completed).length;
            
            setStats({
                total: todos.length,
                completed,
                pending: todos.length - completed
            });
        } catch (error) {
            console.error('Error loading todo stats:', error);
        }
    };

    const handleLogout = async () => {
        try {
            // Sign out from Clerk
            await signOut();
            // Router will automatically redirect to sign-in due to auth layout
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (!user) return null;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.welcomeText}>
                        Welcome back,
                    </Text>
                    <Text style={styles.userName}>
                        {user.firstName || user.emailAddresses[0].emailAddress}
                    </Text>
                </View>
                <TouchableOpacity 
                    onPress={handleLogout}
                    style={styles.logoutButton}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total Tasks</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
                        {stats.completed}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={[styles.statNumber, { color: '#FF9800' }]}>
                        {stats.pending}
                    </Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityCard}>
                    {stats.total === 0 ? (
                        <Text style={styles.emptyText}>
                            No todos yet. Start by adding one in the Todos tab!
                        </Text>
                    ) : (
                        <Text style={styles.activityText}>
                            You have completed {stats.completed} out of {stats.total} tasks
                            {stats.pending > 0 && ` with ${stats.pending} remaining`}.
                        </Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerContent: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 16,
        color: '#666666',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 4,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        padding: 10,
        borderRadius: 8,
        marginLeft: 10,
    },
    logoutText: {
        color: '#FF3B30',
        marginLeft: 5,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statCard: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 12,
    },
    activityCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activityText: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 24,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});